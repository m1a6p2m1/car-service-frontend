import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppointmentService } from 'src/app/services/appointment.service';
import { FormDemoServiceService } from 'src/app/services/form-demo/form-demo-service.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { RegistrationService } from 'src/app/services/registration/registration.service';

interface Employee {
  id: number;
  name: string;
}

interface UpdatedDataI {
  id: any,
  assignee: any,
  assigneeName?: string
}

@Component({
  selector: 'app-appointment-list',
  standalone: false,
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.scss'
})
export class AppointmentListComponent implements OnInit {

  
    demoForm: FormGroup;
  
    displayedColumns: string[] = ['customerName', 'appointmentDate', 'appointmentTime','serviceType', 'email', 'phoneNumber', 'totalServicePrice', 'assignee','action'];
    dataSource!: MatTableDataSource<any>;
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    employeeOptions: any;
  superVisorList: Employee[] = [];
  updatedDataList: UpdatedDataI[] = [];

  constructor(
      private fb: FormBuilder , 
      private appointmentService: AppointmentService,
      private messageService: MessageServiceService,
    private registrationService: RegistrationService) {
    this.demoForm = this.fb.group({
          firstName: new FormControl('', [Validators.required]),//
          lastName: new FormControl('', [Validators.minLength(3), Validators.maxLength(8)]),
          age: new FormControl('', [Validators.min(1), Validators.max(120)]),
          email: new FormControl('', [Validators.email])
        });
  }

  ngOnInit(): void{
    // console.log('oninit')
    this.populateData();
    this.setEmployeeList();
  }

  //table data filtering
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  public refreshData(): void{
    this.populateData();
  }

    public populateData(): void{
      try {
        this.appointmentService.getAppointments().subscribe((response:any)=>{
          console.log('get data response: ', response);
    
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        (error)=>{
          this.messageService.showError('Action Failed with Error :'+ error);
        }
        );
      } catch (error) {
        this.messageService.showError('Action Failed with Error :'+ error);
      }
      
    }

  public setEmployeeList(): void {
    let employeeList: Employee[] = [];
    this.registrationService.getEmployeeList().subscribe((response: any) => {
      if (response && response.length > 0) {
        response.forEach((employee: any) => {
          const employeeData = {
            id: employee.id,
            name: employee.name,
          };

          employeeList.push(employeeData);
          if (employee.position === 'Supervisor') {
            this.superVisorList.push(employeeData);
          }
        });
      }
    });
  }

    updateStatus(id: any, data: any) {
          const name = this.superVisorList.find((supervisor: any) => supervisor.id === data)?.name;
          const updatedData = {id: id, assignee: data, assigneeName: name};
          this.updatedDataList.push(updatedData);
    }

    updateAssignee(element: any) {
          const updatedData: UpdatedDataI | undefined = this.updatedDataList.find(item => item.id == element.id);
          if (updatedData) {
            this.appointmentService.changeAssignee(updatedData).subscribe({
              next: (response: any) => {
                this.messageService.showSuccess("Sub Task status successfully updated!");
              },
              error: (error: any) => {
                this.messageService.showError("Error Occurred. Please try again!");
              }
            })
          }
    }

    formatTime(timeArray: number[]): string {
      const [hours, minutes] = timeArray;
  return `${this.pad(hours)}:${this.pad(minutes)}`;
    }

    pad(num: number): string {
  return num < 10 ? '0' + num : num.toString();
}

}
