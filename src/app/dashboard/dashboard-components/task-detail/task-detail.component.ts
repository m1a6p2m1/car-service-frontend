import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { TaskIntroduceService } from 'src/app/services/task-management/task-introduce.service';

@Component({
  selector: 'app-task-detail',
  standalone: false,
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent implements OnInit {
  task!: Task;

taski = {
  name: 'Remote Car Wash',
  description: 'A full exterior cleaning service performed at the customer’s location.',
  subtasks: [
    { title: 'Get Car', status: 'Pending' },
    { title: 'Wash Car', status: 'In Progress' },
    { title: 'Dry Car', status: 'Pending' },
    { title: 'Payment', status: 'Not Started' }
  ]
};
  constructor(
    private route: ActivatedRoute,
    private taskIntroduceService:TaskIntroduceService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const taskId = Number(this.route.snapshot.paramMap.get('id'));
    if (taskId) {
      this.taskIntroduceService.getTaskById(taskId).subscribe({
        next: (data) => {
      const task = data as unknown as Task;
      this.task = {
        ...task,
      };
        console.log('Loaded Task Details:', this.task);
      },
        error: (err) => {
        console.error('Failed to load item:', err);
      }
      });
    }
  }

  public bookAppointment(): void {
      // console.log("task id :", task.id)

  const navigationExtras: NavigationExtras = {
    state: {
      dataObject: this.task
    }
  };

      this.router.navigate(['/dashboard/appointment-service'], {
        state: {
          taskId: this.task.id,
          taskName: this.task.taskName,
          totalTaskPrice: this.task.totalTaskPrice
        }
      });
  }

  public previous(): void {

      this.router.navigate(['/dashboard']);
  }
}
