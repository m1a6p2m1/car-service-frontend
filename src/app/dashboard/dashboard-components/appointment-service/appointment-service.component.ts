import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Appointment, Task, TimeSlot } from 'src/app/models/appointment.model';
import { AppointmentService } from 'src/app/services/appointment.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { AdditionalServicesService } from 'src/app/services/task-management/additional-services.service';
import { ConfirmAppointmentComponent } from '../confirm-appointment/confirm-appointment.component';
import { MatDialog } from '@angular/material/dialog';
import { V } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-appointment-service',
  standalone: false,
  templateUrl: './appointment-service.component.html',
  styleUrl: './appointment-service.component.scss'
})


export class AppointmentServiceComponent implements OnInit{

  //  additionalServices: string[] = [
  //   'Oil Change',
  //   'Filter Change',
  //   'Engine Wash'
  // ];

  appointmentServiceForm: FormGroup;

  displayedColumns: string[] = ['time', 'status', 'available', 'action'];
  dataSource!: MatTableDataSource<TimeSlot>;
  timeSlots: TimeSlot[] = [];


  today: Date = new Date();
  selectedDate: Date | null = null;
  selectedSlot: TimeSlot | null = null;
  selectedTime: string | null = null;
  isLoading = false;
  selectedVehicle = '';
  totalCost = 0;
  selectedOptions: any[] = [];
  OldSelectedOptions: string[] = [];
  taskName: any;
  taskId: any;
  selectedServices: string = "";
  additionalServices: any[] = [];
  minDate: Date = new Date(); // disables past dates
  userRole: string = '';
  vehicleList: any[] = [];
  task!: Task;

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;

    const day = date.getDay();
    return day !== 0; // disables Sundays
  };

  // <!--Fields for Dropdown with Custom Input Enabled -->
  vehicleTypes: string[] = ['Car', 'Jeep', 'Van'];
  filteredVehicleTypes: string[] = [];

  

  // isLoading = false;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private additionalServicesService: AdditionalServicesService,
    private messageService: MessageServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private _dialog: MatDialog,
  ) {
  if (this.router.getCurrentNavigation()?.extras.state) {
    const navigation = this.router.getCurrentNavigation();
    const taskData = navigation?.extras?.state?.['dataObject'];
    if (taskData) {
    this.totalCost = taskData.totalTaskPrice;
    this.taskName = taskData.taskName;
    this.taskId = taskData.id;
  }
  }
    this.appointmentServiceForm = this.fb.group({
      date: new FormControl(null),
      time: new FormControl(''),
      vehicleType: new FormControl(''),
      price: new FormControl({value: '', disabled: true }),
      serviceType: new FormControl(''),
      servicePrice: new FormControl({value: '', disabled: true }),
      totalServicePrice: new FormControl({value: '', disabled: true }),
      customerName: new FormControl(''),
      email: new FormControl(''),
      contactNumber: new FormControl(''),
      licencePlate: new FormControl(''),
      taskId: new FormControl(''),
      taskName: new FormControl(''),
      additionalServices: new FormControl('')
    });
  }

 
ngOnInit(): void {
    // Optional: set default date here
    this.userRole = localStorage.getItem('userRole') || '';

    console.log("User Role from localStorage:", this.userRole);

    this.loadUserProfile();

    const user = JSON.parse(localStorage.getItem('user')!);
    const customerId = user.id;

    this.loadVehicles(customerId);

    console.log("Customer ID:", customerId);
    console.log("Vehicle List:", this.vehicleList);
    
    this.dataSource = new MatTableDataSource<TimeSlot>();
    
    const vehiclePrices: { [key: string]: number } = {
      'car':150,
      'jeep': 400, 
      'van':300,
       
    }

    this.appointmentServiceForm.get('vehicleType')?.valueChanges.subscribe((selectedType)=>{
      const price = vehiclePrices[selectedType] || 0;
      this.appointmentServiceForm.get('price')?.setValue(price);
    });

    this.additionalServicesService.getData().subscribe((resopnse:any)=>{
      this.additionalServices = resopnse.filter(
        (service:any) => service.status === "Yes"
      );
    })

    this.appointmentServiceForm.patchValue({
      totalServicePrice: this.totalCost
    });
  
  // this.route.queryParams.subscribe(params => {
  //   const serializedObject = params['objectData'];
  //   if (serializedObject) {
  //     const dataObject = JSON.parse(serializedObject);
  //     console.log('Received object:', dataObject);
  //     this.totalCost = dataObject.totalTaskPrice;
  //   }
  // });

  // <!--Functionas and Initializations for Dropdown with Custom Input Enabled -->
  this.filteredVehicleTypes = this.vehicleTypes;

  this.appointmentServiceForm.get('vehicleType')!.valueChanges.subscribe(value => {
    this.filteredVehicleTypes = this.filter(value || '');
  });
}

// <!--Functions for Dropdown with Custom Input Enabled -->

filter(value: string): string[] {
  const filterValue = value.toLowerCase();
  return this.vehicleTypes.filter(option =>
    option.toLowerCase().includes(filterValue)
  );
}

onOptionSelected(event: any) {
  const value = event.option.value;
  this.appointmentServiceForm.get('vehicleType')?.setValue(value);
}

// Add new value if not exists
addIfNotExists() {
  const value = this.appointmentServiceForm.get('vehicleType')?.value?.trim();

  if (value && !this.vehicleTypes.includes(value)) {
    this.vehicleTypes.push(value);
    this.filteredVehicleTypes = this.vehicleTypes;
  }
}

//load logged customer data
loadUserProfile(): void {
    this.appointmentService.getLoggedInUserDetails().subscribe({
      next: (user: any) => {
        this.appointmentServiceForm.patchValue({
          id: user.id,
          customerName: `${user.firstName} ${user.lastName}`,
          email: user.email,
          contactNumber: user.contactNumber
        });
        console.log("loadUserProfile");
        console.log("Form Name:", this.appointmentServiceForm.get('customerName')?.value);
        console.log("Form Email:", this.appointmentServiceForm.get('email')?.value);
        console.log("Form PN:", this.appointmentServiceForm.get('contactNumber')?.value);
        // this.selectedData = response;
      },
      error: (error) => {
        console.error('Failed to load user profile:', error);
      }
    });
  }

  //load logged customer's vehicles data
  loadVehicles(customerId: number) {
  this.appointmentService.getVehiclesByCustomer(customerId).subscribe({
    next: (res: any[]) => {
      this.vehicleList = res;
      console.log("Vehicles:", this.vehicleList);
    },
    error: (err) => {
      console.error("Vehicle load error", err);
    }
  });
}

onVehicleSelect(licencePlate: string) {

  console.log("Selected licencePlate: ", licencePlate);
  console.log("vehicle list: ", this.vehicleList);

  const vehicle = this.vehicleList.find(
      v => v.licencePlate === licencePlate);

      console.log("matched Vehicle:", vehicle);

  // Auto-fill vehicle type (optional)
    if (vehicle) {
      this.appointmentServiceForm.patchValue({
    // licencePlate: vehicle.licencePlate,
      vehicleType: vehicle.vehicleType
      });
    }
  
}


formatDateLocal(date: Date): string {
  return date.getFullYear() + '-' +
         String(date.getMonth() + 1).padStart(2, '0') + '-' +
         String(date.getDate()).padStart(2, '0');
}

  // Handle date change from <mat-datepicker>
  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    const date = event.value;
    this.selectedTime = null;
    this.timeSlots = [];
    this.dataSource.data = [];  

    if (date) {
      this.selectedDate = date;
      // const selectedDateStr = date.toISOString().split('T')[0];
      const iso = this.formatDateLocal(date);

      // console.log('Raw selected date:', date);
      // console.log('Local date string:', date?.toDateString());
      // console.log('UTC string:', date?.toUTCString());
      // console.log('toISOString:', date?.toISOString());

      this.isLoading = true;
      this.appointmentService.getAvailableSlots(iso).subscribe({
        next: (slots) => {
          this.timeSlots = slots;
          this.dataSource.data = slots;
          this.isLoading = false;
          console.log('Date:', date);
          console.log('Raw slots from API →', slots);
        },
        error: (error) => {
          console.error(error);
          this.messageService.showError(
            'Action Failed with Error :' + error
          );
          this.isLoading = false;
        }
      });
    }

}


  // Select a time slot from the table
  // selectSlot(slot: string): void {
  //   this.selectedTime = slot;
  //   this.appointmentServiceForm.patchValue({ time: slot });
  //   console.log('Raw slots from API →', slot);
  // }

  // Format time string like '09:30:00' to '09:30 AM'
  formatTime(time: string): string {
    try {
    // Split hours/minutes/seconds
    const [hour, minute, second] = time.split(':').map(Number);

    // Create a Date in local time zone (no need to deal with UTC)
    const date = new Date();
    date.setHours(hour, minute, second || 0, 0);  // hour, minute, second, ms

    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    console.error('Time parse error:', e);
    return 'Invalid Time';
  }
  }

  getBaysLeft(slot: TimeSlot): number {
    return Math.max(3 - slot.bookedCount, 0);
  }

  // Get readable status text
  getStatusText(slot: TimeSlot): string {
    if (slot.bookedCount >= 3) return 'Full';
    if (slot.bookedCount === 2) return 'Filling';
    return 'Available';
  }

  // CSS class for status (green/orange/red)
  getStatusClass(slot: TimeSlot): string {
    if (slot.bookedCount >= 3) return 'status-full';
    if (slot.bookedCount === 2) return 'status-filling';
    return 'status-available';
  }

  selectSlot(time: string, data: any): void {
    this.selectedTime = time;
    console.log(data);
  }

  public confirmAppointment(): void {
      const dialogRef = this._dialog.open(ConfirmAppointmentComponent, {
        // data: 'Your total price may change depending on the selected service type and any additional services added during the service. Would you like to continue..?',
        data: 'Your Total Price may change depending on the selected service type. Any \n additional services added during the service may also affect the price.\nWould you like to continue?'
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.submitAppointment();
        }
      });
  }

  // Book the selected appointment
  submitAppointment(): void {
    console.log('In the Service → save appointment-> ts file');
    if (!this.selectedDate || !this.selectedTime) return;
    let roleToSave = '';

    if (this.userRole === 'EMPLOYEE') {
      roleToSave = 'SYSTEM';
    } else {
      roleToSave = 'CUSTOMER';
    }
    // const formValues = this.appointmentServiceForm.getRawValue();

    const login = localStorage.getItem('login') ?? undefined;
    const booking: Appointment = {
      appointmentDate:this.formatDateLocal(this.selectedDate),
      timeSlot: this.selectedTime,
      price: this.totalCost,
      taskName: this.taskName,
      taskId: this.taskId,
      role: roleToSave,
      login: login
    };

    this.appointmentService.bookAppointment(this.processObjects(booking)).subscribe({
      next: (resp) => {
        const updatedSlot = this.timeSlots.find(slot => slot.time === this.selectedTime);
        if (updatedSlot) {
          updatedSlot.bookedCount += 1;
          this.dataSource.data = [...this.timeSlots];
        }
        this.selectedTime = null;
        this.onDateChange({ value: this.selectedDate } as MatDatepickerInputEvent<Date>);

        this.appointmentServiceForm.disable();
        this.messageService.showSuccess("Your Appointment Successfully Scheduled!");
      },
      error: (err) => {
        console.error(err);
        this.messageService.showError("Error Occured. Please try again!");
      }
    });
  }

  public processObjects(booking: Appointment): Appointment  {
    this.appointmentServiceForm.patchValue({
      date: booking.appointmentDate,
      time: booking.timeSlot,
      totalServicePrice: booking.price,
      taskId: booking.taskId,
      taskName: booking.taskName,
      additionalServices: this.selectedServices
    });

    return {
      ...this.appointmentServiceForm.getRawValue(),
      role: booking.role,
      login: booking.login
    };
  }

  // public previous(): void {

  //   const previousId = this.task.id -1;
    
  //     this.router.navigate(['/dashboard/task-detail', previousId], {
  //       state: {
  //         dataObject: this.task
  //       }
  //     });
  // }

  loadTaskId(): void {
    this.route.paramMap.subscribe(params => {
      this.taskId = Number(params.get('id'));
    });
  }

  previous(): void {
    if (this.taskId >= 1) {
      this.router.navigate(['/dashboard/task-detail', this.taskId]);
    }
  }



























  // onDateChange(date: Date) {
  //   this.selectedDate = date;
  //   this.selectedTime = null;
  //   this.fetchAvailableSlots(date);
  // }

  // fetchAvailableSlots(date: Date) {
  //   this.isLoading = true;
  //   const dateStr = date.toISOString().split('T')[0];
  //   this.appointmentService.getAvailableSlots(dateStr).subscribe({
  //     next: (slots) => {
  //       this.availableSlots = slots;
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.availableSlots = [];
  //       this.isLoading = false;
  //     }
  //   });
  // }

  // selectTimeSlot(slot: string) {
  //   this.selectedTime = slot;
  //   this.appointmentServiceForm.patchValue({ time: slot });
  // }

  // submitAppointment() {
  //   if (this.appointmentServiceForm.valid) {
  //     const data = this.appointmentServiceForm.value;
  //     console.log('Booking Appointment:', data);
  //     // call backend booking API here
  //   }
  // }

  public onVehicleTypeChange(vehicle: any): void {
      if (this.selectedVehicle) {
        if(this.selectedVehicle == 'Car') {
          this.totalCost = this.totalCost - 150;
        }
        if (this.selectedVehicle == 'Jeep') {
          this.totalCost = this.totalCost - 200;
        }
        if (this.selectedVehicle == 'Van') {
          this.totalCost = this.totalCost - 250;
        }
      }

      this.selectedVehicle = vehicle;

      if (this.selectedVehicle) {
        if(this.selectedVehicle == 'Car') {
          this.totalCost = this.totalCost + 150;
        }
        if (this.selectedVehicle == 'Jeep') {
          this.totalCost = this.totalCost + 200;
        }
        if (this.selectedVehicle == 'Van') {
          this.totalCost = this.totalCost + 250;
        }
      
      
    }
  }

  public onAdditionalServiceChange(service: any, event: MatCheckboxChange): void {
    if (event.checked) {
      this.selectedOptions.push(service);
      this.totalCost = this.totalCost + service.additionalServicePrice;
    } else {
      this.selectedOptions = this.selectedOptions.filter(item => item.id !== service.id);
      this.totalCost = this.totalCost - service.additionalServicePrice;
    }

    this.selectedServices = this.selectedOptions
    .map(s => s.additionalServicesName)
    .join(',');
  }


}
