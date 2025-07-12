import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { RouterModule } from '@angular/router';
import { ReportRoutes } from './reports-routing.module';
import { EmployeeListComponent } from './static-reports/components/employee-list/employee-list.component';
import { EmployeeStatsComponent } from './static-reports/components/employee-stats/employee-stats.component';
import { NgApexchartsModule } from 'ng-apexcharts';


@NgModule({
  declarations: [
    EmployeeListComponent, EmployeeStatsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ReportRoutes),
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    DemoMaterialModule,
    NgApexchartsModule
  ]
})
export class ReportModule { }
