import { Routes } from "@angular/router";
import { TaskAssignComponent } from "./task-assign/task-assign.component";
import { AllTaskComponent } from "./all-task/all-task.component";
import { TaskIntroduceComponent } from "./task-introduce/task-introduce.component";
import { MyTasksComponent } from "./my-tasks/my-tasks.component";

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
            {
                path: 'task-introduce',
                component: TaskIntroduceComponent,
            },
            {
                path: 'my-tasks',
                component: MyTasksComponent
            }
            
        ]
    }
]