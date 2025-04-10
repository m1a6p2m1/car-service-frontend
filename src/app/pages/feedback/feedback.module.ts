import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerFeedbackComponent } from './customer-feedback/customer-feedback.component';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { FeedbackRoutes } from './feedback.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { MatFormFieldModule } from '@angular/material/form-field';



@NgModule({
  declarations: [
    CustomerFeedbackComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(FeedbackRoutes),
    ReactiveFormsModule,
    DemoMaterialModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatRadioGroup,
    MatRadioButton,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonModule,
  ]
})
export class FeedbackModule { }
