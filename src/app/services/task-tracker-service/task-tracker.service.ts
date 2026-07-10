import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';


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

@Injectable({
  providedIn: 'root'
})
export class TaskTrackerService {
  private todosSubject = new BehaviorSubject<Todo[]>([
    {
      id: 1,
      title: 'Setup project infrastructure',
      description: 'Initialize Angular project with Material Design components',
      status: 'done',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-02')
    },
    {
      id: 2,
      title: 'Implement user authentication',
      description: 'Add login and registration functionality with JWT tokens',
      status: 'processing',
      createdAt: new Date('2025-01-02'),
      updatedAt: new Date('2025-01-03')
    },
    {
      id: 3,
      title: 'Design dashboard layout',
      description: 'Create responsive dashboard with Material Design components',
      status: 'pending',
      createdAt: new Date('2025-01-03'),
      updatedAt: new Date('2025-01-03')
    },
    {
      id: 4,
      title: 'Integrate payment gateway',
      description: 'Setup Stripe payment processing for subscription management',
      status: 'pending',
      createdAt: new Date('2025-01-04'),
      updatedAt: new Date('2025-01-04')
    },
    {
      id: 5,
      title: 'Optimize performance',
      description: 'Implement lazy loading and code splitting for better performance',
      status: 'processing',
      createdAt: new Date('2025-01-05'),
      updatedAt: new Date('2025-01-05')
    }
  ]);

  todos$ = this.todosSubject.asObservable();

  constructor(private http:HttpClient, private httpService:HttpService) {}

  getMainTaskDetails(userId: string | null, taskNo: string) {
    if (userId == null || userId == undefined) {
      userId = '-1';
    }
    if (taskNo == null || taskNo == undefined) {
      taskNo = '-1';
    }
    const requestUrl = environment.baseUrl + '/task-assign/tracker/' + userId +  '/' + taskNo ;
    let headers = {};
          
    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }
          
    return this.http.get(requestUrl, headers); 
  }

  getMainTaskDetailsByUid(uid: string) {
    const requestUrl = environment.baseUrl + '/customer-task-by-uid?uid=' + uid ;
    let headers = {};
          
    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }
          
    return this.http.get(requestUrl, headers); 
  }

  getAllTasks() {
  const requestUrl = environment.baseUrl + '/all-assign-tasks/manager/tracker';

  let headers = {};

  if (this.httpService.getAuthToken() !== null) {
    headers = {
      Authorization: 'Bearer ' + this.httpService.getAuthToken(),
    };
  }

  return this.http.get(requestUrl, headers);
}

  //get tasks assign to the supervisor into the task tracker
  getSupervisorTasks(employeeId: string | null ,taskNo: string) {
    if(employeeId == null || employeeId == undefined) {
      employeeId = '-1';
    }
    const requestUrl = environment.baseUrl + '/task-assign/supervisor/tracker/' + employeeId +  '/' + taskNo ;
    let headers = {};
          
    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }
          
    return this.http.get(requestUrl, headers);
  }

  getSupervisorTasksByEmployeeId(employeeId: string){
    const requestUrl = environment.baseUrl + '/supervisor-task-by-employeeId?employeeId=' + employeeId ;
    let headers = {};
          
    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }
          
    return this.http.get(requestUrl, headers); 
  }

  getTodos(): Observable<Todo[]> {
    return this.todos$;
  }

  updateTodoStatus(todoId: number, status: TodoStatus): void {
    const todos = this.todosSubject.value;
    const todoIndex = todos.findIndex(todo => todo.id === todoId);
    
    if (todoIndex !== -1) {
      const updatedTodo = {
        ...todos[todoIndex],
        status,
        updatedAt: new Date()
      };
      
      const updatedTodos = [...todos];
      updatedTodos[todoIndex] = updatedTodo;
      
      this.todosSubject.next(updatedTodos);
    }
  }

  getStatusCounts(): Observable<{pending: number, processing: number, done: number}> {
    return new BehaviorSubject(
      this.todosSubject.value.reduce((counts, todo) => {
        counts[todo.status]++;
        return counts;
      }, {pending: 0, processing: 0, done: 0})
    ).asObservable();
  }
}