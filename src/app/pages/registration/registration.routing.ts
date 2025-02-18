import { Routes } from "@angular/router";
import { EmployeeComponent } from "./employee/employee.component";
import { CustomerComponent } from "./customer/customer.component";

export const RegistrationRoutes: Routes = [
    {
        path:'',
        children: [
            {
                path: 'employee',
                component: EmployeeComponent,
            },
            {
                path: 'customer',
                component: CustomerComponent,
            },
        ]
    }
]