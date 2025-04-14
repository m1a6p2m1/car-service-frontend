import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { AssignedTasksComponent } from './dashboard-components/assigned-tasks/assigned-tasks.component';

export const DashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: '#',
    component: DashboardComponent,
  },
  // {
  //   path: 'assigned-tasks',
  //   component: AssignedTasksComponent,
  // },
];
