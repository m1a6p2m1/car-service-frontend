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
    ],
  },
];
