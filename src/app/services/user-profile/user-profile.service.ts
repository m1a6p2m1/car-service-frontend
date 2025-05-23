import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { environment } from 'src/app/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(
    private http:HttpClient , 
    private httpService : HttpService 
  ) { }

  // serviceCall(form_details: any){
  //   console.log('In the Service servicecall');
    
  //   const requestUrl = environment.baseUrl + '/user-profile'; //http://localhost:8080
    
  //   let headers = {};
    
  //   if (this.httpService.getAuthToken() !== null) {
  //     headers = {
  //       Authorization: 'Bearer ' + this.httpService.getAuthToken(),
  //     };
  //   }
    
  //   return this.http.post(requestUrl, form_details, {headers: headers});
    
  // }

  editProfile(id: number , form_details: any){
    console.log('In the Service editdata');
    const requestUrl = environment.baseUrl + '/user-profile/' + id.toString(); //http://localhost:8080
    
    let headers = {};
    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }
  
    return this.http.put(requestUrl, form_details, {headers: headers}); 
         
  }

  getLoggedInUserDetails(): Observable<any> {
    console.log('In the Service');
    const requestUrl = environment.baseUrl + '/user-profile' ; // Example: http://localhost:8080/user-profile
  
    let headersObj = {};
  
    const token = this.httpService.getAuthToken();
    if (token !== null) {
      headersObj = {
        Authorization: 'Bearer ' + token
      };
    }
  
    return this.http.get(requestUrl, { headers: new HttpHeaders(headersObj) });
  }

  // getAuthenticatedUser(id: number): Observable<any> {
  //   console.log('In the Service');
  //   const requestUrl = environment.baseUrl + '/user-profile/' +id.toString(); // e.g., http://localhost:8080/user-profile

  //   let headers = {};
  //   if (this.httpService.getAuthToken() !== null) {
  //     headers = {
  //       Authorization: 'Bearer ' + this.httpService.getAuthToken(),
  //     };
  //   }

  //   return this.http.get(requestUrl, { headers: headers });
  // }
  

  // getData(): Observable<any>{
  //   console.log('In the Service');
  //   const requestUrl = environment.baseUrl + '/user-profile/'; //http://localhost:8080

  //   let headers = {};

  //   if (this.httpService.getAuthToken() !== null) {
  //     headers = {
  //       Authorization: 'Bearer ' + this.httpService.getAuthToken(),
  //     };
  //   }

  //   return this.http.get(requestUrl, headers);

  // }


}
