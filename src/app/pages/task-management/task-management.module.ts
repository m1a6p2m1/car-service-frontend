import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskAssignComponent } from './task-assign/task-assign.component';
import { TaskManagementRoutes } from './task-management.routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { AllTaskComponent } from './all-task/all-task.component';
import { TaskIntroduceComponent } from './task-introduce/task-introduce.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { AdditionalServicesComponent } from './additional-services/additional-services.component';
import { MatRadioModule } from '@angular/material/radio';
import { BillGenerateComponent } from './bill-generate/bill-generate.component';
import { BillGenerateDetailsComponent } from './bill-generate-details/bill-generate-details.component';



@NgModule({
  declarations: [
    TaskAssignComponent,
    AllTaskComponent,
    TaskIntroduceComponent,
    MyTasksComponent,
    AdditionalServicesComponent,
    BillGenerateComponent,
    BillGenerateDetailsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(TaskManagementRoutes),
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    DemoMaterialModule, 
    MatRadioModule 
  ]
})
export class TaskManagementModule { }
