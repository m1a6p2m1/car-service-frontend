import { Routes } from '@angular/router';
import { EmployeeListComponent } from './static-reports/components/employee-list/employee-list.component';
import { EmployeeStatsComponent } from './static-reports/components/employee-stats/employee-stats.component';

export const ReportRoutes: Routes = [
  {
    path: 'employee-list',
    component: EmployeeListComponent
  },
  {
    path: 'employee-stats',
    component: EmployeeStatsComponent
  }
];
