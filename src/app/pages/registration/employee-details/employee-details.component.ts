import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SafeUrl } from '@angular/platform-browser';
import { RegistrationService } from 'src/app/services/registration/registration.service';

export interface Employee {
  empNumber: number;
  fullName: string;
  callingName: string;
  nic: string;
  dob: string;
  gender: string;
  address: string;
  email: string;
  phoneNumber: string;
  emergencyPhoneNumber: string;
  bloodGroup: string;
  employmentType: string;
  employeeStatus: string;
  jobTitle: string;
  image: string;
  imageName: string;
  imageType: string;
}

@Component({
  selector: 'app-employee-details',
  standalone: false,
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.scss'
})
export class EmployeeDetailsComponent implements OnInit{
    employeeDetailsForm: FormGroup;
      selectedEmployeeId: any;
      selectedImageUrl!: SafeUrl | null;
      selectedData: any;
      dataSource: any;
      constructor(
        @Inject(MAT_DIALOG_DATA) public data: any, // <-- inject data here
        private fb: FormBuilder,
        private registrationService: RegistrationService,
      ){
        this.employeeDetailsForm = this.fb.group({
          fullName: new FormControl(''),
          callingName: new FormControl(''),
          nic: new FormControl(''),
          dob: new FormControl({ value: '', disabled: true }),
          gender: new FormControl({ value: '', disabled: true }),
          address: new FormControl(''),
          email: new FormControl(''),
          phoneNumber: new FormControl(''),
          emergencyPhoneNumber: new FormControl(''),
          bloodGroup: new FormControl({ value: '', disabled: true }),
          employmentType: new FormControl({ value: '', disabled: true }),
          employeeStatus: new FormControl({ value: '', disabled: true }),
          jobTitle: new FormControl({ value: '', disabled: true }),
          image: new FormControl(''),
          imageName: new FormControl(''),
          imageType: new FormControl(''),
        });
      }

      public ngOnInit(): void {
        this.selectedData = this.data;
        this.viewData();
      }

      public viewData(): void{

        const empId = this.selectedData?.empNumber;
        console.log("empId:", empId);

        if (!empId) {
          console.error("No employee ID provided.");
          return;
        }
        this.registrationService.getEmployeeById(empId).subscribe({
        next: (data: Employee) => {
          
      // Populate form
        this.employeeDetailsForm.patchValue(data);
      
      // Set image URL
        if (data.image && data.imageType) {
          this.selectedImageUrl = `data:${data.imageType};base64,${data.image}`;
        } else {
          this.selectedImageUrl = null;
        }

      // Disable the form to make it view-only
        // this.employeeDetailsForm.disable();
        },
        error: (err) => {
          console.error("Error fetching employee:", err);
        }
        });
      }
}
