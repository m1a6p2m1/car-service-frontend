import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { SupplierService } from 'src/app/services/registration/supplier.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

const ELEMENT_DATA: any[] = [{ supplierName: '', companyName: '', businessAddress: '', nic:'', phoneNumber:'', email:'', productSupplied:''}];

interface ItemCategory {
  id:number;
  name: string;
  // selectedOption: string;
}


@Component({
  selector: 'app-supplier',
  standalone: false,
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.scss'
})
export class SupplierComponent implements OnInit {  

  supplierForm: FormGroup;
  displayedColumns: string[] = ['supplierName', 'companyName', 'productSupplied', 'action'];
  
  // productSuppliedList: string[] = ['Car Wash Chemicals', 'Oils', 'Spare Parts', 'Cleaning Equipments'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  saveButtonLabel = 'Save';
  mode = 'add';
  selectedData!: {supplierId:number;};
  isButtonDisable = false;
  submitted = false;

  constructor ( 
    private fb:FormBuilder,
    private supplierService: SupplierService,
    private messageService:MessageServiceService,
    private _dialog: MatDialog,
  ) {
    this.supplierForm = this.fb.group ({
      supplierName: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      companyName: new FormControl('', [Validators.required]),
      businessAddress: new FormControl('', [Validators.required]),
      nic: new FormControl('', [Validators.pattern('^([0-9]{9}[x|X|v|V]|[0-9]{12})$')]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^(\\+94|0)[1-9]{2}[0-9]{7}$|^(\\+94|0)7[0-9]{8}$')]),
      email: new FormControl('', [Validators.email]),
      productSupplied: new FormControl('')
    });
  }

  itemCategories: ItemCategory[] = [
    {id:1, name:'Washing Equipments'},
    {id:2, name:'Cleaning Chemicals'},
    {id:3, name:'Cleaning Equipments'},
    {id:4, name:'Drying Equipments'},
    {id:5, name:'Spare Parts'},
    {id:6, name:'Break Systems'},
    {id:7, name:'Electrical'},
    {id:8, name:'Lubricants & Oils'},
    {id:9, name:'Filters'},
    {id:10, name:'Other'},
  ];

  ngOnInit(): void {
    console.log('oninit');
    this.populateData();
  }

  onSubmit(){
    try {
      if (this.supplierForm.invalid) {
        return;        
      }

      const formValue = this.supplierForm.value;
      formValue.productSupplied = formValue.productSupplied.join(', '); // Convert the selected productSupplied array to a comma-separated string


      if (this.mode === 'add') {
        // console.log("Mode "+ this.mode);
        this.supplierService.serviceCall(formValue).subscribe({
          next: (response) =>{
            if (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0) {
              this.dataSource = new MatTableDataSource([response,...this.dataSource.data]);
              this.messageService.showSuccess('Data Saved Successfully !');  
            }
            this.dataSource = new MatTableDataSource([response]);
          },
          error: (error) => {
            this.messageService.showError('Action Failed with Error :'+ error);
          }          
        });
      }else if (this.mode === 'edit') {
        // console.log("Mode "+ this.mode);
        this.supplierService.editData(this.selectedData.supplierId, formValue).subscribe({
          next:(response)=>{
            let elementIndex = this.dataSource.data.findIndex((element)=> element.supplierId === this.selectedData?.supplierId);
            this.dataSource.data[elementIndex] = response;
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            this.messageService.showSuccess('Data Edited Successfully !');
          },
          error: (error) =>{
            this.messageService.showError('Action Failed with Error :'+ error);
          }
        });
      }
      this.isButtonDisable = true;
      this.supplierForm.disable();

    } catch (error) {
      this.messageService.showError('Action Failed with Error:' + error);
    }
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
      this.supplierService.getData().subscribe((response: any) =>{
        console.log('get data response:'+ response);
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
     },
      (error)=>{
      this.messageService.showError('Action Failed with Error :'+ error);
    }
    );
    } catch (error) {
      this.messageService.showError('Action Failed with Error:'+ error);
    }
  }

  public editData(data:any){
    // Split the comma-separated string into an array for the form control
    const productSuppliedArray = data.productSupplied ? data.productSupplied.split(', ') : [];

    this.supplierForm.patchValue({
      supplierName: data.supplierName,
      companyName: data.companyName,
      businessAddress: data.businessAddress,
      nic: data.nic,
      phoneNumber: data.phoneNumber,
      email: data.email,
      productSupplied: productSuppliedArray, // Set the value as an array
    });
    this.saveButtonLabel = 'Edit';
    this.mode ='edit';
    this.selectedData = data;
  }

  public confirmDelete(data: any): void {
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        data: 'Are you sure you want to delete this Supplier?',
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.deleteData(data);
        }
      });
    }

  public deleteData(data:any){
    try {
      const supplierId = data.supplierId;

    this.supplierService.deleteData(supplierId).subscribe({
      next:(response: any)=>{
        const index = this.dataSource.data.findIndex((element) => element.supplierId === supplierId);
    
          if(index !== -1){
            this.dataSource.data.splice(index, 1);
          }
          this.dataSource = new MatTableDataSource(this.dataSource.data);
          this.messageService.showSuccess('Data Deleted Successfully !');
      },
      error: (error) => {
        this.messageService.showError('Action Failed with Error :'+ error);
      }
    });
    } catch (error) {
      this.messageService.showError('Action Failed with Error:'+ error);
    }
  }

  public resetData(){
    this.supplierForm.reset();
    this.saveButtonLabel = 'Save';
    this.isButtonDisable = false;
    this.supplierForm.enable();
    this.supplierForm.setErrors = null!;
    this.supplierForm.updateValueAndValidity();
    this.submitted = false;
    this.populateData();
  }

  checkPhoneNumber(): void{
    const control  = this.supplierForm.get('phoneNumber');

    if(!control || control.invalid || !control.value) {
      return;
    }

    this.supplierService.checkPhoneNumber(control.value).subscribe((exists: boolean)  => {
      // this.phoneExists = exists ;

      const errors = { ...(control.errors || {}) };

      if (exists) {
        errors['phoneExists'] = true;
      } else {
        delete errors['phoneExists'];
      }

      control.setErrors(Object.keys(errors).length ? errors :null);
    });
  }

  checkNicNumber():void {
    const control  = this.supplierForm.get('nic');

    if(!control || control.invalid || !control.value) {
      return;
    }

    this.supplierService.checkNicNumber(control.value).subscribe((exists: boolean)  => {
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

  public refreshData(){
    this.populateData();
  }

}
