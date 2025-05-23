import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { RegistrationService } from 'src/app/services/registration/registration.service';
import { EmployeeLoginDetailsComponent } from '../employee-login-details/employee-login-details.component';

const ELEMENT_DATA: any[] = [
  {
    fullName: '',
    callingName: '',
    nic: '',
    dob: '',
    gender: '',
    address: '',
    phoneNumber: '',
    emergencyPhoneNumber: '',
    bloodGroup: '',
    employmentType: '',
    employeeStatus: '',
    jobTitle: '',
    action: '',
  },
];

@Component({
  selector: 'app-employee',
  standalone: false,
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
})
export class EmployeeComponent implements OnInit {
  employeeForm: FormGroup;

  displayedColumns: string[] = [
    'callingName',
    'nic',
    'gender',
    'phoneNumber',
    'employeeStatus',
    'jobTitle',
    'action',
  ];

  // displayedColumns: string[] = ['fullName', 'callingName', 'nic', 'dob', 'gender', 'address', 'phoneNumber', 'emergencyPhoneNumber', 'bloodGroup', 'employmentType', 'employeeStatus', 'jobTitle', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  saveButtonLabel = 'Save';
  mode = 'add';
  selectedData!: { empNumber: number };
  isButtonDisable = false;
  submitted = false;
  selectedImageUrl!: SafeUrl | null;
  isFileSelected = false;
  fileButtonDisable = false;

  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private messageService: MessageServiceService,
    private sanitizer: DomSanitizer,
    private _dialog: MatDialog,
  ) {
    this.employeeForm = this.fb.group({
      fullName: new FormControl('', [Validators.required]),
      callingName: new FormControl(''),
      nic: new FormControl('', [
        Validators.pattern('^([0-9]{9}[x|X|v|V]|[0-9]{12})$'),
      ]),
      dob: new FormControl(''),
      gender: new FormControl(''),
      address: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email]),
      phoneNumber: new FormControl('', [
        Validators.pattern('^(\\+94|0)[1-9]{2}[0-9]{7}$|^(\\+94|0)?7[0-9]{8}$'),
      ]),
      emergencyPhoneNumber: new FormControl('', [
        Validators.pattern('^(\\+94|0)[1-9]{2}[0-9]{7}$|^(\\+94|0)?7[0-9]{8}$'),
      ]),
      bloodGroup: new FormControl('', [Validators.required]),
      employmentType: new FormControl(''),
      employeeStatus: new FormControl(''),
      jobTitle: new FormControl(''),
      image: new FormControl('', [Validators.required]),
      imageName: new FormControl(''),
      imageType: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.populateData();
  }

  get formControl() {
    return this.employeeForm?.controls;
  }

  public prepareEmployeeData(): FormData {
    const employeeFormData = new FormData();
    // demoFormData.append('demoForm', this.demoForm.value);
    employeeFormData.append(
      'employeeForm',
      new Blob([JSON.stringify(this.employeeForm.value)], {
        type: 'application/json',
      })
    );

    if (this.isFileSelected) {
      employeeFormData.append(
        'image',
        this.employeeForm.get('image')?.value,
        this.employeeForm.get('image')?.value.name
      );
    } else {
      const imageBlob = this.base64ToBlob(
        this.employeeForm.get('image')?.value,
        this.employeeForm.get('imageType')?.value
      );
      const file = new File(
        [imageBlob],
        this.employeeForm.get('imageName')?.value,
        { type: this.employeeForm.get('imageType')?.value }
      );
      employeeFormData.append('image', file, file.name);
      this.fileButtonDisable = false;
    }
    return employeeFormData;
  }

  base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  public onFileSelected(event: any): void {
    if (event.target.files) {
      const file = event.target.files[0];
      const url = this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(file)
      );
      this.selectedImageUrl = url;
      this.isFileSelected = true;
      this.employeeForm.get('image')?.setValue(file);
    }
  }

  onSubmit() {
    try {
      this.submitted = true;
      if (this.employeeForm.invalid) {
        return;
      }
      if (this.mode === 'add') {
        console.log('Mode ' + this.mode);
        this.registrationService
          .serviceCall(this.prepareEmployeeData())
          .subscribe({
            next: (response) => {
              if (
                this.dataSource &&
                this.dataSource.data &&
                this.dataSource.data.length > 0
              ) {
                this.dataSource = new MatTableDataSource([
                  response,
                  ...this.dataSource.data,
                ]);
              }
              this.dataSource = new MatTableDataSource([response]);
              this.messageService.showSuccess('Data saved Successfully !');
            },
            error: (error) => {
              this.messageService.showError(
                'Action Failed with Error :' + error
              );
            },
          });
      } else if (this.mode === 'edit') {
        console.log('Mode ' + this.mode);
        this.registrationService
          .editData(this.selectedData.empNumber, this.prepareEmployeeData())
          .subscribe({
            next: (response) => {
              let elementIndex = this.dataSource.data.findIndex(
                (element) => element.empNumber === this.selectedData?.empNumber
              );
              this.dataSource.data[elementIndex] = response;
              this.dataSource = new MatTableDataSource(this.dataSource.data);

              this.messageService.showSuccess('Data Edited Successfully !');
            },
            error: (error) => {
              this.messageService.showError(
                'Action Failed with Error :' + error
              );
            },
          });
      }
      this.employeeForm.disable();
      this.isButtonDisable = true;
      this.fileButtonDisable = true;
    } catch (error) {
      this.messageService.showError('Action Failed with Error :' + error);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public populateData(): void {
    try {
      this.registrationService.getData().subscribe(
        (response: any) => {
          console.log('server response: ', response);
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        (error) => {
          this.messageService.showError('Action Failed with Error :' + error);
        }
      );
    } catch (error) {
      this.messageService.showError('Action Failed with Error :' + error);
    }
  }

  public editData(data: any): void {
    this.employeeForm.patchValue(data);
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    console.log('Mode ' + this.mode);
    this.selectedData = data;

    const file = data.image;
    const imageType = data.imageType;
    this.selectedImageUrl = `data:${imageType};base64,${file}`;
  }

  public deleteData(data: any): void {
    // delete data implementation
    const empNumber = data.empNumber;

    try {
      this.registrationService.deleteData(empNumber).subscribe({
        next: (response: any) => {
          const index = this.dataSource.data.findIndex(
            (element) => element.empNumber === empNumber
          );

          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
          }
          this.dataSource = new MatTableDataSource(this.dataSource.data);
          this.messageService.showSuccess('Data Deleted Successfully !');
        },
        error: (error) => {
          this.messageService.showError('Action Failed with Error :' + error);
        },
      });
    } catch (error) {
      this.messageService.showError('Action Failed with Error :' + error);
    }
  }

  public resetData(): void {
    this.employeeForm.reset();
    this.saveButtonLabel = 'Save';
    this.employeeForm.enable();
    this.isButtonDisable = false;
    this.employeeForm.setErrors = null!;
    this.employeeForm.updateValueAndValidity();
    this.submitted = false;

    this.fileButtonDisable = false;
    this.selectedImageUrl = null;
    this.isFileSelected = false;
  }

  public addLoginCredentials(employee: any): void{
    try {
      console.log('Employee passed to dialog:', employee);
        const dialogRef = this._dialog.open(EmployeeLoginDetailsComponent, {
    data: {
      employeeId: employee.empNumber,
      firstName: employee.fullName?.split(' ')[0] ?? '',
      lastName: employee.fullName?.split(' ')[1] ?? ''
    }
    });
        dialogRef.afterClosed().subscribe({
          next: (val) => {
            if (val) {
              if (val) {
                this.messageService.showSuccess(
                  'Login Credentials Add successfully!'
                );
              }
            }
          },
        });
      } catch (error) {
        console.log(error);
        this.messageService.showError('Action Failed!');
      }
  }

  public refreshData(): void {
    this.populateData();
  }
}
