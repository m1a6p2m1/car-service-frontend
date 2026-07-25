import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { environment } from 'src/app/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private http:HttpClient,
    private httpService:HttpService
  ) {}

  serviceCall(form_details: any) {
    console.log('In the Add Service');
    const requestUrl = environment.baseUrl + '/customer';
    
         let headers = {};
    
        if (this.httpService.getAuthToken() !== null) {
          headers = {
            Authorization: 'Bearer ' + this.httpService.getAuthToken(),
          };
        }
    
        return this.http.post(requestUrl, form_details, {headers: headers} );
  }

  getData(){
    // console.log('In the Service');
    const requestUrl = environment.baseUrl + '/customer';
    
         let headers = {};
    
        if (this.httpService.getAuthToken() !== null) {
          headers = {
            Authorization: 'Bearer ' + this.httpService.getAuthToken(),
          };
        }
    
        // return this.http.get(requestUrl, headers );
        return this.http.get(requestUrl, { headers: headers });
  }

  editData(cusId:number, form_details: any){
    // console.log('In the Service');
    const requestUrl = environment.baseUrl + '/customer/'+ cusId.toString();
    
         let headers = {};
    
        if (this.httpService.getAuthToken() !== null) {
          headers = {
            Authorization: 'Bearer ' + this.httpService.getAuthToken(),
          };
        }
    
        return this.http.put(requestUrl, form_details, {headers: headers} );
  }

  deleteData(cusId: number){
    console.log('In the Service');
    const requestUrl = environment.baseUrl + '/customer/'+ cusId.toString();
    
         let headers = {};
    
        if (this.httpService.getAuthToken() !== null) {
          headers = {
            Authorization: 'Bearer ' + this.httpService.getAuthToken(),
          };
        }
    
        return this.http.delete(requestUrl, {headers: headers} );
  }

  checkContactNumber(contactNumber: string): Observable<boolean>{
      console.log('In the Service....contactNumber.............');
      const requestUrl = `${environment.baseUrl}/customer/check-contact`;
      
      let headers = {};
  
      if (this.httpService.getAuthToken() !== null) {
        headers = {
          Authorization: 'Bearer ' + this.httpService.getAuthToken(),
        };
      }
      
        return this.http.get<boolean>(requestUrl, {
          headers,
          params: {
            contactNumber: contactNumber
          }
        });
  
    }
  
    checkNicNumber(nic: string): Observable<boolean>{
      console.log('In the Service.................2');
      const requestUrl = `${environment.baseUrl}/customer/check-nic`;
      
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

    //get customer credentials to the customer login details form
    getCustomerLogin(customerId: number) {
      console.log("get customer credentials to the customer login details form")
      const requestUrl = environment.baseUrl + '/customer-login/get-credentials/' + customerId;
      let headers = {};
      if (this.httpService.getAuthToken() !== null) {
        headers = {
          Authorization: 'Bearer ' + this.httpService.getAuthToken(),
        };
      }
      return this.http.get(requestUrl, headers);
    }

  updateCustomerLogin(customerId: number, data: any) {
    const requestUrl = environment.baseUrl + '/customer-login/edit-credentials/' + customerId;
    let headers = {};
    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }
    return this.http.put(requestUrl, data, {headers: headers});
  }
  
}


