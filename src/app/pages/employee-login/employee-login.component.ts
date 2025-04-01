import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeLoginService } from 'src/app/services/employee-login/employee-login.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

interface Employee {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-employee-login',
  standalone: false,
  templateUrl: './employee-login.component.html',
  styleUrl: './employee-login.component.scss'
})
export class EmployeeLoginComponent implements OnInit{
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  employeeLoginForm: FormGroup;
  displayedColumns: string[] = ['employee', 'firstName', 'lastName', 'userName', 'password', 'action'];
  dataSource!: MatTableDataSource<any>;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  mode = 'add';
  selectedData!: { id: number; };
  isButtonDisabled = false;
  saveButtonLabel = 'Save';

  constructor(
    private fb: FormBuilder,
    private employeeLoginService: EmployeeLoginService,
    private messageService:MessageServiceService
  ){
    this.employeeLoginForm = this.fb.group({
      employee: new FormControl(''),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      userName: new FormControl(''),
      password: new FormControl('')
    });
  }

  employees: Employee[] = [
    { value: 'Ruwan', viewValue: 'Ruwan' },
    { value: 'Kamal', viewValue: 'Kamal' },
    { value: 'Amal', viewValue: 'Amal' },
    { value: 'Doty', viewValue: 'Doty' },
  ];

  

  ngOnInit(): void {
    this.populateData();
  }

  public populateData(): void{
      try {
        this.employeeLoginService.getData().subscribe((response: any)=>{
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log('server response: ',response);
        },
        (error)=>{
          this.messageService.showError('Action Failed with Error :'+ error);
        }
      );
      } catch (error) {
        this.messageService.showError('Action Failed with Error :'+ error); 
      }
      
    }

  onSubmit(){
    try {
      if (this.mode === 'add') {
        this.employeeLoginService.serviceCall(this.employeeLoginForm.value).subscribe({
          next:(response)=>{
            if (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0) {
              this.dataSource = new MatTableDataSource([response, ...this.dataSource.data]);
              this.messageService.showSuccess('Data Saved Successfully !');
            }
            this.dataSource = new MatTableDataSource([response]);       
          },
          error:(error) => {
            this.messageService.showError('Action Failed with Error :'+ error); 
          }
        });
      }else if (this.mode === 'edit') {
        this.employeeLoginService.editData(this.selectedData.id, this.employeeLoginForm.value).subscribe({
          next:(response)=>{
            let elementIndex = this.dataSource.data.findIndex((element)=> element.id === this.selectedData?.id);
            this.dataSource.data[elementIndex] = response;
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            this.messageService.showSuccess('Data Edited Successfully !');
          },
          error:(error) => {
            this.messageService.showError('Action Failed with Error :'+ error); 
          }
        });
      }
    } catch (error) {
      this.messageService.showError('Action Failed with Error :'+ error); 
    }
    
    this.isButtonDisabled = true;
    this.employeeLoginForm.disable();
  }

  public resetData():void {
    this.employeeLoginForm.reset();
    this.saveButtonLabel = 'Save';
    this.isButtonDisabled = false;
    this.employeeLoginForm.enable();
    this.employeeLoginForm.setErrors = null!;
    this.employeeLoginForm.updateValueAndValidity();
  }

  public refreshData():void {
    this.populateData();
  }

  public editData(data: any){
    this.employeeLoginForm.patchValue(data);
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;
  }

}
