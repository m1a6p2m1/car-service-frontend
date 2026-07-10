import { AfterViewInit, Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TaskTrackerService } from '../services/task-tracker-service/task-tracker.service';
import { HttpService } from '../services/http.service';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export interface Todo {
  id: number;
  title: string;
  description: string;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type TodoStatus = 'pending' | 'processing' | 'done';

export interface TodoStatusOption {
  value: TodoStatus;
  label: string;
  color: string;
}

interface Task {
  id: any;
  taskName: string;
  subTasks: any;
  uniqueTaskNo?: any;
  licencePlate: string;
  customerName: string;
  date: string;
}

interface SubTask {
  id: any,
  description: any,
  uniqueSubTaskNo: any,
  assigneUserName: any,
  status: any
}

@Component({
  selector: 'app-task-tracker',
  standalone: false,
  templateUrl: './task-tracker.component.html',
  styleUrl: './task-tracker.component.scss'
})
export class TaskTrackerComponent implements OnInit, AfterViewInit {
  subTasks: SubTask[] = [];
  tasks: Task[] = [];
  filteredTasks: Task[] = [];

  /* correct variable start */

  statusCount = {
    pending: 0,
    processing: 0,
    done: 0
  };

  processingPercentage: number = 0;
  pendingPercentage: number = 0;
  donePercentage: number = 0;
  overallProgress: number = 0;
  selectedOption: number = 0;

  /* correct variable end */

  constructor(private todoService: TaskTrackerService, private httpService: HttpService, private cdRef: ChangeDetectorRef, private route: ActivatedRoute) {
  }

    ngOnInit(): void {
    }

  // ngAfterViewInit(): void {

  // let uid = '';
  // this.route.queryParams.subscribe(params => {uid = params['uid'];});
  // const role = localStorage.getItem('userRole');
  // const jobTitle = localStorage.getItem('jobTitle');
  // const employeeId = localStorage.getItem('employeeId');

  //   if (uid == null || uid == '' || uid == undefined) {
  //     this.todoService.getMainTaskDetails(this.httpService.getUserId(), '-1').subscribe({
  //       next: (response: any) => {
  //         this.tasks = response;
  //         this.cdRef.detectChanges();
  //       }, 
  //       error: (error: any) => {
  //         console.log(error);
  //       }
  //     })
  //   } else if (uid) {
  //     console.log("User ID:", uid);
  //     this.todoService.getMainTaskDetailsByUid(uid).subscribe({
  //       next: (response: any) => {
  //         this.tasks = response;
  //         this.cdRef.detectChanges();
  //       }, 
  //       error: (error: any) => {
  //         console.log(error);
  //       }
  //     })
  //   } else  if(role === 'EMPLOYEE' && jobTitle === 'Supervisor') {

  //     console.log("ROLE:", role);
  //     console.log("JOB TITLE:", jobTitle);
  //     console.log("EMPLOYEE ID:", employeeId);
  //     this.todoService.getSupervisorTasks(employeeId, '-1').subscribe({
  //       next: (res: any) => {
  //         this.tasks = res;
  //         this.cdRef.detectChanges();
  //       },
  //       error: (error: any)=>{
  //         console.log(error);
  //       }
  //     });
  //   } else if (employeeId) {
  //     this.todoService.getSupervisorTasksByEmployeeId(employeeId).subscribe({
  //       next: (response: any) => {
  //         this.tasks = response;
  //         this.cdRef.detectChanges();
  //       }, 
  //       error: (error: any) => {
  //         console.log(error);
  //       }
  //     })
  //   }

    
  // }

  ngAfterViewInit(): void {

    let uid = '';
    this.route.queryParams.subscribe(params => {
      uid = params['uid'];
    });

    const role = localStorage.getItem('userRole');
    const jobTitle = localStorage.getItem('jobTitle');
    const employeeId = localStorage.getItem('employeeId');

    console.log("ROLE:", role);
    console.log("JOB TITLE:", jobTitle);
    console.log("EMPLOYEE ID:", employeeId);
    console.log("UID:", uid);

    // 1. Supervisor Login
    if (role === 'EMPLOYEE' && jobTitle?.toUpperCase() === 'SUPERVISOR') {

      this.todoService.getSupervisorTasks(employeeId, '-1').subscribe({
        next: (res: any) => {
          console.log("Supervisor Tasks:", res);
          this.tasks = res;
          this.cdRef.detectChanges();
        },
        error: (error: any) => {
          console.log(error);
        }
      });

    }

    // 2. Manager Login
  else if (role === 'EMPLOYEE' && jobTitle?.toUpperCase() === 'MANAGER') {

    this.todoService.getAllTasks().subscribe({
      next: (res: any) => {
        console.log("Manager Tasks:", res);
        this.tasks = res;
        this.filteredTasks = [...res];
        this.cdRef.detectChanges();
      },
      error: (error: any) => console.log(error)
    });

  }

    // 3. Task load by UID
    else if (uid) {

      this.todoService.getMainTaskDetailsByUid(uid).subscribe({
        next: (response: any) => {
          console.log("UID Tasks:", response);
          this.tasks = response;
          this.cdRef.detectChanges();
        },
        error: (error: any) => {
          console.log(error);
        }
      });

    }

    // 4. Normal customer login
    else {

      this.todoService.getMainTaskDetails(
        this.httpService.getUserId(),
        '-1'
      ).subscribe({
        next: (response: any) => {
          console.log("Customer Tasks:", response);
          this.tasks = response;
          this.filteredTasks = [...response];
          this.cdRef.detectChanges();
        },
        error: (error: any) => {
          console.log(error);
        }
      });

    }
  }

    public setPercentages(): void {
    const totalCount = this.statusCount.pending + this.statusCount.done + this.statusCount.processing;
    this.processingPercentage = totalCount > 0 ? Math.round((this.statusCount.processing / totalCount) * 100) : 0;
    this.pendingPercentage = totalCount > 0 ? Math.round((this.statusCount.pending / totalCount) * 100) : 0;
    this.donePercentage = totalCount > 0 ? Math.round((this.statusCount.done / totalCount) * 100) : 0;
    this.overallProgress = this.donePercentage;
    }

  trackById(index: number, todo: Todo): number {
    return todo.id;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'processing': return '#2196f3';
      case 'done': return '#4caf50';
      default: return '#757575';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'done': return 'Done';
      default: return 'Unknown';
    }
  }

  public onTaskChange(taskEvent: any): void {
    
    let pending = 0, processing = 0, done = 0;
    const taskId = taskEvent.value;
    this.subTasks = this.tasks.find((item: any) => item.id == taskId)?.subTasks;

          this.subTasks.forEach((item: any) => {
            if (item.status == 'pending') {
              pending ++;
            }
            if (item.status == 'processing') {
              processing ++;
            }
            if (item.status == 'done') {
              done ++;
            }
          });

          this.statusCount = {
            done: done,
            pending: pending,
            processing: processing
          }

          this.setPercentages();
  }
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onDateChange(selectedDate: Date | null) {
    if(!selectedDate){
      this.filteredTasks = [...this.tasks];
      return;
    }

    const formattedDate = this.formatDate(selectedDate);

    this.filteredTasks = this.tasks.filter(task =>
    this.formatDate(new Date(task.date!)) === formattedDate
  );
  }
}
