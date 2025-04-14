import { Component, OnInit } from '@angular/core';
import { TaskAssignService } from 'src/app/services/task-management/task-assign.service';

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
export class SubTasksComponent {
  
}
