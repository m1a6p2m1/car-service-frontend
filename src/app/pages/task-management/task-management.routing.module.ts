import { Routes } from "@angular/router";
import { TaskAssignComponent } from "./task-assign/task-assign.component";

export const TaskManagementRoutes: Routes = [
    {
        path:'',
        children: [
            {
                path: 'task-assign',
                component: TaskAssignComponent,
            },
            
        ]
    }
]