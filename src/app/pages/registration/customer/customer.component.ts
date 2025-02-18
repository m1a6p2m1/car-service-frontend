import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/services/registration/customer.service';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

const ELEMENT_DATA: any[] = [{firstName:'',lastName:'',nic:'',email:'',gender:'',address:'',phoneNumber:'',licencePlate:'',vehicleType:'',vehicleModel:''}];

@Component({
  selector: 'app-customer',
  standalone: false,
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent implements OnInit{

  customerForm: FormGroup;

  displayedColumns: string[] = ['firstName','nic', 'phoneNumber', 'licencePlate', 'vehicleType','action'];

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
    private messageService:MessageServiceService
  ){
    this.customerForm = this.fb.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      nic: new FormControl('', [Validators.pattern('^([0-9]{9}[x|X|v|V]|[0-9]{12})$')]),
      email: new FormControl('', [Validators.email]),
      gender: new FormControl(''),
      address: new FormControl(''),
      phoneNumber: new FormControl('', [Validators.pattern('^(\\+94|0)[1-9]{2}[0-9]{7}$|^(\\+94|0)?7[0-9]{8}$')]),//, [Validators.pattern('^(\+94|0)?[1-9]{2}[0-9]{7}$|^(\\+94|0)?7[0-9]{8}$')]
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
            }
            this.dataSource = new MatTableDataSource([response]);
            console.log('server response: ',response);
            this.messageService.showSuccess('Data Saved Successfully !');
          },
          error:(error) => {
            this.messageService.showError('Action Failed with Error :'+ error); 
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
            this.messageService.showError('Action Failed with Error :'+ error); 
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
      });
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

  public deleteData(data: any):void{
    try {
      const cusId = data.cusId;
      this.customerService.deleteData(cusId).subscribe({
        next:(response: any) => {
          console.log('server response for delete:' ,response);
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

  public resetData():void{
    this.customerForm.reset();
    this.saveButtonLabel = 'Save';
    this.isButtonDisable = false;
    this.customerForm.enable();
    this.submitted = false;
  }

  public refreshData(): void{
    this.populateData();
  }

}
