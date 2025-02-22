import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(
    private http:HttpClient,
    private httpService:HttpService
  ) { }

  serviceCall(form_details: any){
     console.log('In the Service');
    const requestUrl = environment.baseUrl + '/supplier';
        
             let headers = {};
        
            if (this.httpService.getAuthToken() !== null) {
              headers = {
                Authorization: 'Bearer ' + this.httpService.getAuthToken(),
              };
            }
        
            return this.http.post(requestUrl, form_details, {headers: headers} );
  }

  getData(){
    //  console.log('In the Service');
    const requestUrl = environment.baseUrl + '/supplier';
        
             let headers = {};
        
            if (this.httpService.getAuthToken() !== null) {
              headers = {
                Authorization: 'Bearer ' + this.httpService.getAuthToken(),
              };
            }
        
            return this.http.get(requestUrl, headers );
  }

  editData(supplierId:number, form_details:any ){
    // console.log('In the Service');
    const requestUrl = environment.baseUrl + '/supplier/'+ supplierId.toString();
        
             let headers = {};
        
            if (this.httpService.getAuthToken() !== null) {
              headers = {
                Authorization: 'Bearer ' + this.httpService.getAuthToken(),
              };
            }
        
            return this.http.put(requestUrl, form_details, {headers: headers} );
  }

  deleteData(supplierId:number){
    // console.log('In the Service');
    const requestUrl = environment.baseUrl + '/supplier/'+ supplierId.toString();
        
             let headers = {};
        
            if (this.httpService.getAuthToken() !== null) {
              headers = {
                Authorization: 'Bearer ' + this.httpService.getAuthToken(),
              };
            }
        
            return this.http.delete(requestUrl, {headers: headers} );
  }
}
