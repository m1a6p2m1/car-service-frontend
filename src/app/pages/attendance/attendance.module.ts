import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceRoutes } from './attendance-routing.module';
import { AttendanceMarkComponent } from './attendance-mark/attendance-mark.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    AttendanceMarkComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AttendanceRoutes),
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    DemoMaterialModule
  ]
})
export class AttendanceModule { }
