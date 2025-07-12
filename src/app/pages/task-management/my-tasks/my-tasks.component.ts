import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormDemoServiceService } from 'src/app/services/form-demo/form-demo-service.service';
import { HttpService } from 'src/app/services/http.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { TaskAssignService } from 'src/app/services/task-management/task-assign.service';

export type TodoStatus = 'pending' | 'processing' | 'done';

export interface TodoStatusOption {
  value: TodoStatus;
  label: string;
  color: string;
}

export interface UpdatedData {
  id: number,
  status: string
}

@Component({
  selector: 'app-my-tasks',
  standalone: false,
  templateUrl: './my-tasks.component.html',
  styleUrl: './my-tasks.component.scss'
})
export class MyTasksComponent implements OnInit{

    displayedColumns: string[] = ['uniqueSubTaskNo', 'description', 'status', 'action'];
    dataSource!: MatTableDataSource<any>;
    updatedDataList: UpdatedData[] = [];

  statusOptions: TodoStatusOption[] = [
    { value: 'pending', label: 'Pending', color: '#ff9800' },
    { value: 'processing', label: 'Processing', color: '#2196f3' },
    { value: 'done', label: 'Done', color: '#4caf50' }
  ];
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

      constructor(
        private fb: FormBuilder , 
        private demoService: FormDemoServiceService,
        private messageService: MessageServiceService,
        private taskAssignService: TaskAssignService,
        private httpService: HttpService
      ){
      }
  ngOnInit(): void {
    this.populateData();
  }


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
      this.taskAssignService.getAssingeSubTaskData(this.httpService.getUserId()).subscribe({
        next: (response: any) => {
          if (response) {
                  this.dataSource = new MatTableDataSource(response);
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
          }
        },
        error: (error: any) => {
          this.messageService.showError('Error While Getting Data. Please try again!');
        }
      })
    } catch (error) {
      this.messageService.showError('Action Failed with Error :'+ error);
    }
    
  }

public updateStatus(todoId: number, status: TodoStatus): void {

    const updatedData: UpdatedData = {id: todoId, status: status};
    this.updatedDataList.push(updatedData);

  }

public changeSubTaskStatus(dataRow: any): void {
    const updatedData: UpdatedData | undefined = this.updatedDataList.find(item => item.id == dataRow.id);

    if (updatedData) {
      this.taskAssignService.changeSubTaskStatus(updatedData).subscribe({
        next: (response: any) => {
          this.messageService.showSuccess("Sub Task status successfully updated!");
        },
        error: (error: any) => {
          this.messageService.showError("Error Occurred. Please try again!");
        }
      })
    }
  }
}
