import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeStatService {

  constructor(private httpService: HttpService, private http:HttpClient) {
  }
  
    serviceCall(form_details: any){
        console.log('In the Service servicecall');
    
        const requestUrl = environment.baseUrl + '/employee-login'; //http://localhost:8080
    
        let headers = {};
    
        if (this.httpService.getAuthToken() !== null) {
          headers = {
            Authorization: 'Bearer ' + this.httpService.getAuthToken(),
          };
        }
    
        return this.http.post(requestUrl, form_details, {headers: headers});
    
      }

  public commonCustomerUseServices() {
    const requestUrl = environment.baseUrl + '/common-data-service/common-user-services';
    let headers = {};
        
    if (this.httpService.getAuthToken() !== null) {
          headers = {
            Authorization: 'Bearer ' + this.httpService.getAuthToken(),
          };
    }

    return this.http.get(requestUrl, {headers: headers});
  }

    public getEmployeeCountByJobRole() {
    const requestUrl = environment.baseUrl + '/employee/get-employee-count-by-role';
    let headers = {};
        
    if (this.httpService.getAuthToken() !== null) {
          headers = {
            Authorization: 'Bearer ' + this.httpService.getAuthToken(),
          };
    }

    return this.http.get(requestUrl, {headers: headers});
  }
}