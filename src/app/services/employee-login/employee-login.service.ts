import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeLoginService {

  constructor( 
    private http:HttpClient , 
    private httpService : HttpService 
  ) { }

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
  
    getData(){
      console.log('In the Service getdata');
      const requestUrl = environment.baseUrl + '/employee-login'; //http://localhost:8080
  
      let headers = {};
  
      if (this.httpService.getAuthToken() !== null) {
        headers = {
          Authorization: 'Bearer ' + this.httpService.getAuthToken(),
        };
      }
  
      return this.http.get(requestUrl, headers);
  
    }
  
    editData(id: number , form_details: any){
      console.log('In the Service editdata');
      const requestUrl = environment.baseUrl + '/employee-login/' + id.toString(); //http://localhost:8080
  
      let headers = {};
  
      if (this.httpService.getAuthToken() !== null) {
        headers = {
          Authorization: 'Bearer ' + this.httpService.getAuthToken(),
        };
      }
  
      return this.http.put(requestUrl, form_details, {headers: headers});
    }

    resetPassword(form_details: any) {
      console.log('In the Service editdata');
      const requestUrl = environment.baseUrl + '/employee-login/';
  
      let headers = {};
  
      if (this.httpService.getAuthToken() !== null) {
        headers = {
          Authorization: 'Bearer ' + this.httpService.getAuthToken(),
        };
      }
  
      return this.http.put(requestUrl, form_details, {headers: headers});
    }
}
