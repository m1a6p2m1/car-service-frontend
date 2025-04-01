import { Routes } from '@angular/router';
import { FormDemoComponent } from './form-demo/form-demo.component';
import { EmployeeLoginComponent } from './employee-login/employee-login.component';

export const PagesRoutes: Routes = [
    {
        path: 'form-demo',
        component: FormDemoComponent
    },
    {
        path: 'employee-login',
        component: EmployeeLoginComponent
    }

];
