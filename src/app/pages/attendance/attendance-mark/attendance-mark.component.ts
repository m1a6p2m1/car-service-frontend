import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AttendanceMarkService } from 'src/app/services/attendance/attendance-mark.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

interface Status {
  value: string;
  viewValue: string;
}

export interface Attendance {
  employeeId: number;
  employeeName: string;
  date: string;
  attendanceStatus: string;
}

@Component({
  selector: 'app-attendance-mark',
  standalone: false,
  templateUrl: './attendance-mark.component.html',
  styleUrl: './attendance-mark.component.scss',
})
export class AttendanceMarkComponent implements OnInit {
  displayedColumns: string[] = ['empId', 'employeeName', 'date', 'status'];
  attendanceList: Attendance[] = [];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  isAttendanceSavedToday = false;
  isButtonDisable = false;
  isSaving = false
  i: any;
  mode: 'add' | 'view' | 'edit' = 'add';
  saveButtonLabel = 'Save';

  constructor(
    private attendanceMarkService: AttendanceMarkService,
    private messageService: MessageServiceService
  ) { }

//   ngOnInit(): void {
//   const today = new Date().toISOString().split('T')[0];

//   this.attendanceMarkService.getAttendanceByDate(today)
//     .subscribe({
//       next: (response: any) => {
//         if (response && response.length > 0) {
//           // Already saved → EDIT MODE
//           this.attendanceList = response;
//           this.mode = 'edit';
//           this.saveButtonLabel = 'Update';
//           this.isAttendanceSavedToday = true;
//         } else {
//           // Not saved → ADD MODE
//           this.mode = 'add';
//           this.saveButtonLabel = 'Save';
//           this.populateData();
//         }

//         this.dataSource = new MatTableDataSource(this.attendanceList);
//         this.dataSource.paginator = this.paginator;
//         this.dataSource.sort = this.sort;
//       },
//       error: () => {
//         this.populateData();
//       }
//     });
// }


  ngOnInit(): void {
    // const savedDate = localStorage.getItem('attendanceSavedDate');//
    const today = new Date().toISOString().split('T')[0];//

    this.attendanceMarkService.getAttendanceByDate(today).subscribe({
      next: (response: any[]) => {
        // if (savedDate === today) {// Already Saved today Data
        if (response && response.length > 0) {
          this.attendanceList = response;
          this.mode = 'view';
          this.isAttendanceSavedToday = true; // disable dropdown
          this.isButtonDisable = true;
          this.saveButtonLabel = 'Saved';
        } else {                  // New Day -> ADD Mode
          this.mode = 'add';
          this.isAttendanceSavedToday = false; // enable dropdown
          this.isButtonDisable = false;
          this.saveButtonLabel = 'Save';
          // localStorage.removeItem('attendanceSavedDate');// reset

          this.populateData();
          return;

        }
        this.dataSource = new MatTableDataSource(this.attendanceList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        this.populateData();
      }    
    });

    
  }


  // Load Active Employees
  public populateData(): void {
    this.attendanceMarkService.getAllActiveEmployees()
      .subscribe((response: any) => {

        const today= new Date().toISOString().split('T')[0];

        this.attendanceList = response.map((emp: { id: any; name: String; })=> ({
          employeeId: emp.id,
          employeeName: emp.name,
          date: today,
          attendanceStatus: 'PRESENT'   //default value
    }));
      this.dataSource = new MatTableDataSource(this.attendanceList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log('get data response:', response);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //SAve Attendance List
  saveData() {
    // this.isSaving = true;
    if (this.mode === 'add') {
      this.attendanceMarkService.saveAttendance(this.attendanceList)
      .subscribe({
        next: () => {
          this.messageService.showSuccess('Attendance saved successfully');
          this.afterSave();
        },
        error: (error) => {
          this.messageService.showError('Save failed: ' + error);
          this.isSaving = false;//
        }
      });
    }else if (this.mode === 'edit') {
      this.attendanceMarkService.editAttendance(this.attendanceList)
      .subscribe({
        next: () => {
          this.messageService.showSuccess('Attendance Updated successfully');
          this.afterSave();
        },
        error: (error) => {
          this.messageService.showError('Save failed: ' + error);
          this.isSaving = false;//
        }
      });  
    }
  }

  afterSave() {
    // this.isSaving = false;

    // const today = new Date().toISOString().split('T')[0];
    // localStorage.setItem('attendanceSavedDate', today);

    this.mode = 'view';
    this.isAttendanceSavedToday = true; //disable dropdown//
    this.isButtonDisable = true;
    this.saveButtonLabel = 'Saved';
  }

  enableEdit() {
  this.mode = 'edit';
  this.isAttendanceSavedToday = false; // enable dropdown
  this.saveButtonLabel = 'Update';
  this.isButtonDisable = false;
  }  

}
