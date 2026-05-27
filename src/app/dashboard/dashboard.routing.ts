import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { TaskDetailComponent } from './dashboard-components/task-detail/task-detail.component';
import { AppointmentServiceComponent } from './dashboard-components/appointment-service/appointment-service.component';
import { CustomerTasksComponent } from './dashboard-components/customer-tasks/customer-tasks.component';

export const DashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: '#',
    component: DashboardComponent,
  },
  {
    path: 'task-detail/:id',
    component: TaskDetailComponent,
  },
  {
    path: 'appointment-service',
    component: AppointmentServiceComponent,
  },
  {
    path: 'customer-tasks',
    component: CustomerTasksComponent,
  },
  
  // {
  //   path: 'assigned-tasks',
  //   component: AppointmentServiceComponent,
  // },
];
