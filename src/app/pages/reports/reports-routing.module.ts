import { Routes } from '@angular/router';
import { EmployeeListComponent } from './static-reports/components/employee-list/employee-list.component';
import { EmployeeStatsComponent } from './static-reports/components/employee-stats/employee-stats.component';
import { CustomerFeedbacksComponent } from './static-reports/components/customer-feedbacks/customer-feedbacks.component';
import { ServiceTypesComponent } from './static-reports/components/service-types/service-types.component';
import { TaskStatsComponent } from './static-reports/components/task-stats/task-stats.component';
import { ServiceTypeByDateComponent } from './static-reports/components/service-type-by-date/service-type-by-date.component';
import { VehicleTypeByDateComponent } from './static-reports/components/vehicle-type-by-date/vehicle-type-by-date.component';
import { CustomerListComponent } from './static-reports/components/customer-list/customer-list.component';

export const ReportRoutes: Routes = [
  {
    path: 'employee-list',
    component: EmployeeListComponent
  },
  {
    path: 'customer-list',
    component: CustomerListComponent
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
    path: 'service-types',
    component: ServiceTypesComponent
  },
  {
    path: 'customer-feedbacks',
    component: CustomerFeedbacksComponent
  },
  {
    path: 'service-type-by-date',
    component: ServiceTypeByDateComponent
  },
  {
    path: 'vehicle-type-by-date',
    component: VehicleTypeByDateComponent
  }
];
