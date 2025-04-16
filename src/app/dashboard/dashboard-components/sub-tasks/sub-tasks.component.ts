import { Component, OnInit } from '@angular/core';
import { TaskAssignService } from 'src/app/services/task-management/task-assign.service';
// import { TaskAssignComponent } from 'src/app/pages/task-management/task-assign/task-assign.component';

interface Task {
  id: any;
  taskName: string;
  definedSubTaskDtos: any;
}

@Component({
  selector: 'app-sub-tasks',
  standalone: false,
  templateUrl: './sub-tasks.component.html',
  styleUrl: './sub-tasks.component.scss'
})
export class SubTasksComponent implements OnInit {
  tasks: Task[] = [];

  constructor(
    private taskAssignService: TaskAssignService,
    // private taskAssignComponent: TaskAssignComponent
  ) {}

  ngOnInit(): void{
    this.getDefinedTasks();
  }
  

  public getDefinedTasks(): void {
    this.taskAssignService.getDefinedTasks().subscribe((response: any) => {
      if (response) {
        this.tasks = response;
      }
    });
  }
  
}
