import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  getLicenseByDateAndCustomer(date: string, customerId: string){//TaskAssignController
    let requestUrl = environment.baseUrl + `/task-assign/by-date-customerId?date=${date}&userId=${customerId}`;
    
      // if (currentNo) {
      //   requestUrl += `&currentNo=${currentNo}`;
      // }
      
      // console.log('Current Appointment No:', currentNo);
      
      let headers = new HttpHeaders();
      
      const token = this.httpService.getAuthToken();
      // console.log("TOKEN:", token);
        
      if (token !== null) {
              // headers = {
              //   Authorization: 'Bearer ' + this.httpService.getAuthToken(),
              // };
      headers = headers.set('Authorization', 'Bearer ' + token);
      }
            // console.log("TOKEN:", this.httpService.getAuthToken());
      return this.http.get<any[]>(requestUrl, {headers});
  }

  getDetailsByLicensePlate( date:string, licencePlate: string){//TaskAssignController
    const requestUrl = environment.baseUrl + `/task-assign/by-date-licensePlate?date=${date}&licencePlate=${licencePlate}`;            // GET /appointments

    let headers = {};
    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl, { headers: headers });

  }

  serviceCall(form_details: any){
        console.log('In the Service servicecall');
    
        const requestUrl = environment.baseUrl + '/customer-feedback'; //http://localhost:8080
    
        let headers = {};
    
        if (this.httpService.getAuthToken() !== null) {
          headers = {
            Authorization: 'Bearer ' + this.httpService.getAuthToken(),
          };
        }
    
        return this.http.post(requestUrl, form_details, {headers: headers});
    
  }

  getData(uniqueCusNo: string){
    console.log('In the Service getdata');
    const requestUrl = environment.baseUrl + '/customer-feedback/' + uniqueCusNo; //http://localhost:8080

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

  updateReview(id: number){
    const requestUrl = environment.baseUrl + '/customer-feedback/review/'+ id.toString();
    
         let headers = {};
    
        if (this.httpService.getAuthToken() !== null) {
          headers = {
            Authorization: 'Bearer ' + this.httpService.getAuthToken(),
          };
        }
    
        return this.http.put(requestUrl, {headers: headers} );
  }

}
