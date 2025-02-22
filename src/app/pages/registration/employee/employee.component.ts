import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { RegistrationService } from 'src/app/services/registration/registration.service';

const ELEMENT_DATA: any[] = [{ fullName: '', callingName: '', nic: '', dob: '', gender:'', address:'', phoneNumber:'', emergencyPhoneNumber:'', bloodGroup:'', employmentType:'', employeeStatus:'', jobTitle:'', action:''}];

@Component({
  selector: 'app-employee',
  standalone: false,
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent implements OnInit {

  employeeForm: FormGroup;

  displayedColumns: string[] = ['callingName', 'nic', 'gender', 'phoneNumber', 'employeeStatus', 'jobTitle', 'action'];
  
  // displayedColumns: string[] = ['fullName', 'callingName', 'nic', 'dob', 'gender', 'address', 'phoneNumber', 'emergencyPhoneNumber', 'bloodGroup', 'employmentType', 'employeeStatus', 'jobTitle', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  saveButtonLabel = 'Save';
  mode = 'add';
  selectedData!: { empNumber: number; };
  isButtonDisable = false;
  submitted = false;

  constructor (
    private fb:FormBuilder, 
    private registrationService: RegistrationService,
    private messageService: MessageServiceService
  ){
    this.employeeForm = this.fb.group({

      fullName: new FormControl('', [Validators.required]),
      callingName: new FormControl(''),
      nic: new FormControl('', [Validators.pattern('^([0-9]{9}[x|X|v|V]|[0-9]{12})$')]),
      dob: new FormControl(''),
      gender: new FormControl(''),
      address: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.pattern('^(\\+94|0)[1-9]{2}[0-9]{7}$|^(\\+94|0)?7[0-9]{8}$')]),
      emergencyPhoneNumber: new FormControl('', [Validators.pattern('^(\\+94|0)[1-9]{2}[0-9]{7}$|^(\\+94|0)?7[0-9]{8}$')]),
      bloodGroup: new FormControl('', [Validators.required]),
      employmentType: new FormControl(''),
      employeeStatus: new FormControl(''),
      jobTitle: new FormControl('')
    });
  }

  

  onSubmit(){
    console.log('form submited');
    console.log(this.employeeForm.value);

    try {
      this.submitted = true;
      if (this.employeeForm.invalid) {
        return;
      }
      if(this.mode === 'add'){
        console.log("Mode "+ this.mode);
        // this.registrationService.serviceCall(this.employeeForm.value).subscribe((response)=>{
        //   if (this.dataSource && this.dataSource.data && this.dataSource.data.length>0) {
        //     this.dataSource = new MatTableDataSource([response, ...this.dataSource.data]);
        //   }
        //   this.dataSource = new MatTableDataSource([response]);

        //   this.messageService.showSuccess('Data saved Successfully !');
        // });
        this.registrationService.serviceCall(this.employeeForm.value).subscribe({
          next: (response: any) => {
          if (this.dataSource && this.dataSource.data && this.dataSource.data.length>0) {
            this.dataSource = new MatTableDataSource([response, ...this.dataSource.data]);
            this.messageService.showSuccess('Data saved Successfully !');
          }
          this.dataSource = new MatTableDataSource([response]);
          },
          error: (error)=>{
            this.messageService.showError('Action Failed with Error :'+ error);
          }
        });
  
      }else if (this.mode === 'edit') {
        console.log("Mode "+ this.mode);
        // this.registrationService.editData(this.selectedData.empNumber, this.employeeForm.value).subscribe((response)=>{
  
        //   let elementIndex = this.dataSource.data.findIndex((element)=> element.empNumber === this.selectedData?.empNumber);
        //   this.dataSource.data[elementIndex] = response;
        //   this.dataSource = new MatTableDataSource(this.dataSource.data);

        //   this.messageService.showSuccess('Data Edited Successfully !');
  
        // });
        this.registrationService.editData(this.selectedData.empNumber, this.employeeForm.value).subscribe({
          next: (response: any) =>{
            let elementIndex = this.dataSource.data.findIndex((element)=> element.empNumber === this.selectedData?.empNumber);
            this.dataSource.data[elementIndex] = response;
            this.dataSource = new MatTableDataSource(this.dataSource.data);

            this.messageService.showSuccess('Data Edited Successfully !');
          },
          error: (error)=>{
            this.messageService.showError('Action Failed with Error :'+ error);
          }
        });
      }
      this.employeeForm.disable();
      this.isButtonDisable = true;
    } catch (error) {
      this.messageService.showError('Action Failed with Error :'+ error);
    }
    
  }

  ngOnInit(): void {
      console.log('oninit');

      this.populateData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public populateData(): void{
    try {
      this.registrationService.getData().subscribe((response: any)=>{
        console.log('server response: ', response);
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error)=>{ this.messageService.showError('Action Failed with Error :'+ error);});

    } catch (error) {
      this.messageService.showError('Action Failed with Error :'+ error);
    }
    
  }

  public editData(data:any): void{
    
    this.employeeForm.patchValue(data);
    this.saveButtonLabel ="Edit";
    this.mode = 'edit';
    console.log("Mode "+ this.mode);
    this.selectedData = data;
  }

  public deleteData(data:any): void{
    // delete data implementation
    const empNumber = data.empNumber;
    
    try {
      // this.registrationService.deleteData(empNumber).subscribe((response: any)=> {
      //   const index = this.dataSource.data.findIndex((element) => element.empNumber === empNumber);
  
      //   if(index !== -1){
      //     this.dataSource.data.splice(index, 1);
      //   }
      //   this.dataSource = new MatTableDataSource(this.dataSource.data);
      //   this.messageService.showSuccess('Data Deleted Successfully !');
      // });
      this.registrationService.deleteData(empNumber).subscribe({
        next: (response: any) =>{
          const index = this.dataSource.data.findIndex((element) => element.empNumber === empNumber);
  
          if(index !== -1){
            this.dataSource.data.splice(index, 1);
          }
          this.dataSource = new MatTableDataSource(this.dataSource.data);
          this.messageService.showSuccess('Data Deleted Successfully !');
        },
        error: (error)=>{
          this.messageService.showError('Action Failed with Error :'+ error);
        }
      });
    } catch (error) {
      this.messageService.showError('Action Failed with Error :'+ error);
    }
  }

  public resetData(): void{
    this.employeeForm.reset();
    this.saveButtonLabel ="Save";
    this.employeeForm.enable();
    this.isButtonDisable = false;
    this.employeeForm.setErrors = null!;
    this.employeeForm.updateValueAndValidity();
    this.submitted = false;
  }

  public refreshData(): void{
    this.populateData();
  }
}
