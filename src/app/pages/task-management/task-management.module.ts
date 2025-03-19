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



@NgModule({
  declarations: [
    TaskAssignComponent,
    AllTaskComponent
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
  ]
})
export class TaskManagementModule { }
