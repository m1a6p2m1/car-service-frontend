import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeComponent } from './employee/employee.component';
import { RouterModule } from '@angular/router';
import { RegistrationRoutes } from './registration.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { CustomerComponent } from './customer/customer.component';
import { SupplierComponent } from './supplier/supplier.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ItemComponent } from './item/item.component';
import { TaskComponent } from './task/task.component';
import { EmployeeLoginDetailsComponent } from './employee-login-details/employee-login-details.component';

@NgModule({
  declarations: [
    EmployeeComponent,
    CustomerComponent,
    SupplierComponent,
    ItemComponent,
    TaskComponent,
    EmployeeLoginDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(RegistrationRoutes),
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
    MatCheckboxModule,
  ],
})
export class RegistrationModule {}
