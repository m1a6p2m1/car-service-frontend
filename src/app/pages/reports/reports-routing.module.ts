import { Routes } from '@angular/router';
import { EmployeeListComponent } from './static-reports/components/employee-list/employee-list.component';
import { EmployeeStatsComponent } from './static-reports/components/employee-stats/employee-stats.component';
import { CustomerFeedbacksComponent } from './static-reports/components/customer-feedbacks/customer-feedbacks.component';
import { ServiceTypesComponent } from './static-reports/components/service-types/service-types.component';
import { TaskStatsComponent } from './static-reports/components/task-stats/task-stats.component';

export const ReportRoutes: Routes = [
  {
    path: 'employee-list',
    component: EmployeeListComponent
  },
  {
    path: 'employee-stats',
    component: EmployeeStatsComponent
  },
  {
    path: 'task-stats',
    component: TaskStatsComponent
  },
  {
    path: 'customer-feedbacks',
    component: CustomerFeedbacksComponent
  },
  {
    path: 'service-types',
    component: ServiceTypesComponent
  },
];
