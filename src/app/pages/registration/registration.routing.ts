import { Routes } from "@angular/router";
import { EmployeeComponent } from "./employee/employee.component";

export const RegistrationRoutes: Routes = [
    {
        path:'',
        children: [
            {
                path: 'employee',
                component: EmployeeComponent,
            },
        ]
    }
]