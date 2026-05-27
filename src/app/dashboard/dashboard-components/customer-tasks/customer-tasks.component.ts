import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-customer-tasks',
  standalone: false,
  templateUrl: './customer-tasks.component.html',
  styleUrl: './customer-tasks.component.scss'
})
export class CustomerTasksComponent {

  constructor(
    private router: Router,
  ){}

  openAppointmentDetails(): void{
    this.router.navigate(['/dashboard']);
  }

  openVehicleRegistration(): void{
    this.router.navigate(['/registration/vehicles']);
  }

}
