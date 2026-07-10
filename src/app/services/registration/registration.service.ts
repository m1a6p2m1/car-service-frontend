import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../http.service';
import { environment } from 'src/app/environments/environment';
import { Employee } from 'src/app/pages/registration/employee-details/employee-details.component';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(
    private http:HttpClient,
    private httpService:HttpService
  ) {}
  serviceCall(form_details: any){
     const requestUrl = environment.baseUrl + '/employee';

     let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.post(requestUrl, form_details, {headers: headers} );
  }

  getData(){
    
     const requestUrl = environment.baseUrl + '/employee';

     let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl, headers );
  }

  getEmployeeById(id: number){
    
     const requestUrl = environment.baseUrl + '/employee/' + id.toString();

     let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get<Employee>(requestUrl, { headers });

  }

  editData(empNumber: number, form_details: any){
    const requestUrl = environment.baseUrl + '/employee/' + empNumber.toString(); //http://localhost:8080

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.put(requestUrl, form_details, {headers: headers});
  }

  deleteData(empNumber: number){
    const requestUrl = environment.baseUrl + '/employee/' + empNumber.toString(); //http://localhost:8080

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.delete(requestUrl, {headers: headers});
  }

  //get employee list to set supervisors list task_assign form supervisor field
  getEmployeeList() {
    const requestUrl = environment.baseUrl + '/employee/get-employee-list';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl, headers);
  }

  updateEmployeeStatus(empNumber: number){
    const requestUrl = `${environment.baseUrl}/employee/update-status/${empNumber}`;
    
    let headers = {};
    console.log(this.httpService.getAuthToken());

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }
    
      return this.http.put(requestUrl, {}, {headers: headers} );
  }

  getEmployeeLogin(employeeId: number) {
    const requestUrl = environment.baseUrl + '/employee-login/get-credentials/' + employeeId;
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl, headers);
  }

  updateEmployeeLogin(employeeId: number, data: any) {
    const requestUrl = environment.baseUrl + '/employee-login/edit-credentials/' + employeeId;
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.put(requestUrl, data, {headers: headers});
  }

  checkPhoneNumber(phoneNumber: string): Observable<boolean>{
    console.log('In the Service.................');
    const requestUrl = `${environment.baseUrl}/check-phone`;
    
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }
    
      return this.http.get<boolean>(requestUrl, {
        headers,
        params: {
          phoneNumber: phoneNumber
        }
      });

  }

  checkNicNumber(nic: string): Observable<boolean>{
    console.log('In the Service.................2');
    const requestUrl = `${environment.baseUrl}/check-nic`;
    
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }
    
      return this.http.get<boolean>(requestUrl, {
        headers,
        params: {
          nic: nic
        }
      });

  }
}
