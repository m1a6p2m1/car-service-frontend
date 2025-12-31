import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { VehiclesService } from 'src/app/services/registration/vehicles.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-vehicles',
  standalone: false,
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss'
})
export class VehiclesComponent implements OnInit{

  vehiclesForm: FormGroup;
    displayedColumns: string[] = ['customerName', 'licencePlate', 'vehicleType', 'vehicleModel','action'];
  
    dataSource!: MatTableDataSource<any>;
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    saveButtonLabel = 'Save';
    mode = 'add';
    selectedData!: { id: number; };
    isButtonDisable = false;
    submitted = false;
    selectedCustomers: any = [];
    customers: any = [];

  constructor(
    private fb: FormBuilder,
    private vehiclesService: VehiclesService,
    private messageService: MessageServiceService,
    private _dialog: MatDialog,
  ){
    this.vehiclesForm = fb.group({
      customerName: new FormControl(''),
      customerId: new FormControl(''),
      licencePlate: new FormControl(''),
      vehicleType: new FormControl(''),
      vehicleModel: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.loadCustomerList();
    this.populateData();
  }

  onSubmit(){
      // console.log('form submitted');
      // console.log(this.customerForm.value);
      try {
        let formData = this.vehiclesForm.getRawValue();
        this.submitted = true;
        if (this.mode === 'add') {
          this.vehiclesService.serviceCall(formData).subscribe({
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
          this.vehiclesService.editData(this.selectedData.id, formData).subscribe({
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
      
      this.isButtonDisable = true;
      this.vehiclesForm.disable();

      
    }

  public loadCustomerList(): void {
    this.vehiclesService.getCustomersList().subscribe((response: any) => {
      
      if (response) {
        this.customers = response;
        this.selectedCustomers = response;
      }
    });
  }

  public onCustomerChange(inputId: any) {       //When click a edit button load customer name into the customerField 
    const customerName = this.customers.find(
      (customer: any) => customer.id === inputId.value
    ).firstName;

    this.vehiclesForm.patchValue({
      customerName,
    });
  }

  onCustomerFilterKeyPress(eventTarget: any) {
    this.selectedCustomers = this.search(eventTarget.value);
  }

  search(value: string) {
    let filter = value.toLowerCase();
    return this.customers.filter(
      (option: any) =>
        option.firstName.toLowerCase().startsWith(filter) ||
        option.lastName.toLowerCase().startsWith(filter) ||
        option.id.toString().toLowerCase().startsWith(filter)
    );
  }

    public populateData(): void{
      try {
        this.vehiclesService.getData().subscribe((response: any)=>{
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log('server response: ',response);
        },
        (error)=>{
          this.messageService.showError('Action Failed with Error :'+ error);
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

    public refreshData(): void{
      this.populateData();
    }

    public resetData():void{
      this.vehiclesForm.reset();
      this.vehiclesForm.enable();
      this.resetFormManually();
      this.saveButtonLabel = 'Save';
      this.isButtonDisable = false;
      this.enableFormManually();
    }

    public resetFormManually() {
      this.vehiclesForm.get('customerId')?.reset();
    }

    public enableFormManually() {
      this.vehiclesForm.get('customerId')?.enable();
    }

    public editData(data: any):void{
      this.resetData();
      this.vehiclesForm.patchValue(data);
      this.vehiclesForm.enable();
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
          const id = data.id;
          this.vehiclesService.deleteData(id).subscribe({
            next:(response: any) => {
              const index = this.dataSource.data.findIndex((element) => element.id === id);
      
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
  

}
