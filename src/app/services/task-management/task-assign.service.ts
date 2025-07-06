import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { HttpService } from '../http.service';
import { Observable } from 'rxjs';
import { Task } from 'src/app/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskAssignService {
  constructor(private http: HttpClient, private httpService: HttpService) {}

  serviceCall(form_details: any) {
    // console.log('In the Service');
    const requestUrl = environment.baseUrl + '/task-assign';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.post(requestUrl, form_details, { headers: headers });
  }

  getData() {
    // console.log('In the Service');
    const requestUrl = environment.baseUrl + '/task-assign';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl, headers);
  }

  getDefinedTasks() {
    const requestUrl = environment.baseUrl + '/defined_tasks';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl, headers);
  }

  editData(taskId: number, form_details: any) {
    // console.log('In the Service');
    const requestUrl =
      environment.baseUrl + '/task-assign/' + taskId.toString();

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.put(requestUrl, form_details, { headers: headers });
  }

  deleteData(taskId: number) {
    // console.log('In the Service');
    const requestUrl =
      environment.baseUrl + '/task-assign/' + taskId.toString();

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.delete(requestUrl, { headers: headers });
  }

  getCustomersList() {
    const requestUrl = environment.baseUrl + '/customer/task-list-customers';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl, headers);
  }

  // customer commonly used tasks loaded into the dashboard
  getTasksByCustomerId(customerId: number): Observable<Task[]> {
    const requestUrl =
      environment.baseUrl + '/task-assign/' + customerId.toString();

    let headers = {};
    if (this.httpService.getAuthToken()) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get<Task[]>(requestUrl, { headers });
  }
// this create for dashboard task card for the common customers
  getTaskById(id:number): Observable<Task>{
      console.log('In the service getTaskbyid');
      const requestUrl = environment.baseUrl + '/task-assign/'+ id.toString();
      let headers = {};
          
      if (this.httpService.getAuthToken() !== null) {
        headers = {
          Authorization: 'Bearer ' + this.httpService.getAuthToken(),
        };
      }
  
      return this.http.get<Task>(requestUrl, headers );    
              
    }

  
}
