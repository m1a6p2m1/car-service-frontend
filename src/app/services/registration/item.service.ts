import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(
    private http:HttpClient,
    private httpService:HttpService
  ) {}

  serviceCall(form_details: any){
    console.log('In the service service call');
    const requestUrl = environment.baseUrl + '/item';
    let headers = {};
        
    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.post(requestUrl, form_details, {headers: headers} );  
            
  }

  getData(){
    console.log('In the service get');
    const requestUrl = environment.baseUrl + '/item';
    let headers = {};
        
    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl, headers );    
            
  }

  editData(itemId:number, form_details: any){
    console.log('In the service edit');
    const requestUrl = environment.baseUrl + '/item/'+ itemId.toString();
    let headers = {};
        
    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.put(requestUrl, form_details, {headers: headers} );    
            
  }

  deleteData(itemId:number){
    // console.log('In the service');
    const requestUrl = environment.baseUrl + '/item/'+ itemId.toString();
    let headers = {};
        
    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.delete(requestUrl, {headers: headers} );     
            
  }

  getItemCodes() {
    console.log("get data");

    const requestUrl = environment.baseUrl + '/item-code'; //'http://localhost:8080/grn'

    //get authtoken and set it to header
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }
    return this.http.get(requestUrl,{headers:headers});
  }
}
