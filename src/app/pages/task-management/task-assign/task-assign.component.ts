import { Component, input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from 'src/app/services/http.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { RegistrationService } from 'src/app/services/registration/registration.service';
import { TaskAssignService } from 'src/app/services/task-management/task-assign.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { AdditionalServicesService } from 'src/app/services/task-management/additional-services.service';
import { AttendanceMarkService } from 'src/app/services/attendance/attendance-mark.service';

interface Task {
  id: any;
  taskName: string;
  definedSubTaskDtos: any;
}
interface Customer {
  value: string;
  viewValue: string;
  id: number;
}

interface Employee {
  id: number;
  name: string;
}

interface Appointment {
  appointmentUniqueNo: string;
}

export interface TaskAssign {
    id:number;
    appointmentId:number;
    appointmentUniqueNo:string;
    customerName:string;
    taskName:string;
    serviceType:string;
    status:string;
    billCreated:boolean;
}

@Component({
  selector: 'app-task-assign',
  standalone: false,
  templateUrl: './task-assign.component.html',
  styleUrl: './task-assign.component.scss',
})
export class TaskAssignComponent implements OnInit {
  taskAssignForm: FormGroup;

  displayedColumns: string[] = ['uniqueTaskNo', 'taskName', 'date','time', 'customerName', 'action'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  mode = 'add';
  saveButtonLabel = 'Save';
  selectData: any;
  isButtonDisable = false;

  selectedSubtasks: any[] = [];

  selectedOptions: any[] = [];
  selectedServices: string = "";
  additionalServices: any[] = []; 

  // users = [
  //   { id: 1, name: 'Alice' },
  //   { id: 2, name: 'Bob' },
  //   { id: 3, name: 'Charlie' },
  // ];

  // filteredUsers = this.users;
  // filteredUsersList: { id: number; name: string }[][] = [];
  filterControls: FormControl[] = [];
  employees: Employee[] = [];
  showEmailField = false;
  superVisorList: Employee[] = [];
  technicianList: Employee[] = [];
  driverList: Employee[] = [];
  allEmployees: any[] = [];
  attendanceList: any[] = [];
  isInitializing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private taskAssignService: TaskAssignService,
    private messageService: MessageServiceService,
    private httpService: HttpService,
    private registrationService: RegistrationService,
    private notificationService: NotificationService,
    private _dialog: MatDialog,
    private additionalServicesService: AdditionalServicesService,
    private attendanceMarkService: AttendanceMarkService,
  ) {
    this.taskAssignForm = this.fb.group({
      date: new FormControl(''),
      time: new FormControl(''),
      appointmentUniqueNo: new FormControl(''),
      taskName: new FormControl(''),
      serviceType: new FormControl(''),
      taskCreatedBy: new FormControl({ value: '', disabled: true }), //
      customerName: new FormControl(''),
      customerId: new FormControl(''),
      licencePlate: new FormControl(''),
      vehicleType: new FormControl(''),
      email: new FormControl(''),
      description: new FormControl(''),
      supervisor: new FormControl(''),
      status: new FormControl({ value: 'Start', disabled: true }), //
      subTasks: this.fb.array([]),
      additionalServices: new FormControl({ value: '', disabled: true })
    });
  }

  tasks: Task[] = [];
  appointments: Appointment[] = [];

  customers: any = [];

  appointmentUniqueNumbers: any = [];

  selectedCustomers: any = [];

  timeSlots: string[] = [];

  // : Customer[] = [
  //   { value: 'Ruwan', viewValue: 'Ruwan', id: 1 },
  //   { value: 'Kamal', viewValue: 'Kamal', id: 2 },
  //   { value: 'Amal', viewValue: 'Amal', id: 3 },
  //   { value: 'Doty', viewValue: 'Doty', id: 4 },
  // ];

  formatDateLocal(date: Date): string {  //year-month-day(2026-05-06)
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  formatTime(hours: number, minutes: number): string {
    const ampm = hours >= 12 ? 'PM' : 'AM';   // decides AM or PM

    const h = hours % 12 || 12;               // converts 24h → 12h format
    const m = minutes.toString().padStart(2, '0');

    return `${h.toString().padStart(2, '0')}:${m} ${ampm}`;

    
  }

  formatDateFromArray(dateArray: number[]): string {
    if(!dateArray) return '';
    const [year, month, day] = dateArray;
    return  `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  formatTimeFromArray(time: number[]): string {
    if (!time) return '' ;

    let [hours, minutes] = time;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    const m = minutes.toString().padStart(2, '0');

    return `${h.toString().padStart(2, '0')}:${m} ${ampm}`;
  }

  convertTo24Hour(time: string): string {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    const hh = hours.toString().padStart(2, '0');
    const mm = minutes.toString().padStart(2, '0');


    return `${hh}:${mm}:00`;
  }

  onDateChange(date: Date) {
    this.generateTimeSlots(date);
  }

  generateTimeSlots(selectedDate:Date){
    this.timeSlots =  [];

    const day = selectedDate.getDay();

    let start: number;
    let end: number;

    if (day === 0) {
      //sunday has no slot
      return;
    }else if (day === 6) {
      //Saturday
      start = 9 * 60; //9.00
      end = 15 * 60; //3.00   
    } else {
      //Mon-fri
      start = 9 * 60; //9.00
      end = 17 * 60; //5.00
    }

    while (start <= end){
      //skip 1:00 PM
      if (start === 13 * 60) {
        start += 60;
        continue;
      }

      const hours = Math.floor(start / 60);
      const minutes = start % 60;

      this.timeSlots.push(this.formatTime(hours, minutes));

      start += 60;
    }
  }

  onDateAndTimeChange(){
    const date = this.taskAssignForm.get('date')?.value;
    const time = this.taskAssignForm.get('time')?.value;
    const currentNo = this.taskAssignForm.get('appointmentUniqueNo')?.value;

    console.log("Selected Date:", date);
    console.log("Selected Time:", time);

    if (!date || !time) {
      return; // wait until both selected
    }

    if (this.mode === 'edit' && !currentNo) return;

    const formattedDate = this.formatDateLocal(date);
    const formattedTime = this.convertTo24Hour(time);

    console.log("Formatted Time:", formattedTime);


    this.taskAssignService.getAppointmentsByDateAndTime(formattedDate,formattedTime)
        .subscribe({
          next: (response: Appointment[]) => {
          
            this.appointments = response;

            console.log("Appointments:", response);
          },
          error: (err) => {
            console.log("No appointments found");
            this.appointments = [];
          }
    });
  }

  onAppointmentSelect(appointmentUniqueNo: string){
    this.taskAssignService.getDetailsByAppointmentNo(appointmentUniqueNo)
      .subscribe((res:any)=>{
        console.log("Appointment Details:", res);


        const customer = this.customers.find(
          (c: any) => 
            `${c.firstName} ${c.lastName}` === res.customerName
        );

        this.taskAssignForm.patchValue({
          taskName: res.taskName,
          serviceType: res.serviceType,
          customerName: res.customerName,
          customerId: customer ? customer.id : null,
          licencePlate: res.licencePlate,
          vehicleType: res.vehicleType,
          // additionalServices: res.additionalServices
        });

        this.addAdditioanlServicesToSubTasks(res.additionalServices);
        this.addServiceTypeToSubTasks(res.serviceType);

        const selectedServiceNames = (res.additionalServices || '')
        .split(',')                      //"Oil Change,Engine Wash,Filter Change"  ---> ["Oil Change","Engine Wash","Filter Change"]
        .map((s: string) => s.trim());   //Removes extra spaces from each item.

        this.selectedOptions = this.additionalServices.filter(service =>
          selectedServiceNames.includes(service.additionalServicesName)
        );
      });
  }

  ngOnInit(): void {
    this.populateAttendanceData();
    this.populateData();
    this.getDefinedTasks();
    this.setCreatedByValue();
    this.loadCustomerList();

    // 1. FIRST load attendance from localStorage
   /* const storedAttendance = localStorage.getItem('todayAttendance');

    if (storedAttendance) {
      this.attendanceList = JSON.parse(storedAttendance);
    } else {
      this.attendanceList = [];
    }*/

    // 2. THEN load employees (so filtering works correctly)
    // this.setEmployeeList();

    if (!this.attendanceList.length) {
      console.warn("No attendance found for today");
    }

    this.taskAssignForm
      .get('taskName')
      ?.valueChanges.subscribe((selectedTask) => {
        this.updateSubtasks(selectedTask);
      });

      this.taskAssignForm.get('time')?.valueChanges.subscribe(() => {
        if(this.isInitializing) return;
        this.onDateAndTimeChange();
      });

      this.taskAssignForm.get('date')?.valueChanges.subscribe((date) => {
        if(this.isInitializing) return;
        if (date) {
          this.generateTimeSlots(date);
        }
      });

      this.taskAssignForm.patchValue({
        date: new Date() //show today date
      });
      this.loadAdditionalServices();

    // this.filteredUsers = this.users;
  }

  loadAdditionalServices() {
    this.additionalServicesService.getData().subscribe((resopnse:any)=>{
        console.log("Available services:", this.additionalServices);
      this.additionalServices = resopnse.filter(
        (service:any) => service.status === "Yes"
      );
    })
  }

  loadSavedSubTasks(subTasks: any[]) {

    const subTasksArray = this.subTasks;

    // clear existing subtasks
    subTasksArray.clear();

    // add saved subtasks
    subTasks.forEach((subTask: any) => {

      subTasksArray.push(
        this.fb.group({
          id: [subTask.id],
          description: [
            { value: subTask.description, disabled: true }
          ],
          assignedUserId: [
            subTask.assignedUserId
          ],
          assignUserName: [
            subTask.assignUserName
          ]
        })
      );

    });

  }

  disableAssignToField() {

  const subTaskArray = this.taskAssignForm.get('subTasks') as FormArray;

  subTaskArray.controls.forEach((subTaskGroup: any) => {

    subTaskGroup.get('assignedUserId')?.disable();
    subTaskGroup.get('assignUserName')?.disable();

  });

}

  onSubmit() {
    try {
      let formData = this.taskAssignForm.getRawValue();

      if(formData.time) {
        formData.time = this.convertTo24Hour(formData.time);
      }

      if (formData.date instanceof Date) {
        formData.date = this.formatDateLocal(formData.date);
      }
      formData.status = 'Start';

      console.log("Final Payload:", formData);

      if (this.mode === 'add') {
        this.taskAssignService.serviceCall(formData).subscribe(
          (response: any) => {
            console.log("Saved Response:", response);
            console.log(response.subTasks);
            if(response.subTasks && response.subTasks.length > 0){
                this.loadSavedSubTasks(response.subTasks);
            }

            if (
              this.dataSource &&
              this.dataSource.data &&
              this.dataSource.data.length > 0
            ) {
              this.dataSource = new MatTableDataSource([
                response,
                ...this.dataSource.data,
              ]);
            } 
            // else{
            //     this.dataSource = new MatTableDataSource([response]);
            // }
            // this.dataSource.paginator = this.paginator;
            // this.dataSource.sort = this.sort;
             this.dataSource = new MatTableDataSource([response]);
             this.disableAssignToField();
            this.messageService.showSuccess('Data Saved Successfully !');
          },
          (error) => {
            this.messageService.showError('Action Failed with Error :' + error);
          }
        );
      } else if (this.mode === 'edit') {

        console.log("Edit Payload:", formData);
        this.taskAssignService
          .editData(this.selectData.id, formData)
          .subscribe({
            next: (response: any) => {
              let elementIndex = this.dataSource.data.findIndex(
                (element) => element.id === this.selectData?.id
              );

              response.date = response.date;
              response.time = response.time;

              this.dataSource.data[elementIndex] = response;
              this.dataSource = new MatTableDataSource(this.dataSource.data);
              this.messageService.showSuccess('Data Edited Successfully !');
            },
            error: (error) => {
              this.messageService.showError(
                'Action Failed with Error :' + error
              );
            },
          });
      }
    } catch (error) {
      this.messageService.showError('Action Failed with Error:' + error);
    }
    this.isButtonDisable = true;
    this.taskAssignForm.disable();
    console.log(this.subTasks.value);
    
  }
  
  //auto load selected additional services in to the sub task array form
  private addAdditioanlServicesToSubTasks(additionalServices: string): void {
    if(!additionalServices) {
      return;
    }
    const services = additionalServices
                          .split(',')
                          .map(service => service.trim());

    services.forEach(service => {

      //Avoid Duplicates
      const exists = this.subTasks.controls.some(control =>
        control.get('description')?.value === service
      );

      if(!exists) {
        this.subTasks.push(
          this.fb.group({
            description: [{value: service, disabled: true}],
            assignedUserId: [''],
            assignUserName: ['']
          })
        );
      }
    });
  }

  //add Drive Vehicle field in to the subtask array form when select the pick-up/drop-off and remote service
  private addServiceTypeToSubTasks(serviceType: string) {
    if(serviceType === 'Pick-up/ Drop-off Service' ||
       serviceType === 'Remote Service'
    ) {
      const exists = this.subTasks.controls.some(control =>
        control.get('description')?.value === 'Drive Vehicle'
      );

      if(!exists) {
        this.subTasks.insert(0,
          this.fb.group({
          description: [{value: 'Drive Vehicle', disabled: true }],
          assignedUserId: [''],
          assignUserName: ['']
        })
      );
      }
    }
  }

  public setCreatedByValue(): void {
    this.taskAssignForm.patchValue({
      taskCreatedBy: this.httpService.getLoginNameFromCache(),
    });
  }

  public loadCustomerList(): void {
    this.taskAssignService.getCustomersList().subscribe((response: any) => {
      if (response) {
        this.customers = response;
        this.addCommonCustomer();
      }
    });
  }

  public addCommonCustomer(): void {
    const commonCustomer = {
      id: 0,
      firstName: 'Common',
      lastName: 'Customer',
    };

    this.customers.unshift(commonCustomer);

    this.selectedCustomers = this.customers;
  }

  updateSubtasks(selectedTask: string) {
    if (this.mode === 'add') {
      const task = this.tasks.find((t) => t.taskName === selectedTask);
      // this.selectedSubtasks = task ? task.taskName : [];
      if (task) this.selectedSubtasks = task.definedSubTaskDtos;

      const subTasksFormArray = this.subTasks;

      while (subTasksFormArray.length !== 0) {
        subTasksFormArray.removeAt(0);
      }

      this.selectedSubtasks.forEach((item) => {
        subTasksFormArray.push(this.createSubTasksFormGroup(item));
      });
    }
  }

  public createSubTasksFormGroup(item: any): FormGroup {
    return this.fb.group({
      description: { disabled: true, value: item.subTaskName },
      assignedUserId: '',
      assignUserName: ''
    });
  }

  get subTasks() {
    return this.taskAssignForm.get('subTasks') as FormArray;
  }

  addSubTask() {
    this.subTasks.push(
      this.fb.group({
        id: [null],
        description: [''],
        assignedUserId: [''],
        assignUserName: ['']
      })
    );
  }

  removeSubTask(index: number) {
    this.subTasks.removeAt(index);
  }

  public populateData(): void {
    this.taskAssignService.getData().subscribe((response: any) => {
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  public getDefinedTasks(): void {
    this.taskAssignService.getDefinedTasks().subscribe((response: any) => {
      if (response) {
        this.tasks = response;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public editData(data: any) {
    console.log("Edit Data:", data);
    this.resetData();
    this.mode = 'edit';

    console.log("data.additionalServices =", data.additionalServices);
    console.log("additionalServices list =", this.additionalServices);

    this.isInitializing = true

    // Convert date array → Date object
    let formattedDate = null;
    if (data.date) {
      const [year, month, day] = data.date;
      formattedDate = new Date(year, month - 1, day);
    }

    // Convert time array → "04:00 PM"
    let formattedTime = '';
    if (data.time) {
      const [hours, minutes] = data.time;
      formattedTime = this.formatTime(hours, minutes);
    }

    const customer = this.customers.find(
      (c: any) => `${c.firstName} ${c.lastName}` === data.customerName
    );

    this.taskAssignForm.patchValue({
      ...data,
      customerId: customer ? customer.id : null,
      date: formattedDate,
      time: formattedTime,
      appointmentUniqueNo: data.appointmentUniqueNo
    },
      {emitEvent: false }//stop valuechanges here
    );

    // Load Additional Services
    this.additionalServicesService.getData().subscribe((response: any) => {

      this.additionalServices = response.filter(
        (service: any) => service.status === "Yes"
      );


      // Get additional services from subTasks
      const additionalServiceNames = data.subTasks.map(
        (subTask: any) => subTask.description
      );


      this.selectedOptions = this.additionalServices.filter(
        (service: any) =>
          additionalServiceNames.includes(service.additionalServicesName)
      );


      console.log("Additional Service Names:", additionalServiceNames);
      console.log("Selected Services:", this.selectedOptions);

    });
    this.taskAssignForm.enable();
    this.taskAssignForm.get('taskCreatedBy')?.disable();
    this.taskAssignForm.get('status')?.disable();
    this.taskAssignForm.get('appointmentUniqueNo')?.disable();

    // Load time slots for selected date
    if (formattedDate) {
      this.generateTimeSlots(formattedDate);
    }

    // Load appointments for selected date & time
    if (formattedDate && formattedTime && data.appointmentUniqueNo) {
      const formattedDateStr = this.formatDateLocal(formattedDate);
      const formattedTimeStr = this.convertTo24Hour(formattedTime);

      this.taskAssignService
        .getAppointmentsByDateAndTime(formattedDateStr, formattedTimeStr, data.appointmentUniqueNo)
        .subscribe((res: Appointment[]) => {
          this.appointments = res;

        //   // Set appointment after loading options
        //   this.taskAssignForm.patchValue({
        //     appointmentUniqueNo: data.appointmentUniqueNo
        //   });
        });
    }

    // Allow events again AFTER everything
    setTimeout(() => {
      this.isInitializing = false;
    }, 0);

    //load subtasks
    data.subTasks.forEach((subTask: any) => {
      this.subTasks.push(
        this.fb.group({
          id: [subTask.id],
          description: [{value: subTask.description, disabled: true}],
          assignedUserId: [subTask.assignedUserId],
          assignUserName: [subTask.assignUserName]
        })
      );
    });

    this.setEmployeeList();

    this.selectData = data;
    this.saveButtonLabel = 'Edit';
  }

  public confirmDelete(data: any): void {
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
          data: 'Are you sure you want to delete this record?',
        });
    
        dialogRef.afterClosed().subscribe((result: any) => {
          if (result) {
            this.deleteData(data);
          }
        });
    }

  public deleteData(data: any) {
    const taskId = data.id;
    try {
      this.taskAssignService.deleteData(taskId).subscribe({
        next: (response: any) => {
          const index = this.dataSource.data.findIndex(
            (element) => element.taskId === taskId
          );
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
          }
          this.dataSource = new MatTableDataSource(this.dataSource.data);
          this.messageService.showSuccess('Data Deleted Successfully !');
          this.refreshData();
        },
        error: (error) => {
          this.messageService.showError('Action Failed with Error :' + error);
        },
      });
    } catch (error) {
      this.messageService.showError('Action Failed with Error:' + error);
    }
  }

  public resetData() {
    this.taskAssignForm.reset();
    this.taskAssignForm.enable();
    // Clear selected additional services
    this.selectedOptions = [];
    const subTasksFormArray = this.subTasks;
    subTasksFormArray.clear();
    this.resetFormManually();
    this.taskAssignForm.get('taskCreatedBy')?.disable();
    this.taskAssignForm.get('status')?.disable();
    this.saveButtonLabel = 'Save';
    this.isButtonDisable = false;
    this.enableFormManually();
    this.setCreatedByValue();
    this.taskAssignForm.patchValue({status: 'Start'});

    while (subTasksFormArray.length !== 0) {
        subTasksFormArray.removeAt(0);
    }

    this.taskAssignForm.patchValue({
        date: new Date() //show today date
      });
  }

  public refreshData(): void {
    this.populateData();
    // this.addNotification();
  }

  public resetFormManually() {
    this.taskAssignForm.get('taskName')?.reset({}, { emitEvent: false });
    this.taskAssignForm.get('customerId')?.reset();
  }

  public enableFormManually() {
    this.taskAssignForm.get('taskName')?.enable({ emitEvent: false });
    this.taskAssignForm.get('customerId')?.enable();
  }

  public onCustomerChange(inputId: any) {
    const customerId = inputId.value;

    const customer = this.customers.find(
      (c: any) => c.id === customerId
    );

    if (!customer) {
      return;
    }

    this.showEmailField = inputId.value === 0;
    const customerName = this.customers.find(
      (customer: any) => customer.id === inputId.value
    ).firstName;

    this.taskAssignForm.patchValue({
      customerName,
    });

    this.taskAssignService               //Auto load licence_plate and vehicle_type when select customer_name
    .getVehicleDetails(customerId)
    .subscribe(vehicle => {

      if (vehicle) {
        this.taskAssignForm.patchValue({
          licencePlate: vehicle.licencePlate,
          vehicleType: vehicle.vehicleType
        });
      }
    });
  }

  public onAsigneeChange(inputId: any, index: number) {
    const empId = inputId.value;

    const emp = this.employees.find((employeeItem: Employee) => {
      return employeeItem.id == empId;
    });

    const empName = emp?.name;

    const itemGroup = this.subTasks.at(index) as FormGroup;
    itemGroup.get('assignUserName')?.patchValue(empName);
  }

  onTaskFilterKeyPress(eventTarget: any) {
    this.tasks = this.searchTasks(eventTarget.value);
  }

  searchTasks(value: String) {
    let filter = value.toLowerCase();
    return this.tasks.filter((option: any) =>
      option.taskName.toLowerCase().includes(filter)
    );
  }

  // onSubTaskFilterKeyPress(eventTarget: any) {
  //   this.filteredUsers = this.searchSubTasksUser(eventTarget.value);
  // }

  // searchSubTasksUser(value: String) {
  //   let filter = value.toLowerCase();
  //   return this.users.filter((option: any) =>
  //     option.name.toLowerCase().includes(filter)
  //   );
  // }

  onCustomerFilterKeyPress(eventTarget: any) {
    this.selectedCustomers = this.search(eventTarget.value);
  }

  search(value: string) {
    let filter = value.toLowerCase();
    return this.customers.filter(
      (option: any) =>
        option.firstName.toLowerCase().startsWith(filter) ||
        option.lastName.toLowerCase().startsWith(filter) ||
        option.id.toString().toLowerCase().startsWith(filter)
    );

    // const filteredCustomers = this.customers.filter((option: any) =>
    //   option.firstName.toLowerCase().startsWith(filter) ||
    //   option.lastName.toLowerCase().startsWith(filter) ||
    //   option.id.toString().toLowerCase().startsWith(filter)
    // );

    // const filteredTasks = this.tasks.filter((task: any) =>
    //   task.taskName.toLowerCase().includes(filter)
    //   // option.id.toString().toLowerCase().includes(filter)
    // );

    // return {
    //   customers: filteredCustomers,
    //   tasks: filteredTasks
    // };
  }

  //filter Active employees to supervisor, driver and technician assign to fields
  filterEmployeesByAttendance() {
    this.superVisorList = [];
    this.technicianList = [];
    this.driverList = [];

    if(!this.attendanceList?.length || this.attendanceList.length === 0){
      console.warn("No attendance found");
      return;
    }

    const presentEmployees = this.attendanceList.filter(
      (att:any) => att.attendanceStatus === 'PRESENT'
    );

    presentEmployees.forEach((att: any) => {

      const emp = this.allEmployees.find(
        (e: any) =>
          e.id == att.employeeId
      );

      if (!emp) {
      console.warn("Employee not found:", att.employeeId);
      return;
    }

    const status = (emp.empStatus || '').toLowerCase();
    const position = (emp.position || '').toLowerCase();

      const employeeData = {
        id: emp.id,
        name: emp.name,
      };

      if (emp.empStatus === 'Active' && emp.position === 'Supervisor') {
        this.superVisorList.push(employeeData);
      }

      if (emp.empStatus === 'Active' && emp.position === 'Technician') {
        this.technicianList.push(employeeData);
      }

      if (emp.empStatus === 'Active' && emp.position === 'Driver') {
        this.driverList.push(employeeData);
      }
    });

    
  console.log("Supervisor List:", this.superVisorList);
  console.log("Technician List:", this.technicianList);
  }

  //get assign-to field to driver or technician
  getEmployeeForSubTasks(index: number): Employee[] {
    const description = this.subTasks.at(index).get('description')?.value;
    if(description === 'Drive Vehicle') {
      return this.driverList;
    }
    return this.technicianList;
  } 

  public setEmployeeList(): void {
    // let employeeList: Employee[] = [];
    this.registrationService.getEmployeeList().subscribe((response: any) => {
      if (response && response.length > 0) {

        this.allEmployees = response;


        this.filterEmployeesByAttendance();
        // response.forEach((employee: any) => {
        //   const employeeData = {
        //     id: employee.id,
        //     name: employee.name,
        //   };

        //   employeeList.push(employeeData);
        //   // console.log('Position:', employee.position);
        //   // console.log('Employee Status:', employee.employeeStatus);

        //   if ( employee.empStatus === 'Active' && employee.position === 'Supervisor' ) {//load supervisor dropdown to employee_status = Active and job_title = Supervisors
        //     this.superVisorList.push(employeeData);
        //   }
        //   if (employee.position === 'Technician' && employee.empStatus === 'Active') {
        //     this.technicianList.push(employeeData);
        //   }
        // });
      }
    });

    

    //console.log(employeeList);
    // this.employees = employeeList;
    // this.users = employeeList;
    // this.filteredUsers = employeeList;
    // this.superVisorList = employeeList.filter((emp: any) => {})
    // this.technicianList = employeeList.filter((emp: any) => {})
  }

  public onAdditionalServiceChange(service: any, event: MatCheckboxChange): void {
      if (event.checked) {
        this.selectedOptions.push(service);
      } else {
        this.selectedOptions = this.selectedOptions.filter(item => item.id !== service.id);
      }
  
      this.selectedServices = this.selectedOptions
      .map(s => s.additionalServicesName)
      .join(',');
  }


  

  // public addNotification(details?: any): void {
  //   this.notificationService.addNotification(
  //     'Employee Added Successfully',
  //     'success',
  //      71,
  //     'd.mendisat@gmail.com'
  //   );
  // }


    // Load Active Employees
  public populateAttendanceData(): void {

    const today = new Date().toISOString().split('T')[0];//

    // check in data base if attendances are already marked
    this.attendanceMarkService.getAttendanceByDate(today).subscribe({
      next: (response: any[]) => {
        if (response && response.length > 0) {
          this.attendanceList = response;
          localStorage.setItem('todayAttendance', JSON.stringify(this.attendanceList));
        } else {
          this.setAttendanceData();
          return;
        }
        this.setEmployeeList();
      },
      error: () => {
        this.setAttendanceData();
        this.setEmployeeList();
      }    
    });
  }

  public setAttendanceData(): void {
    this.attendanceMarkService.getAllActiveEmployees()
      .subscribe((response: any) => {

        const today= new Date().toISOString().split('T')[0];

        this.attendanceList = response.map((emp: any)=> ({
          employeeId: emp.id,
          uniqueEmpNo: emp.uniqueEmpNo,
          employeeName: emp.name,
          date: today,
          attendanceStatus: 'PRESENT'   //default value
    }));

    localStorage.setItem('todayAttendance', JSON.stringify(this.attendanceList));
    });
  }
}
