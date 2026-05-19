import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerFeedbackService } from 'src/app/services/feedback/customer-feedback.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';


interface License {
  licencePlate: string;
}
@Component({
  selector: 'app-customer-feedback',
  standalone: false,
  templateUrl: './customer-feedback.component.html',
  styleUrl: './customer-feedback.component.scss'
})
export class CustomerFeedbackComponent implements OnInit{
  customerFeedbackForm: FormGroup;
  ratingArr: number[] = [];
  color: string = 'accent';
  rating: number = 0;
  starCount: number = 5;
  ratingUpdated = new EventEmitter();

  displayedColumns: string[] = ['userName','uniqueTaskNo', 'serviceDate', 'serviceQuality', 'recommendation', 'complaint','action'];

  dataSource!: MatTableDataSource<any>;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  saveButtonLabel = 'Save';
  mode = 'add';
  selectedData!: { id: number; };
  isButtonDisable = false;

  ratingLabels: { [key: number]: string } = {
    1: 'Very Poor',
    2: 'Poor',
    3: 'Average',
    4: 'Good',
    5: 'Excellent'
  };

  constructor(
    private fb: FormBuilder,
    private customerFeedbackService: CustomerFeedbackService,
    private messageService:MessageServiceService
  ){

    this.loadUserName();

    this.customerFeedbackForm = this.fb.group({
      userName: new FormControl({ value: this.loggedUserName, disabled: true }),
      licencePlate: new FormControl(''),
      uniqueTaskNo: new FormControl(''),
      serviceDate: new FormControl(''),
      serviceType: new FormControl(''),
      serviceQuality: new FormControl('', Validators.required),
      // serviceQualityLabel: new FormControl(''),
      recommendation: new FormControl('', Validators.required),
      complaint: new FormControl('')
    });
  }

  licenses: License[] = [];

  formatDateLocal(date: Date): string {  //year-month-day(2026-05-06)
    if(!date){
      return '';
    }

    const d = new Date(date);

    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  formatDateFromArray(dateArray: number[]): string {//get date 2026-05-16 this format into the table
    if(!dateArray) return '';
    const [year, month, day] = dateArray;
    return  `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  onCustomerAndDateChange(){
    const date = this.customerFeedbackForm.get('serviceDate')?.value;
    if (!date) {
      return;
    }
    const formattedDate = this.formatDateLocal(date);

    
  const customerId = localStorage.getItem('id');

  console.log("Customer ID:", customerId);

    this.customerFeedbackService.getLicenseByDateAndCustomer(formattedDate, customerId!).subscribe({
      next: (res: License[])=>{
        this.licenses = res;
        console.log("License:", res);
      },
      error: (err) => {
        console.log("No Tasks Found");
        this.licenses = [];
      }
    });
  }

  onLicensePlateSelect(licencePlate: string){
    const date = this.customerFeedbackForm.get('serviceDate')?.value;
    if (!date) {
      return;
    }
    const formattedDate = this.formatDateLocal(date);
    
    this.customerFeedbackService.getDetailsByLicensePlate(formattedDate, licencePlate)
    .subscribe((res: any)=>{
      console.log(res);

      this.customerFeedbackForm.patchValue({
        uniqueTaskNo: res.uniqueTaskNo,
        serviceType: res.serviceType
      });
    });
  }

  onSubmit(){
    // console.log('form submitted');
    // console.log(this.customerForm.value);
    try {
      const formData = this.customerFeedbackForm.getRawValue();
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      formData.userId = user.id;
      if (formData.serviceDate) {
        formData.serviceDate = this.formatDateLocal(formData.serviceDate);   // "2026-04-06"
}
      // this.submitted = true;
      if (this.mode === 'add') {
        this.customerFeedbackService.serviceCall(formData).subscribe({
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
        this.customerFeedbackService.editData(this.selectedData.id, formData).subscribe({
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
    this.customerFeedbackForm.disable();
    
  }

  ngOnInit() {
    console.log("a "+this.starCount)
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
    this.populateData();

    
    
  }  

  loggedUserName: string = '';

    loadUserName(): void {
    const firstName = localStorage.getItem('firstName') || '';
    const lastName = localStorage.getItem('lastName') || '';
    this.loggedUserName = `${firstName} ${lastName}`.trim();
  }

  onClick(rating:number) {
    console.log(rating);
    // this.snackBar.open('You rated ' + rating + ' / ' + this.starCount, '', {
    //   duration: this.snackBarDuration
    // });
    this.rating = rating;
    const label = this.ratingLabels[rating];
    const combinedValue = `${rating}-${label}`;
    this.customerFeedbackForm.get('serviceQuality')?.setValue(combinedValue);
    this.ratingUpdated.emit(combinedValue);
    return false;
  }

  showIcon(index:number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  populateData(): void {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
  
      this.customerFeedbackService.getData(user.uniqueCusNo).subscribe((response: any)=>{
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

  // public editData(data: any):void{
  //   this.customerFeedbackForm.patchValue(data);
  //   this.saveButtonLabel = 'Edit';
  //   this.mode = 'edit';
  //   this.selectedData = data;
  //   this.isButtonDisable = false;
  // }

  public editData(data: any): void {

  // Convert backend date array to Date object
  let serviceDateObj = null;

  if (Array.isArray(data.serviceDate)) { // check date format from backend
    serviceDateObj = new Date(   //convert array into java script date
      data.serviceDate[0],         //year
      data.serviceDate[1] - 1,     //month
      data.serviceDate[2]          //date
    );
  }

  // Patch form
  this.customerFeedbackForm.patchValue({
    ...data,
    serviceDate: serviceDateObj          //replaces the original array date with the converted Date object
  });

  // Load license dropdown again if we have a valid date
  const customerId = localStorage.getItem('id');

  if (serviceDateObj && customerId) {
    const formattedDate = this.formatDateLocal(serviceDateObj); //Convert Date into Backend Format

    this.customerFeedbackService
      .getLicenseByDateAndCustomer(formattedDate, customerId)
      .subscribe({
        next: (res: License[]) => {
          this.licenses = res;                      // store license list

          // Re-set selected license after options loaded
          this.customerFeedbackForm.patchValue({
            licencePlate: data.licencePlate
          });
        }
      });
  }

  // Restore star rating
  if (data.serviceQuality) {

    // "5-Excellent" -> 5
    const ratingValue = parseInt(
      data.serviceQuality.toString().split('-')[0]
    );

    this.rating = ratingValue;
  }

  this.saveButtonLabel = 'Edit';
  this.mode = 'edit';
  this.selectedData = data;
  this.isButtonDisable = false;
}

  public viewData(data: any):void{
    this.customerFeedbackForm.patchValue(data);
    this.isButtonDisable = true;
  }

  public resetData():void{
    // this.customerFeedbackForm.reset();
    this.loadUserName();
    this.customerFeedbackForm.reset({
      userName: { value: this.loggedUserName, disabled: true }
    });
    this.saveButtonLabel = 'Save';
    this.isButtonDisable = false;
    this.customerFeedbackForm.enable();
    this.customerFeedbackForm.get('userName')?.disable();
    this.customerFeedbackForm.setErrors = null!;
    this.customerFeedbackForm.updateValueAndValidity();
    this.rating = 0;
    // this.ratingLabels = [];
    // this.customerFeedbackForm.get('serviceType')?.disable();
    // this.customerFeedbackForm.get('serviceDate')?.disable();
    
  }

  public deleteData(data: any):void{
      try {
        const id = data.id;
        this.customerFeedbackService.deleteData(id).subscribe({
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

  public refreshData(): void{
    this.populateData();
  }




}
