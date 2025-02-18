import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../http.service';
import { environment } from 'src/app/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(
    private http:HttpClient,
    private httpService:HttpService
  ) {}
  serviceCall(form_details: any){
    // console.log('In the Service');
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
    console.log('In the Service');
     const requestUrl = environment.baseUrl + '/employee';

     let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl, headers );
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
}
