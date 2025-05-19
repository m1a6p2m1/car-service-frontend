import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { RegistrationService } from 'src/app/services/registration/registration.service';

@Component({
  selector: 'app-employee-login-details',
  standalone: false,
  templateUrl: './employee-login-details.component.html',
  styleUrl: './employee-login-details.component.scss'
})
export class EmployeeLoginDetailsComponent implements OnInit{
 
  employeeLoginDetailsForm: FormGroup;
  selectedEmployeeId: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, // <-- inject data here
    private fb: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private _dialogRef: MatDialogRef<EmployeeLoginDetailsComponent>,
    private registrationService: RegistrationService,
  ){
    this.employeeLoginDetailsForm = this.fb.group({
      firstName: new FormControl({value: '', disabled: true}),//
      lastName: new FormControl({value: '', disabled: true}),
      login: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(){

    console.log('Dialog Data:', this.data);
    if (this.data) {
    this.selectedEmployeeId = this.data.employeeId;
    this.employeeLoginDetailsForm.patchValue({
      firstName: this.data.firstName,
      lastName: this.data.lastName,
    });
  }

  }

  public createLogin(): void {
    try {
      // if (this.employeeLoginDetailsForm?.valid) {
      this.httpService
        .request('POST', '/employee-register', {
          employeeId: this.selectedEmployeeId,
          firstName: this.employeeLoginDetailsForm.getRawValue().firstName,
          lastName: this.employeeLoginDetailsForm.getRawValue().lastName,
          login: this.employeeLoginDetailsForm.value.login,
          password: this.employeeLoginDetailsForm.value.password,
        })
        .then((response: any) => {
          this.httpService.setAuthToken(response.token);
          this._dialogRef.close(true);
          // this.router.navigate(['/authentication/login']);
        });
    // }
    } catch (error) {
      console.log('create login error:',error);
    }
  }
    
}
