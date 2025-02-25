import { Routes } from "@angular/router";
import { EmployeeComponent } from "./employee/employee.component";
import { CustomerComponent } from "./customer/customer.component";
import { SupplierComponent } from "./supplier/supplier.component";
import { ItemComponent } from "./item/item.component";

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
            {
                path: 'supplier',
                component: SupplierComponent,
            },
            {
                path: 'item',
                component: ItemComponent,
            },
        ]
    }
]