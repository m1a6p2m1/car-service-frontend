import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { HttpService } from '../http.service';
import { Observable } from 'rxjs';
import { Task } from '../notification-service/notification.service';

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {

  constructor(private http: HttpClient, private httpService: HttpService) { }

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

    serviceCall(form_details: any) {
    // console.log('In the Service');
      const requestUrl = environment.baseUrl + '/vehicles';

      let headers = {};

      if (this.httpService.getAuthToken() !== null) {
        headers = {
          Authorization: 'Bearer ' + this.httpService.getAuthToken(),
        };
      }

      return this.http.post(requestUrl, form_details, { headers: headers });
    }

    editData(id: number, form_details: any) {
    // console.log('In the Service');
    const requestUrl =
      environment.baseUrl + '/vehicles/' + id.toString();

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.put(requestUrl, form_details, { headers: headers });
  }

    getData() {
    // console.log('In the Service');
    const requestUrl = environment.baseUrl + '/vehicles';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl, headers);
  }

  deleteData(id: number) {
    // console.log('In the Service');
    const requestUrl =
      environment.baseUrl + '/vehicles/' + id.toString();

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.delete(requestUrl, { headers: headers });
  }
}
