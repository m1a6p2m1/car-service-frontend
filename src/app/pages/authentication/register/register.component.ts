import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

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
      phoneNumber: ['', [Validators.required, Validators.pattern('^(\\+94|0)[1-9]{2}[0-9]{7}$|^(\\+94|0)?7[0-9]{8}$')]],
      address: [''],
      email: ['', [Validators.email]],
      login: ['', [Validators.required]],
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
          phoneNumber: this.registerForm.value.phoneNumber,
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
}
