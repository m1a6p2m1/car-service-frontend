import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CustomerFeedbackService } from 'src/app/services/feedback/customer-feedback.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface CustomerFeedback {
  id: number;
  userName: string;
  taskNumber: number;
  serviceDate: string;
  serviceType: string;
  serviceQuality: string;
  recommendation: string;
  complaint: string;
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

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      private fb: FormBuilder,
      private customerFeedbackService: CustomerFeedbackService,
      private messageService:MessageServiceService
    ){
      this.feedbackDetailsForm = this.fb.group({
        userName: new FormControl(''),
        taskNumber: new FormControl(''),
        serviceDate: new FormControl({ value: '', disabled: true }),
        serviceType: new FormControl({ value: '', disabled: true }),
        serviceQuality: new FormControl('', Validators.required),
        // serviceQualityLabel: new FormControl(''),
        recommendation: new FormControl('', Validators.required),
        complaint: new FormControl('')
      });
    }

    public ngOnInit(): void {
        this.selectedData = this.data;
        this.viewData();
    }


    public viewData(): void{
  
      const fbId = this.selectedData?.id;
      console.log("fbId:", fbId);

      if (!fbId) {
        console.error("No feedback ID provided.");
        return;
      }
      this.customerFeedbackService.getData(fbId).subscribe({
      next: (data: CustomerFeedback) => {
        
    // Populate form
      this.feedbackDetailsForm.patchValue(data);
      const quality = data.serviceQuality;
      this.rating = parseInt(quality?.split('-')[0]) || 0;

    // Disable the form to make it view-only
      this.feedbackDetailsForm.disable();
      },
      error: (err) => {
        console.error("Error fetching feedback:", err);
      }
      });
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

}
