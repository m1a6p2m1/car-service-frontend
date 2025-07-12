import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerFeedbackService } from 'src/app/services/feedback/customer-feedback.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

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

  displayedColumns: string[] = ['userName','taskNumber', 'serviceDate', 'serviceQuality', 'recommendation', 'complaint','action'];

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
      taskNumber: new FormControl(''),
      serviceDate: new FormControl(''),
      serviceType: new FormControl(''),
      serviceQuality: new FormControl('', Validators.required),
      // serviceQualityLabel: new FormControl(''),
      recommendation: new FormControl('', Validators.required),
      complaint: new FormControl('')
    });
  }

  onSubmit(){
    // console.log('form submitted');
    // console.log(this.customerForm.value);
    try {
      // this.submitted = true;
      if (this.mode === 'add') {
        this.customerFeedbackService.serviceCall(this.customerFeedbackForm.getRawValue).subscribe({
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
        this.customerFeedbackService.editData(this.selectedData.id, this.customerFeedbackForm.getRawValue).subscribe({
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
    this.populateData(this.selectedData.id);

    
    
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

  public populateData(data: any):void{
    try {
      const id = data.id;
      this.customerFeedbackService.getData(id).subscribe((response: any)=>{
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
    this.customerFeedbackForm.patchValue(data);
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
    this.customerFeedbackForm.reset();
    this.saveButtonLabel = 'Save';
    this.isButtonDisable = false;
    this.customerFeedbackForm.enable();
    this.customerFeedbackForm.setErrors = null!;
    this.customerFeedbackForm.updateValueAndValidity();
    this.rating = 0;
    // this.ratingLabels = [];
    this.customerFeedbackForm.get('serviceType')?.disable();
    this.customerFeedbackForm.get('serviceDate')?.disable();
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
    this.populateData(this.selectedData.id);
  }

}
