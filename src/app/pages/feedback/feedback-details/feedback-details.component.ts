import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CustomerFeedbackService } from 'src/app/services/feedback/customer-feedback.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReviewConfirmDialogComponent } from '../review-confirm-dialog/review-confirm-dialog.component';

export interface CustomerFeedback {
  id: number;
  userName: string;
  uniqueTaskNo: number;
  serviceDate: string;
  serviceType: string;
  serviceQuality: string;
  recommendation: string;
  complaint: string;
}

interface License {
  licencePlate: string;
}

@Component({
  selector: 'app-feedback-details',
  standalone: false,
  templateUrl: './feedback-details.component.html',
  styleUrl: './feedback-details.component.scss'
})
export class FeedbackDetailsComponent implements OnInit {
  feedbackDetailsForm: FormGroup;

  ratingArr: number[] = [];
  color: string = 'accent';
  rating: number = 0;
  starCount: number = 5;
  ratingUpdated = new EventEmitter();

  selectedData: any;
  dataSource: any;
  isButtonDisable = false;

  ratingLabels: { [key: number]: string } = {
    1: 'Very Poor',
    2: 'Poor',
    3: 'Average',
    4: 'Good',
    5: 'Excellent'
  };
  element: any;

  constructor(
      public dialogRef: MatDialogRef<FeedbackDetailsComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private fb: FormBuilder,
      private customerFeedbackService: CustomerFeedbackService,
      private messageService:MessageServiceService,
      private _dialog: MatDialog,
    ){
      this.feedbackDetailsForm = this.fb.group({
        userName: new FormControl(''),
        uniqueTaskNo: new FormControl(''),
        serviceDate: new FormControl({ value: '', disabled: true }),
        serviceType: new FormControl({ value: '', disabled: true }),
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

    public ngOnInit(): void {
        this.selectedData = this.data;
        this.reviewData(this.selectedData);
    }


    public reviewData(data: any): void{
  
    //   const fbId = this.selectedData?.id;
    //   console.log("fbId:", fbId);

    //   if (!fbId) {
    //     console.error("No feedback ID provided.");
    //     return;
    //   }
    //   this.customerFeedbackService.getData(fbId).subscribe({
    //   next: (data: CustomerFeedback) => {
        
    // // Populate form
    //   this.feedbackDetailsForm.patchValue(data);
    //   const quality = data.serviceQuality;
    //   this.rating = parseInt(quality?.split('-')[0]) || 0;

    // // Disable the form to make it view-only
    //   this.feedbackDetailsForm.disable();
    //   },
    //   error: (err) => {
    //     console.error("Error fetching feedback:", err);
    //   }
    //   });

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
    this.feedbackDetailsForm.patchValue({
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
            this.feedbackDetailsForm.patchValue({
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

    this.isButtonDisable = true;
  }

  onClick(rating:number) {
    console.log(rating);
    // this.snackBar.open('You rated ' + rating + ' / ' + this.starCount, '', {
    //   duration: this.snackBarDuration
    // });
    this.rating = rating;
    const label = this.ratingLabels[rating];
    const combinedValue = `${rating}-${label}`;
    this.feedbackDetailsForm.get('serviceQuality')?.setValue(combinedValue);
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

  public confirmReview(data: any): void {
      const dialogRef = this._dialog.open(ReviewConfirmDialogComponent, {
        data: 'Confirm review of this customer feedback?',
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.reviewed();
        }
      });
    }

  reviewed(){
    const feedbackId = this.selectedData?.id;

  if (!feedbackId) {
    this.messageService.showError("Feedback ID not found");
    return;
  }
    this.customerFeedbackService.updateReview(feedbackId).subscribe({
      next: (res: any)=>{
        console.log("Reviewed Successfully");

        this.messageService.showSuccess("Feedback Reviewed Successfully");

        this.dialogRef.close(true);
      },
      error: (error)=>{
        console.log(error);

        this.messageService.showError("Reviwe Failed: "+ error);
      }
      
    });
  }

}
