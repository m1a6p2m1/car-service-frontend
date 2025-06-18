import { Routes } from '@angular/router';
import { FormDemoComponent } from './form-demo/form-demo.component';
import { EmployeeLoginComponent } from './employee-login/employee-login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';

export const PagesRoutes: Routes = [
    {
        path: 'form-demo',
        component: FormDemoComponent
    },
    {
        path: 'employee-login',
        component: EmployeeLoginComponent
    },
    {
        path: 'user-profile',
        component: UserProfileComponent
    },
    {
        path: 'shopping-cart',
        component: ShoppingCartComponent
    },

];
