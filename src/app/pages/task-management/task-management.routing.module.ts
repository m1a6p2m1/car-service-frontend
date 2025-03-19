import { Routes } from "@angular/router";
import { TaskAssignComponent } from "./task-assign/task-assign.component";
import { AllTaskComponent } from "./all-task/all-task.component";

export const TaskManagementRoutes: Routes = [
    {
        path:'',
        children: [
            {
                path: 'task-assign',
                component: TaskAssignComponent,
            },
            {
                path: 'all-task',
                component: AllTaskComponent,
            },
            
        ]
    }
]