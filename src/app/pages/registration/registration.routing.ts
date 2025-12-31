import { Routes } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { CustomerComponent } from './customer/customer.component';
import { SupplierComponent } from './supplier/supplier.component';
import { ItemComponent } from './item/item.component';
import { TaskComponent } from './task/task.component';
import { OnlineItemComponent } from './online-item/online-item.component';
import { GrnComponent } from './grn/grn.component';
import { VehiclesComponent } from './vehicles/vehicles.component';

export const RegistrationRoutes: Routes = [
  {
    path: '',
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
        path: 'vehicles',
        component: VehiclesComponent,
      },
      {
        path: 'supplier',
        component: SupplierComponent,
      },
      {
        path: 'item',
        component: ItemComponent,
      },
      {
        path: 'online-item',
        component: OnlineItemComponent,
      },
      {
        path: 'task',
        component: TaskComponent,
      },
      {
        path: 'grn',
        component: GrnComponent,
      },
    ],
  },
];
