import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/services/registration/customer.service';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomerLoginDetailsComponent } from '../customer-login-details/customer-login-details.component';

// const ELEMENT_DATA: any[] = [{firstName:'',lastName:'',nic:'',email:'',gender:'',address:'',contactNumber:'',licencePlate:'',vehicleType:'',vehicleModel:''}];

@Component({
  selector: 'app-customer',
  standalone: false,
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent implements OnInit{

  customerForm: FormGroup;

  displayedColumns: string[] = ['firstName','nic', 'contactNumber','action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  saveButtonLabel = 'Save';
  mode = 'add';
  selectedData!: { cusId: number; };
  isButtonDisable = false;
  submitted = false;

  constructor (
    private fb: FormBuilder,
    private customerService: CustomerService,
    private messageService:MessageServiceService,
    private _dialog: MatDialog,
  ){
    this.customerForm = this.fb.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      nic: new FormControl('', [Validators.pattern('^([0-9]{9}[x|X|v|V]|[0-9]{12})$')]),
      email: new FormControl('', [Validators.email]),
      gender: new FormControl(''),
      address: new FormControl(''),
      contactNumber: new FormControl('', [Validators.pattern('^(\\+94|0)[1-9]{2}[0-9]{7}$|^(\\+94|0)?7[0-9]{8}$')]),//, [Validators.pattern('^(\+94|0)?[1-9]{2}[0-9]{7}$|^(\\+94|0)?7[0-9]{8}$')]
      licencePlate: new FormControl(''),
      vehicleType: new FormControl(''),
      vehicleModel: new FormControl(''),
    });
  }
  ngOnInit(): void {
    this.populateData();
  }

  onSubmit(){
    // console.log('form submitted');
    // console.log(this.customerForm.value);
    try {
      this.submitted = true;
      if (this.mode === 'add') {
        this.customerService.serviceCall(this.customerForm.value).subscribe({
          next:(response)=>{
            if (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0) {
              this.dataSource = new MatTableDataSource([response, ...this.dataSource.data]);
              this.messageService.showSuccess('Data Saved Successfully !');
              console.log('Customer form submitted')
            }
            this.dataSource = new MatTableDataSource([response]);       
          },
          error:(error) => {
            console.log('Full error:', error);

            const msg =
              error?.error?.message ||
              error?.message ||
              'Unknown error occurred';

            this.messageService.showError(msg);
          }
        });
      }else if (this.mode === 'edit') {
        this.customerService.editData(this.selectedData.cusId, this.customerForm.value).subscribe({
          next:(response)=>{
            let elementIndex = this.dataSource.data.findIndex((element)=> element.cusId === this.selectedData?.cusId);
            this.dataSource.data[elementIndex] = response;
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            this.messageService.showSuccess('Data Edited Successfully !');
          },
          error:(error) => {
            console.log('Full error:', error);

            const msg =
              error?.error?.message ||
              error?.message ||
              'Unknown error occurred';

            this.messageService.showError(msg); 
          }
        });
      }
    } catch (error) {
      this.messageService.showError('Action Failed with Error :'+ error); 
    }
    
    this.isButtonDisable = true;
    this.customerForm.disable();
    
  }

  public populateData(): void{
    try {
      this.customerService.getData().subscribe((response: any)=>{
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public editData(data: any):void{
    this.customerForm.patchValue(data);
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;
  }

  public confirmDelete(data: any): void {
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        data: 'Are you sure you want to delete this record?',
      });
  
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.deleteData(data);
        }
      });
  }

  public deleteData(data: any):void{
    try {
      const cusId = data.cusId;
      this.customerService.deleteData(cusId).subscribe({
        next:(response: any) => {
          const index = this.dataSource.data.findIndex((element) => element.cusId === cusId);
  
          if(index !== -1){
            this.dataSource.data.splice(index, 1);
          }
          this.dataSource = new MatTableDataSource(this.dataSource.data);
          this.messageService.showSuccess('Data Deleted Successfully !');
        },
        error:(error) => {
          this.messageService.showError('Action Failed with Error :'+ error); 
        }
      }); 
    } catch (error) {
      this.messageService.showError('Action Failed with Error :'+ error); 
    }
    
  } 

  public addLoginCredentials(customer: any): void{
      try {
        console.log('Customer passed to dialog:', customer);
          const dialogRef = this._dialog.open(CustomerLoginDetailsComponent, {
      data: {
        customerId: customer.cusId,
        firstName: customer.firstName,
        lastName: customer.lastName
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

  public resetData():void{
    this.customerForm.reset();
    this.saveButtonLabel = 'Save';
    this.isButtonDisable = false;
    this.customerForm.enable();
    this.customerForm.setErrors = null!;
    this.customerForm.updateValueAndValidity();
    this.submitted = false;
  }

  checkContactNumber(): void{
    const control  = this.customerForm.get('contactNumber');

    if(!control || control.invalid || !control.value) {
      return;
    }

    this.customerService.checkContactNumber(control.value).subscribe((exists: boolean)  => {
      // this.phoneExists = exists ;

      const errors = { ...(control.errors || {}) };

      if (exists) {
        errors['contactExists'] = true;
      } else {
        delete errors['contactExists'];
      }

      control.setErrors(Object.keys(errors).length ? errors :null);
    });
  }

  checkNicNumber():void {
    const control  = this.customerForm.get('nic');

    if(!control || control.invalid || !control.value) {
      return;
    }

    this.customerService.checkNicNumber(control.value).subscribe((exists: boolean)  => {
      // this.phoneExists = exists ;

      const errors = { ...(control.errors || {}) };

      if (exists) {
        errors['nicExists'] = true;
      } else {
        delete errors['nicExists'];
      }

      control.setErrors(Object.keys(errors).length ? errors :null);
    });
  }


  public refreshData(): void{
    this.populateData();
  }

}
