import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TaskTrackerService } from '../services/task-tracker-service/task-tracker.service';
import { HttpService } from '../services/http.service';

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
export class TaskTrackerComponent implements OnInit {
  subTasks: SubTask[] = [];
  tasks: Task[] = [];

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

  constructor(private todoService: TaskTrackerService, private httpService: HttpService) {}

    ngOnInit(): void {
      this.todoService.getMainTaskDetails(this.httpService.getUserId(), '-1').subscribe({
        next: (response: any) => {
          this.tasks = response;
        }, 
        error: (error: any) => {
          console.log(error);
        }
      })
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
    this.subTasks = this.tasks.find((item: any) => item.id = taskId)?.subTasks;

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
}
