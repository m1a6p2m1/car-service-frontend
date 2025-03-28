// task.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { TaskService } from 'src/app/services/registration/task.service';
// import { Task } from './task.model';

export interface Task {
  id?: number;
  taskName: string;
  createdBy: string;
  customerName: string;
  subTasks: string[];
  progress?: number;
  currentState?: string;
  assignedEmployee?: string;
}

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  taskForm: FormGroup;
  tasks: any[] = [];
  taskNames = ['Development', 'Testing', 'Deployment'];
  customers = ['Client A', 'Client B', 'Client C'];
  states = ['Not Started', 'In Progress', 'Completed'];
  employees = ['John Doe', 'Jane Smith', 'Bob Johnson'];

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    // this.createForm();
    this.taskForm = this.fb.group({
      taskName: [''],
      createdBy: [''],
      customerName: [''],
      subTasks: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.loadTasks();
  }

  // createForm() {

  // }

  get subTasks() {
    return this.taskForm.get('subTasks') as FormArray;
  }

  addSubTask() {
    this.subTasks.push(
      this.fb.group({
        description: [''],
      })
    );
  }

  removeSubTask(index: number) {
    this.subTasks.removeAt(index);
  }

  onSubmit() {
    this.taskService.saveTask(this.taskForm.value).subscribe(() => {
      // this.loadTasks();
      this.taskForm.reset();
    });
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((tasks: any) => (this.tasks = tasks));
  }

  completeTask(task: Task) {
    task.currentState = 'Completed';
    task.progress = 100;
    this.updateTask(task);
  }

  editTask(task: Task) {
    this.taskForm.patchValue(task);
    const subTasks = this.taskForm.get('subTasks') as FormArray;
    subTasks.clear();
    task.subTasks.forEach((subTask) => subTasks.push(this.fb.control(subTask)));
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe(() => this.loadTasks());
  }

  updateTask(task: Task) {
    this.taskService.updateTask(task).subscribe(() => this.loadTasks());
  }
}
