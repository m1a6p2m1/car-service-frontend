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
import { TaskIntroduceService } from 'src/app/services/task-management/task-introduce.service';


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
  filteredVehicleList: any[] = [];
  task!: Task;
  isSelectButtonDisable = false;
  isConfirmButtonDisable = false;
  isBackButtonDisable: boolean  = false;
  isEditMode: boolean = false;
  taskList: any[] = [];
  selectedTask: any;
  appointmentData: any;
  originalTotalCost: number = 0;
  originalTaskId: number = 0;
  // originalTaskPrice: number = 0;
  additionalServiceCost: number = 0;
  currentTaskPrice = 0;
  originalSelectedTime: string | null = null;
  selectedData!: { id: number };
  savedTime: string | null = null;

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
    private taskIntroduceService: TaskIntroduceService,
    private messageService: MessageServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private _dialog: MatDialog,
  ) {
  if (this.router.getCurrentNavigation()?.extras.state) {
    const navigation = this.router.getCurrentNavigation();
    const taskData = navigation?.extras?.state?.['dataObject'];
    const state = history.state;

      if (state) {
        this.taskId = state.taskId;
        this.taskName = state.taskName;
        // this.totalCost = state.totalTaskPrice;
        this.currentTaskPrice = state.totalTaskPrice || 0;
        this.totalCost = this.currentTaskPrice;
      }
  }
    this.appointmentServiceForm = this.fb.group({
      date: new FormControl(null),
      time: new FormControl(''),
      vehicleType: new FormControl(''),
      price: new FormControl({value: '', disabled: true }),
      serviceType: new FormControl(''),
      servicePrice: new FormControl({value: '', disabled: true }),
      totalServicePrice: new FormControl(''),
      customerName: new FormControl(''),
      email: new FormControl(''),
      contactNumber: new FormControl(''),
      licencePlate: new FormControl(''),
      taskId: new FormControl(''),
      taskName: new FormControl(''),
      additionalServices: new FormControl(''),
    });
  }

 
  ngOnInit(): void {
      // Optional: set default date here
      this.userRole = localStorage.getItem('userRole') || '';

      console.log("User Role from localStorage:", this.userRole);

      const contactNumber = localStorage.getItem('contactNumber');
      if (this.userRole === "CUSTOMER") {
        const user = JSON.parse(localStorage.getItem('user')!);
        const customerId = user.id;

        this.loadVehicles(customerId);
        this.loadUserProfile();

        console.log("Customer ID:", customerId);
      } else if (this.userRole === "EMPLOYEE" && contactNumber) {
        this.onPhoneChange(contactNumber)
      }
      
      this.appointmentServiceForm.get('contactNumber')?.valueChanges
          .subscribe(value => {
            if (this.userRole === "EMPLOYEE" && value && value.length >= 10) {
              this.onPhoneChange(value);
            }
          });
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

        if(this.appointmentData){
          this.loadSelectedAdditionalServices();
        }
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

    // this.filteredVehicleList = this.vehicleList;

      this.appointmentServiceForm.get('licencePlate')!.valueChanges.subscribe(value => {
      this.filteredVehicleList = this.filterPlate(value || '');
    });

    console.log("taskId =", this.taskId);
    console.log("taskName =", this.taskName);
    console.log("totalCost =", this.totalCost);

    if (!this.isEditMode && this.currentTaskPrice > 0) {
      this.totalCost = this.currentTaskPrice;

      this.appointmentServiceForm.patchValue({
        taskId: this.taskId,
        taskName:this.taskName,
        totalServicePrice: this.totalCost
      });
      
    }

    this.loadEditData();
    this.loadTasks();
  }

  convertArrayToDate(dateArray: number[]): Date {

    const year = dateArray[0];
    const month = dateArray[1] - 1; // JS months start at 0
    const day = dateArray[2];

    return new Date(year, month, day);
  }

  convertArrayToTime(timeArray: number[]): string {

    const hour = String(timeArray[0]).padStart(2, '0');
    const minute = String(timeArray[1]).padStart(2, '0');

    return `${hour}:${minute}:00`;
  }

  normalizeTime(time: string): string {
    if (!time) return '';
    return time.length === 5 ? time + ':00' : time;
  }

  get appointmentButtonLabel(): string {
    return this.isEditMode ? 'Edit Appointment' : 'Confirm Appointment';
  }


//when click the edit button
  onTaskChange(taskId: number): void {

    const newTask = this.taskList.find(t => t.id === taskId);

    if (!newTask) return;

    this.currentTaskPrice = newTask.totalTaskPrice || 0;

    this.totalCost =
          this.currentTaskPrice +
          this.additionalServiceCost;
    
    this.appointmentServiceForm.patchValue({
      taskId: newTask.id,
      taskName: newTask.taskName,
      totalServicePrice: this.totalCost
    });

    this.selectedTask = newTask;
  }

//load editMode when click the edit button in all appointments table
  loadEditData(): void {
    console.log('loadEditData called');

    // this.isBackButtonDisable = true;
    console.log('Button disabled:', this.isBackButtonDisable);
    const state = history.state;
    if (state?.appointmentData) {
      console.log('Edit mode detected');
      this.appointmentData = state.appointmentData;
      this.isEditMode = state.isEditMode;
      this.isBackButtonDisable = false;
      console.log('Button disabled after edit:', this.isBackButtonDisable);
      // this.appointmentButtonLabel = 'Edit Appointment';
      
      console.log("EDIT DATA:", this.appointmentData);
      console.log("taskId:", this.taskId);
      console.log("form taskId:", this.appointmentServiceForm.get('taskId')?.value);
      console.log("isEditMode:", this.isEditMode);

      this.originalTotalCost = this.appointmentData.totalServicePrice || 0;
      this.originalTaskId = Number(this.appointmentData.taskId);

      this.totalCost = this.originalTotalCost;

      // this.totalCost = this.appointmentData.totalServicePrice;
      // this.taskName = this.appointmentData.taskId;
      // this.taskId = this.appointmentData.taskId;
    }
  }

//load tasks to the task dropdown
  loadTasks(): void{
    this.taskIntroduceService.getData().subscribe((res: any) => {
      this.taskList = res;

      console.log("Task List Loaded", this.taskList);

        // ONLY PATCH AFTER DATA IS READY
      if (this.appointmentData) {
        this.patchAppointmentData();
        // this.onTaskChange(this.appointmentData.taskId);

        setTimeout(() => {
          this.onTaskChange(this.appointmentData.taskId);
        });
      }
    });
  }

//load appointed data into the form fields
  patchAppointmentData(): void{
    if (!this.appointmentData) return;

    const appointmentDate = this.convertArrayToDate(this.appointmentData.date);
    const appointmentTime =
      this.convertArrayToTime(this.appointmentData.time);

    this.selectedDate = appointmentDate;
    this.selectedTime = this.normalizeTime(appointmentTime);
    this.originalSelectedTime = this.selectedTime;
    this.selectedTime = this.originalSelectedTime;

    this.appointmentServiceForm.patchValue({

      date: appointmentDate,
      time: appointmentTime,

      vehicleType: this.appointmentData.vehicleType,
      licencePlate: this.appointmentData.licencePlate,

      serviceType: this.appointmentData.serviceType,
      totalServicePrice: this.appointmentData.totalServicePrice,

      customerName: this.appointmentData.customerName,
      email: this.appointmentData.email,
      contactNumber: this.appointmentData.contactNumber,

      taskId: Number(this.appointmentData.taskId),
      // taskName: this.appointmentData.taskId, // important for dropdown
      additionalServices: this.appointmentData.additionalServices
      
    });
    // load task details card
    this.onTaskChange(this.appointmentData.taskId);
    console.log('selectedTime after patch =', this.selectedTime);

    console.log("taskId:", this.taskId);
    console.log("form taskId:", this.appointmentServiceForm.get('taskId')?.value);
    console.log("isEditMode:", this.isEditMode);

    this.onDateChange({
      value: appointmentDate
    } as MatDatepickerInputEvent<Date>);
  }

//load selected additional servicers to appointment form when click edit button
  loadSelectedAdditionalServices(): void {
    if (!this.appointmentData?.additionalServices) {
      return;
    }

    const selectedNames = this.appointmentData.additionalServices
                              .split(',')
                              .map((item:string) => item.trim());
    
    this.selectedOptions = this.additionalServices.filter(service => 
      selectedNames.includes(service.additionalServicesName));
      
    this.additionalServiceCost =
    this.selectedOptions.reduce(
      (sum, item) => sum + item.additionalServicePrice,
      0
    );
  }
//disable appointed time selected time row select button
  isOriginalRow(slotTime: string): boolean {
    return this.normalizeTime(slotTime) === this.originalSelectedTime;
  }

// <!--Functions for Dropdown with Custom Input Enabled -->

  filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.vehicleTypes.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }

  filterPlate(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.vehicleList.filter(option =>
      option.licencePlate.toLowerCase().includes(filterValue)
    );
  }

  onOptionSelected(event: any) {
    const value = event.option.value;
    this.appointmentServiceForm.get('vehicleType')?.setValue(value);
  }

  onPlateOptionSelected(licencePlate: string) {
    // const value = event.option.value;
    this.appointmentServiceForm.get('licencePlate')?.setValue(licencePlate);
    //auto load vehicle type when select license plate
    this.onVehicleSelect(licencePlate);
  }

  // Add new value if not exists
  addIfNotExists() {
    const value = this.appointmentServiceForm.get('vehicleType')?.value?.trim();

    if (value && !this.vehicleTypes.includes(value)) {
      this.vehicleTypes.push(value);
      this.filteredVehicleTypes = this.vehicleTypes;
    }
  }

  addPlateIfNotExists() {
    const value = this.appointmentServiceForm.get('licencePlate')?.value?.trim();

    if (value && !this.vehicleList.some(vehicle => vehicle.licencePlate.toLowerCase() == value.toLowerCase())) {

      const newItem = {
        licencePlate: value
      };

      this.vehicleList.push(newItem);
      this.filteredVehicleList = this.vehicleList;
    }
  }

// showAllPlates() {
//   this.filteredVehicleList = this.vehicleList;
// }

//load logged customer data
  loadUserProfile(): void {
    this.appointmentService.getLoggedInUserDetails().subscribe({
      next: (user: any) => {
        setTimeout(() =>{
          this.appointmentServiceForm.patchValue({
            id: user.id,
            customerName: `${user.firstName} ${user.lastName}`,
            email: user.email,
            contactNumber: user.contactNumber
          });
        });
        // console.log("User Loaded:", user);
        // console.log("loadUserProfile");
        // console.log("Form Name:", this.appointmentServiceForm.get('customerName')?.value);
        // console.log("Form Email:", this.appointmentServiceForm.get('email')?.value);
        // console.log("Form PN:", this.appointmentServiceForm.get('contactNumber')?.value);
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
      this.filteredVehicleList = this.vehicleList;
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

  onPhoneChange(contactNumber: string) {
    if (!contactNumber || contactNumber === 'null') {
      console.warn("Phone number is empty");
      return;
    }

    console.log("Searching customer by phone:", contactNumber);

    this.appointmentService.getCustomerByPhone(contactNumber).subscribe({
      next: (res: any) => {
        console.log("Customer Response:", res);

        // Patch correct fields
        this.appointmentServiceForm.patchValue({
          customerName: `${res.firstName} ${res.lastName}`,   
          email: res.email,
          contactNumber: res.contactNumber     
        }, { emitEvent: false }); //prevent triggering

        // Load vehicles using customer ID
        this.loadVehicles(res.id);
        // this.vehicleList = res.vehicles || [];
      },

      error: (err) => {
        console.error("Customer not found:", err);

        // Optional UX improvement
        this.messageService.showError("Customer not found for this phone number");

        // Clear fields if not found
        this.appointmentServiceForm.patchValue({
          customerName: '',
          email: ''
        });

        this.vehicleList = [];
      }
    });
  }


  formatDateLocal(date: Date): string {
    return date.getFullYear() + '-' +
          String(date.getMonth() + 1).padStart(2, '0') + '-' +
          String(date.getDate()).padStart(2, '0');
  }

  // Handle date change from <mat-datepicker>
  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    const date = event.value;

    if (!this.isEditMode) {
      this.selectedTime = null;
    }
    this.timeSlots = [];
    this.dataSource.data = [];  

    if (date) {
      this.selectedDate = date;
      // const selectedDateStr = date.toISOString().split('T')[0];
      const iso = this.formatDateLocal(date);
      console.log('selectedTime before clear =', this.selectedTime);
      // console.log('Raw selected date:', date);
      // console.log('Local date string:', date?.toDateString());
      // console.log('UTC string:', date?.toUTCString());
      // console.log('toISOString:', date?.toISOString());

      this.isLoading = true;
      this.appointmentService.getAvailableSlots(iso).subscribe({
        next: (slots) => {
          this.timeSlots = slots;
          this.dataSource.data = slots;

          if (this.isEditMode && this.originalSelectedTime) {
            this.selectedTime = this.originalSelectedTime;
          }
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
      if (!time) return '';
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
    return '';
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
          this.isSelectButtonDisable = true;
          this.isConfirmButtonDisable = true;
        }
      });
  }

  // Book the selected appointment
  submitAppointment(): void {
    console.log('In the Service → save appointment-> ts file');
    if (!this.selectedDate || !this.selectedTime) return;
    const taskId = this.appointmentServiceForm.get('taskId')?.value;
    if (!taskId) {
      this.messageService.showError("Task is required. Please select a task again.");
      return;
    }
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
      taskId: taskId,
      role: roleToSave,
      login: login,

    };

    const payload = this.processObjects(booking);

    // console.log("BOOKING OBJECT:", booking);
    // console.log("FINAL PAYLOAD:", payload);
    if (this.isEditMode) {
      this.appointmentService.updateAppointment(this.appointmentData.id, payload)
      .subscribe({
        next: (res) => {
          this.appointmentServiceForm.disable();
          this.savedTime = this.selectedTime;
          this.messageService.showSuccess("Appointment update Successfully");
          this.onDateChange({value: this.selectedDate} as any)
        },error: (error) =>{
          this.messageService.showError("Update Failed. Try Again...!")
        }
      })
    } else{
        this.appointmentService.bookAppointment(payload).subscribe({
        next: (resp) => {
          const updatedSlot = this.timeSlots.find(slot => slot.time === this.selectedTime);
          if (updatedSlot) {
            updatedSlot.bookedCount += 1;
            this.dataSource.data = [...this.timeSlots];
          }
          this.savedTime = this.selectedTime;
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
  
    if (this.isEditMode) {
    // Go back to all appointments page when editing
      this.router.navigate(['/appointment/all-appointments']);
      return;
    }

    if (this.taskId >= 1) {
      this.router.navigate(['/dashboard/task-detail', this.taskId]);
    }
  }

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
      this.additionalServiceCost  = this.additionalServiceCost  + service.additionalServicePrice;
    } else {
      this.selectedOptions = this.selectedOptions.filter(item => item.id !== service.id);
      this.additionalServiceCost  = this.additionalServiceCost  - service.additionalServicePrice;
    }

    this.totalCost =
      this.currentTaskPrice +
      this.additionalServiceCost;

    this.appointmentServiceForm.patchValue({
      totalServicePrice: this.totalCost
    });


    this.selectedServices = this.selectedOptions
    .map(s => s.additionalServicesName)
    .join(',');
  }


}
