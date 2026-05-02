import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { CustomerService } from 'src/app/services/registration/customer.service';

@Component({
  selector: 'app-customer-login-details',
  standalone: false,
  templateUrl: './customer-login-details.component.html',
  styleUrl: './customer-login-details.component.scss'
})
export class CustomerLoginDetailsComponent {
  customerLoginDetailsForm: FormGroup;
  selectedCustomerId: any;
    constructor(
      @Inject(MAT_DIALOG_DATA) public data: any, // <-- inject data here
      private fb: FormBuilder,
      private router: Router,
      private httpService: HttpService,
      private _dialogRef: MatDialogRef<CustomerLoginDetailsComponent>,
      private customerService: CustomerService,
    ){
      this.customerLoginDetailsForm = this.fb.group({
        firstName: new FormControl({value: '', disabled: true}),//
        lastName: new FormControl({value: '', disabled: true}),
        email: new FormControl({ value: '', disabled: true }), 
        contactNumber: new FormControl({ value: '', disabled: true }),
        login: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
      });
    }
  
    ngOnInit(){
  
      console.log('Dialog Data:', this.data);
      if (this.data) {
      this.selectedCustomerId = this.data.customerId;

      this.customerService.getData().subscribe((res: any) => {
      // find selected customer from backend list
      const customer = res.find((c: any) => c.cusId === this.selectedCustomerId);

      if (customer) {
        this.customerLoginDetailsForm.patchValue({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          contactNumber: customer.contactNumber
        });
      }
    });
      // this.customerLoginDetailsForm.patchValue({
      //   firstName: this.data.firstName,
      //   lastName: this.data.lastName,
      //   email: this.data.email,
      //   contactNumber: this.data.contactNumber
      // });
    }
  
    }

    public createLogin(): void {
      try {
        // if (this.employeeLoginDetailsForm?.valid) {
        const formData = this.customerLoginDetailsForm.getRawValue();
        this.httpService
          .request('POST', '/customer-register', {
            customerId: this.selectedCustomerId,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            contactNumber: formData.contactNumber,
            login: formData.login,
            password: formData.password,
          })
          .then((response: any) => {
            // console.log('Customer Login');
            this.httpService.setAuthToken(response.token);
            this._dialogRef.close(true);
            // this.router.navigate(['/authentication/login']);
          });
      // }
      } catch (error) {
        console.log('create login error:',error);
      }
    }
  
    // public createLogin(): void {
    //   try {
    //     // if (this.employeeLoginDetailsForm?.valid) {
    //     this.httpService
    //       .request('POST', '/customer-register', {
    //         customerId: this.selectedCustomerId,
    //         firstName: this.customerLoginDetailsForm.get('firstName')?.value,
    //         lastName: this.customerLoginDetailsForm.get('lastName')?.value,
    //         email: this.data.email,
    //         contactNumber: this.data.contactNumber,
    //         login: this.customerLoginDetailsForm.value.login,
    //         password: this.customerLoginDetailsForm.value.password,
    //       })
    //       .then((response: any) => {
    //         // console.log('Customer Login');
    //         this.httpService.setAuthToken(response.token);
    //         this._dialogRef.close(true);
    //         // this.router.navigate(['/authentication/login']);
    //       });
    //   // }
    //   } catch (error) {
    //     console.log('create login error:',error);
    //   }
    // }

}
