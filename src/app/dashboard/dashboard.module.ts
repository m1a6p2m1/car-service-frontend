import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';
import { AssignedTasksComponent } from './dashboard-components/assigned-tasks/assigned-tasks.component';
import { ActivityTimelineComponent } from './dashboard-components/activity-timeline/activity-timeline.component';
import { ContactsComponent } from './dashboard-components/contacts/contacts.component';
import { OurVisiterComponent } from './dashboard-components/our-visiter/our-visiter.component';
import { ProfileComponent } from './dashboard-components/profile/profile.component';
import { SalesOverviewComponent } from './dashboard-components/sales-overview/sales-overview.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SubTasksComponent } from './dashboard-components/sub-tasks/sub-tasks.component';
import { MatListModule } from '@angular/material/list';
import { TaskDetailComponent } from './dashboard-components/task-detail/task-detail.component';
import { AppointmentServiceComponent } from './dashboard-components/appointment-service/appointment-service.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AssignedTasksComponent,
    SalesOverviewComponent, 
    OurVisiterComponent, 
    ProfileComponent, 
    ContactsComponent, 
    ActivityTimelineComponent,
    DashboardComponent, 
    SubTasksComponent,
    TaskDetailComponent,
    AppointmentServiceComponent,
  ],
  imports: [
    CommonModule,
    DemoMaterialModule,
    RouterModule.forChild(DashboardRoutes),
    NgApexchartsModule,
    MatListModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class DashboardModule { }
