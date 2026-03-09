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
  attendanceDate: string;
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

  constructor(
    private attendanceMarkService: AttendanceMarkService,
    private messageService: MessageServiceService
  ) { }


  ngOnInit(): void {
    const savedDate = localStorage.getItem('attendanceSavedDate');//
    const today = new Date().toISOString().split('T')[0];//

    if (savedDate === today) {//
      this.isAttendanceSavedToday = true; // enable dropdown
    } else {
      this.isAttendanceSavedToday = false; // disable dropdown
      localStorage.removeItem('attendanceSavedDate');//
    }
    this.populateData();
  }


  // Load Active Employees
  public populateData(): void {
    this.attendanceMarkService.getAllActiveEmployees()
      .subscribe((response: any) => {

        const today= new Date().toISOString().split('T')[0];

        this.attendanceList = response.map((emp: { id: any; name: String; })=> ({
          employeeId: emp.id,
          employeeName: emp.name,
          attendanceDate: today,
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
    this.attendanceMarkService.saveAttendance(this.attendanceList)
      .subscribe({
        next: () => {
          this.messageService.showSuccess('Attendance saved successfully');
          this.isSaving = false;//
          this.isAttendanceSavedToday = true; //disable dropdown//
          const today = new Date().toISOString().split('T')[0];
          localStorage.setItem('attendanceSavedDate', today)//
        },
        error: (error) => {
          this.messageService.showError('Save failed: ' + error);
          this.isSaving = false;//
        }
    });
    this.isButtonDisable = true;
  
  }

}
