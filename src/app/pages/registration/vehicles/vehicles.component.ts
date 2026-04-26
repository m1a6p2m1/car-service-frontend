import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
    displayedColumns: string[] = ['customerName','uniqueCusNo', 'licencePlate', 'vehicleType', 'vehicleModel','action'];
  
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
    isEditMode: any;

  constructor(
    private fb: FormBuilder,
    private vehiclesService: VehiclesService,
    private messageService: MessageServiceService,
    private _dialog: MatDialog,
  ){
    this.vehiclesForm = this.fb.group({
      customerName: new FormControl(''),
      uniqueCusNo: new FormControl(''),
      customerId: new FormControl(''),
      vehicles: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadCustomerList();
    this.populateData();
    this.addVehicle(); // add first row automatically
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
              // if (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0) {
              //   this.dataSource = new MatTableDataSource([response, ...this.dataSource.data]);
              // }else {
              //   this.dataSource = new MatTableDataSource([response]);
              // }
              const newData = Array.isArray(response) ? response : [response];

              this.dataSource = new MatTableDataSource([
                ...newData,
                ...(this.dataSource?.data || [])
              ]);
                this.messageService.showSuccess('Data Saved Successfully !');

                this.isEditMode = false;    
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

              this.isEditMode = false;
              this.mode = 'add';
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
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        if (user.role === 'CUSTOMER') {
          this.vehiclesService.getVehiclesByCustomer(user.uniqueCusNo).subscribe((response: any)=>{
            this.dataSource = new MatTableDataSource(response);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            console.log('server response vehicle get data: ',response);
          },
          (error)=>{
            this.messageService.showError(
              error?.error?.message || error?.message || 'Unknown error occurred'
            );
          });
        }else {
          this.vehiclesService.getData().subscribe((response: any)=>{
            this.dataSource = new MatTableDataSource(response);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            console.log('server response vehicle get data: ',response);
          },
          (error)=>{
            this.messageService.showError('Action Failed: ' + error);
          });
        }
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

    get vehicles(): FormArray {
        return this.vehiclesForm.get('vehicles') as FormArray;
    }

    addVehicle() {
      const vehiclesGroup = this.fb.group({ 
        id: [null], 
        licencePlate: [''], 
        vehicleType: [''], 
        vehicleModel: [''] 
      });

      this.vehicles.push(vehiclesGroup);
    }

    removeVehicle(index: number) {
      this.vehicles.removeAt(index);
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
      this.addVehicle(); // add first row automatically
      this.isEditMode = false; // ADD Vehicle button Show when reset button click
    }

    public resetFormManually() {
      this.vehiclesForm.get('customerId')?.reset();
      const vehiclesFormArray = this.vehicles;
      vehiclesFormArray.clear();
    }

    public enableFormManually() {
      this.vehiclesForm.get('customerId')?.enable();
    }

    public editData(data: any):void{
      this.resetData();
      this.isEditMode = true; // ADD VEHICLE button doesn't Show when edit button click
      this.vehiclesForm.patchValue({
        customerId: data.customerId
      });

      const vehiclesArray = this.vehiclesForm.get('vehicles') as FormArray;
      vehiclesArray.clear();

      vehiclesArray.push(
        this.fb.group({
          id: data.id,
          licencePlate: data.licencePlate,
          vehicleType: data.vehicleType,
          vehicleModel: data.vehicleModel
        })
      );
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
