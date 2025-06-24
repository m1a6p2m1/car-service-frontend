import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from './guards/auth.guard';

export const AppRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/authentication/login',
        pathMatch: 'full',
      },
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      },
    ],
  },
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: '',
        loadChildren: () =>
          import('./material-component/material.module').then(
            (m) => m.MaterialComponentsModule
          ),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./pages/pages.module').then((m) => m.PagesModule),
      },
      {
        path: 'privileges',
        loadChildren: () =>
          import('./pages/privileges/privileges.module').then(
            (m) => m.PrivilegesModule
          ),
      },

      //registration module
      {
        path: 'registration',
        loadChildren: () =>
          import('./pages/registration/registration.module').then(
            (m) => m.RegistrationModule
          ),
      },

      //task-managenent module
      {
        path: 'task-management',
        loadChildren: () =>
          import('./pages/task-management/task-management.module').then(
            (m) => m.TaskManagementModule
          ),
      },

      //attendance module
      {
        path: 'attendance',
        loadChildren: () =>
          import('./pages/attendance/attendance.module').then(
            (m) => m.AttendanceModule
          ),
      },

      //feedback module  
      {
        path: 'feedback',
        loadChildren: () =>
          import('./pages/feedback/feedback.module').then(
            (m) => m.FeedbackModule
          ),
      },

      //online-shopping module  
      {
        path: 'online-shopping',
        loadChildren: () =>
          import('./pages/online-shopping/online-shopping.module').then(
            (m) => m.OnlineShoppingModule
          ),
      },

    ],
  },
];
