import { Component, AfterViewInit } from '@angular/core';
import { SalesOverviewComponent } from './dashboard-components/sales-overview/sales-overview.component';
import { OurVisiterComponent } from './dashboard-components/our-visiter/our-visiter.component';
import { ProfileComponent } from './dashboard-components/profile/profile.component';
import { ContactsComponent } from './dashboard-components/contacts/contacts.component';
import { ActivityTimelineComponent } from './dashboard-components/activity-timeline/activity-timeline.component';
import { AssignedTasksComponent } from './dashboard-components/assigned-tasks/assigned-tasks.component';
import { CarWashServiceData } from '../services/dummy-services/dummy.service';

export interface CarWashService {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  features: string[];
  popular?: boolean;
}

@Component({
	selector: 'app-dashboard',
	standalone: false,
	// imports: [SalesOverviewComponent, OurVisiterComponent, ProfileComponent, ContactsComponent, ActivityTimelineComponent ],
	templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.componenet.scss']
})
export class DashboardComponent implements AfterViewInit {
	services: CarWashService[] = [];

	constructor(private carWashService: CarWashServiceData) {
		this.services = this.carWashService.getServices();
	}
	ngAfterViewInit() { }

}
