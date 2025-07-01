import { Routes } from '@angular/router';
import { EmployeeListComponent } from './static-reports/components/employee-list/employee-list.component';

export const ReportRoutes: Routes = [
  {
    path: 'employee-list',
    component: EmployeeListComponent
  }
];
