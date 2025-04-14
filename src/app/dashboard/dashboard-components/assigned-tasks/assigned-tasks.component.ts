import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TaskAssignService } from 'src/app/services/task-management/task-assign.service';

@Component({
  selector: 'app-assigned-tasks',
  standalone: false,
  templateUrl: './assigned-tasks.component.html',
  styleUrl: './assigned-tasks.component.scss'
})
export class AssignedTasksComponent implements OnInit{
  displayedColumns: string[] = ['taskName', 'taskCreatedBy', 'status', 'customerName'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private taskAssignService: TaskAssignService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskAssignService.getData().subscribe((response: any) => {
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
}
