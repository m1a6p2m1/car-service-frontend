import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { Router } from '@angular/router';
import { TaskIntroduceService } from 'src/app/services/task-management/task-introduce.service';


@Component({
  selector: 'app-sub-tasks',
  standalone: false,
  templateUrl: './sub-tasks.component.html',
  styleUrl: './sub-tasks.component.scss'
})
export class SubTasksComponent implements OnInit {
  tasks: Task[] = [];

  constructor(
    private taskIntroduceService: TaskIntroduceService,
    private router: Router,
  ) {}

  ngOnInit(): void{
    this.taskIntroduceService.getData().subscribe((taskList: Task[]) => {
      this.tasks = taskList.map((t: Task) => ({
        ...t,
      })
    );
    }); 
  }

  public openTaskDetails(task: Task): void {
    console.log("task id :", task.id)
    this.router.navigate(['/dashboard', 'task-detail', task.id]);
  }
  
}
