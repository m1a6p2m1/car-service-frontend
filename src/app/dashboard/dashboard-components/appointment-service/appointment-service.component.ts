import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Appointment, Task, TimeSlot } from 'src/app/models/appointment.model';
import { AppointmentService } from 'src/app/services/appointment.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';


@Component({
  selector: 'app-appointment-service',
  standalone: false,
  templateUrl: './appointment-service.component.html',
  styleUrl: './appointment-service.component.scss'
})


export class AppointmentServiceComponent implements OnInit{

   additionalServices: string[] = [
    'Oil Change',
    'Filter Change',
    'Engine Wash'
  ];

  appointmentServiceForm: FormGroup;

  displayedColumns: string[] = ['time', 'status', 'available', 'action'];
  dataSource!: MatTableDataSource<TimeSlot>;
  timeSlots: TimeSlot[] = [];


  today: Date = new Date();
  selectedDate: Date | null = null;
  selectedSlot: TimeSlot | null = null;
  selectedTime: string | null = null;
  isLoading = false;
  dateFilter: any;
  selectedVehicle = '';
  totalCost = 0;
  selectedOptions: string[] = [];
  OldSelectedOptions: string[] = [];
  taskName: any;
  taskId: any;
  selectedServices: string = "";
  
  

  // isLoading = false;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private messageService: MessageServiceService,
    private activatedRoute: ActivatedRoute,
    private router: Router
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
      phoneNumber: new FormControl(''),
      taskId: new FormControl(''),
      taskName: new FormControl(''),
      additionalServices: new FormControl('')
    });
  }

 
ngOnInit(): void {
    // Optional: set default date here
    
    this.dataSource = new MatTableDataSource<TimeSlot>();
    
    const vehiclePrices: { [key: string]: number } = {
      'car':150,
      'van':300,
      'jeep': 400,  
    }

    this.appointmentServiceForm.get('vehicleType')?.valueChanges.subscribe((selectedType)=>{
      const price = vehiclePrices[selectedType] || '';
      this.appointmentServiceForm.get('price')?.setValue(price);
    });

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

  // Optional: Disable Sundays in date picker
  // dateFilter = (d: Date | null): boolean => {
  //   const day = (d || new Date()).getDay();
  //   return day !== 0; // disable Sundays
  // };

  selectSlot(time: string, data: any): void {
  this.selectedTime = time;
  console.log(data);
}

  // Book the selected appointment
  submitAppointment(): void {
    console.log('In the Service → save appointment-> ts file');
    if (!this.selectedDate || !this.selectedTime) return;
    const formValues = this.appointmentServiceForm.getRawValue();

    const booking: Appointment = {
      appointmentDate:this.formatDateLocal(this.selectedDate),
      timeSlot: this.selectedTime,
      price: this.totalCost,
      taskName: this.taskName,
      taskId: this.taskId
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
        this.messageService.showError("Error Occured. Please try again!=")
      }
    });
  }

  public processObjects(booking: Appointment): void {
    this.appointmentServiceForm.patchValue({
      date: booking.appointmentDate,
      time: booking.timeSlot,
      totalServicePrice: booking.price,
      taskId: booking.taskId,
      taskName: booking.taskName,
      additionalServices: this.selectedServices
    });

    return this.appointmentServiceForm.getRawValue();
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
    if (vehicle == 'Car') {
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
  }

  public onAdditionalServiceChange(service: any, event: MatCheckboxChange): void {
    if (event.checked) {
      this.selectedOptions.push(service);

        if (service == "Oil Change") {
          this.totalCost = this.totalCost + 10;
        }
        if (service == "Filter Change") {
          this.totalCost = this.totalCost + 50;
        }
        if (service == "Engine Wash") {
          this.totalCost = this.totalCost + 100;
        }
    } else {
      this.selectedOptions = this.selectedOptions.filter(item => item !== service);
        if (service == "Oil Change") {
          this.totalCost = this.totalCost - 10;
        }
        if (service == "Filter Change") {
          this.totalCost = this.totalCost - 50;
        }
        if (service == "Engine Wash") {
          this.totalCost = this.totalCost - 100;
        }
    }

    this.selectedServices = this.selectedOptions.join(',');
  }
}
