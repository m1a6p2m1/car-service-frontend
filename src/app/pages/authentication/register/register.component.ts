import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  AsyncValidatorFn,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, debounceTime, first, map, Observable, of, switchMap, timer } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';

export function usernameAvailableValidator(authService: HttpService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.value.length < 3) {
      return of(null);
    }

    return control.valueChanges.pipe(
      debounceTime(400),        // wait 400ms after user stops typing
      switchMap(value =>        // cancel previous request if new one comes in
        authService.checkUsername(value).pipe(
          map(res => res.taken ? { usernameTaken: true } : null),
          catchError(() => of(null))
        )
      ),
      first()                  // complete the observable after one emission
    );
  };
}

export function contactNumberAvailableValidator(httpService: HttpService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {

    const value = control.value;

    if (!value) {
      return of(null);
    }

    // Skip API call if sync validators already failed
    if (control.errors && !control.errors['contactExists']) {
      return of(null);
    }

    return timer(400).pipe(
      switchMap(() =>
        httpService.checkContactNumber(value).pipe(
          map((exists: boolean) =>
            exists ? { contactExists: true } : null
          ),
          catchError(() => of(null))
        )
      )
    );
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class AppSideRegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  // data: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      nic: ['', [Validators.required, Validators.pattern('^([0-9]{9}[x|X|v|V]|[0-9]{12})$')]],
      contactNumber: ['', [Validators.required, Validators.pattern('^(\\+94|0)[1-9]{2}[0-9]{7}$|^(\\+94|0)?7[0-9]{8}$')], [contactNumberAvailableValidator(this.httpService)]],
      address: [''],
      email: ['', [Validators.email, Validators.required]],
      login: ['', [Validators.required], [usernameAvailableValidator(this.httpService)]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // this.httpService
    //   .request('GET', '/messages', null)
    //   .then((response: any) => {
    //     this.data = response;
    //   });
  }

  get formControl() {
    return this.registerForm?.controls;
  }

  onSubmitRegister() {
    this.submitted = true;
    if (this.registerForm?.valid) {
      /* CUSTOMER ROLE will be added by default if the user is registering through system itself rather than thorugh Admin */
      this.httpService
        .request('POST', '/register', {
          firstName: this.registerForm.value.firstName,
          lastName: this.registerForm.value.lastName,
          nic: this.registerForm.value.nic,
          email: this.registerForm.value.email,
          contactNumber: this.registerForm.value.contactNumber,
          address: this.registerForm.value.address,
          login: this.registerForm.value.login,
          password: this.registerForm.value.password,
          role: 'CUSTOMER'
        })
        .then((response: any) => {
          this.httpService.setAuthToken(response.token);
          this.router.navigate(['/authentication/login']);
        });
    }
  }

  // checkContactNumber():void {
  //   const control  = this.registerForm.get('contactNumber');

  //   if(!control || control.invalid || !control.value) {
  //     return;
  //   }

  //   this.httpService.request('POST', '/check-contact', {
  //     contactNumber: control.value
  //   })
  //   .then((exists: boolean)  => {
  //     // this.phoneExists = exists ;

  //     const errors = { ...(control.errors || {}) };

  //     if (exists) {
  //       errors['contactExists'] = true;
  //     } else {
  //       delete errors['contactExists'];
  //     }

  //     control.setErrors(Object.keys(errors).length ? errors :null);
  //   });
  // }
}
