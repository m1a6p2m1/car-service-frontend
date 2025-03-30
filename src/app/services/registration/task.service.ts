// task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient, private httpService: HttpService) {}

  getTasks(): any {
    const requestUrl = environment.baseUrl + '/task';
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }
    return this.http.get(requestUrl, headers);
  }

  saveTask(task: any) {
    const requestUrl = environment.baseUrl + '/task';
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }
    return this.http.post<any>(requestUrl, task);
  }

  updateTask(task: any) {
    return this.http.put<any>(`${this.apiUrl}/${task.id}`, task);
  }

  deleteTask(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
