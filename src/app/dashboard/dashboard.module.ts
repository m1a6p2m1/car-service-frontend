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

@NgModule({
  declarations: [
    AssignedTasksComponent,
    SalesOverviewComponent, 
    OurVisiterComponent, 
    ProfileComponent, 
    ContactsComponent, 
    ActivityTimelineComponent,
    DashboardComponent, 
    SubTasksComponent
  ],
  imports: [
    CommonModule,
    DemoMaterialModule,
    RouterModule.forChild(DashboardRoutes),
    NgApexchartsModule,
    
  ],
})
export class DashboardModule { }
