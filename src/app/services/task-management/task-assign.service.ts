import { HttpClient, HttpHeaders } from '@angular/common/http';
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
      const requestUrl = environment.baseUrl + '/register/users';
      console.log('customer names');
      let headers = {};
  
      if (this.httpService.getAuthToken() !== null) {
        headers = {
          Authorization: 'Bearer ' + this.httpService.getAuthToken(),
        };
      }
  
      return this.http.get(requestUrl, headers);
  }

  getAppointmentsByDateAndTime(date: string, time: string) {

      const requestUrl = environment.baseUrl + `/appointment-service/by-date-time?date=${date}&time=${time}`;

      console.log('appointment unique no');
      let headers = new HttpHeaders();

      const token = this.httpService.getAuthToken();
      console.log("TOKEN:", token);
  
      if (token !== null) {
        // headers = {
        //   Authorization: 'Bearer ' + this.httpService.getAuthToken(),
        // };
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
      // console.log("TOKEN:", this.httpService.getAuthToken());
      return this.http.get<any[]>(requestUrl, {headers});
  }

  //Auto load licence_plate and vehicle_type when select customer_name
  getVehicleDetails(customerId: number) {
      const requestUrl = environment.baseUrl + '/register/vehicles/' + customerId.toString();
      console.log('Vehicle Details');
      let headers = {};
  
      if (this.httpService.getAuthToken() !== null) {
        headers = {
          Authorization: 'Bearer ' + this.httpService.getAuthToken(),
        };
      }
  
      return this.http.get<any>(requestUrl, { headers });
  }

  getDetailsByAppointmentNo(appointmentUniqueNo: string) {
    console.log('In the Service → get appointments');
    const requestUrl = environment.baseUrl + '/appointment-service/' + appointmentUniqueNo;            // GET /appointments

    let headers = {};
    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl, { headers: headers });
  }



  // getCustomersList() {
  //   const requestUrl = environment.baseUrl + '/customer/task-list-customers';

  //   let headers = {};

  //   if (this.httpService.getAuthToken() !== null) {
  //     headers = {
  //       Authorization: 'Bearer ' + this.httpService.getAuthToken(),
  //     };
  //   }

  //   return this.http.get(requestUrl, headers);
  // }

  // customer commonly used tasks loaded into the dashboard
  // getTasksByCustomerId(customerId: number): Observable<Task[]> {
  //   const requestUrl =
  //     environment.baseUrl + '/task-assign/' + customerId.toString();

  //   let headers = {};
  //   if (this.httpService.getAuthToken()) {
  //     headers = {
  //       Authorization: 'Bearer ' + this.httpService.getAuthToken(),
  //     };
  //   }

  //   return this.http.get<Task[]>(requestUrl, { headers });
  // }


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

  getAssingeSubTaskData(id: any) {
    // console.log('In the Service');
    const requestUrl = environment.baseUrl + '/sub-task-assign/' + id.toString();

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl, headers);
  }

  changeSubTaskStatus(data: any) {
        // console.log('In the Service');
    const requestUrl = environment.baseUrl + '/change-sub-task-status';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.put(requestUrl,data, headers);
  }
  
}
