import { Routes } from '@angular/router';
import { AppointmentListComponent } from './appointment-list.component';
import { AllAppointmentsComponent } from './all-appointments/all-appointments.component';

export const AppointmentRoutes: Routes = [
  {
    path: 'appointment-list',
    component: AppointmentListComponent
  },
  {
    path: 'all-appointments',
    component: AllAppointmentsComponent
  }
];
