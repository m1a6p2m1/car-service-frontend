import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PagesRoutes } from './pages.routing.module';
import { DemoMaterialModule } from '../demo-material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormDemoComponent } from './form-demo/form-demo.component';
import { EmployeeLoginComponent } from './employee-login/employee-login.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
  declarations: [
    FormDemoComponent,
    EmployeeLoginComponent,
    UserProfileComponent,
  ],
  imports: [
    CommonModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    RouterModule.forChild(PagesRoutes),
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule
  ],
  exports: [],
})
export class PagesModule {}
