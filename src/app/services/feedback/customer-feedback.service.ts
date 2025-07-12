import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { environment } from 'src/app/environments/environment';
import { CustomerFeedback } from 'src/app/pages/feedback/feedback-details/feedback-details.component';

@Injectable({
  providedIn: 'root'
})
export class CustomerFeedbackService {

  constructor(
    private http:HttpClient , 
    private httpService : HttpService
  ) { }

  serviceCall(form_details: any){
        // console.log('In the Service servicecall');
    
        const requestUrl = environment.baseUrl + '/customer-feedback'; //http://localhost:8080
    
        let headers = {};
    
        if (this.httpService.getAuthToken() !== null) {
          headers = {
            Authorization: 'Bearer ' + this.httpService.getAuthToken(),
          };
        }
    
        return this.http.post(requestUrl, form_details, {headers: headers});
    
  }

  getData(id: number){
    console.log('In the Service getdata');
    const requestUrl = environment.baseUrl + '/customer-feedback/' + id.toString(); //http://localhost:8080

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get<CustomerFeedback>(requestUrl, headers);

  }

  getAllData(){
    console.log('In the Service All Data');
    const requestUrl = environment.baseUrl + '/customer-feedback';
    
         let headers = {};
    
        if (this.httpService.getAuthToken() !== null) {
          headers = {
            Authorization: 'Bearer ' + this.httpService.getAuthToken(),
          };
        }
    
        return this.http.get(requestUrl, headers );
  }

  // getFeedbackById(id: number){
  //     console.log('In the Service getFeedbackById');
  //      const requestUrl = environment.baseUrl + '/customer-feedback/' + id.toString();
  
  //      let headers = {};
  
  //     if (this.httpService.getAuthToken() !== null) {
  //       headers = {
  //         Authorization: 'Bearer ' + this.httpService.getAuthToken(),
  //       };
  //     }
  
  //     return this.http.get<CustomerFeedback>(requestUrl, { headers });
  
  //   }

  editData(id: number , form_details: any){
    console.log('In the Service editdata');
    const requestUrl = environment.baseUrl + '/customer-feedback/' + id.toString(); //http://localhost:8080

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.put(requestUrl, form_details, {headers: headers});
  }

  deleteData(id: number){
    console.log('In the Service');
    const requestUrl = environment.baseUrl + '/customer-feedback/'+ id.toString();
    
         let headers = {};
    
        if (this.httpService.getAuthToken() !== null) {
          headers = {
            Authorization: 'Bearer ' + this.httpService.getAuthToken(),
          };
        }
    
        return this.http.delete(requestUrl, {headers: headers} );
  }

}
