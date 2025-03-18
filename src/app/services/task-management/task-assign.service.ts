import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class TaskAssignService {

  constructor(
    private http:HttpClient,
    private httpService:HttpService
  ) { }

  serviceCall(form_details: any) {
      // console.log('In the Service');
      const requestUrl = environment.baseUrl + '/task-assign';
      
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
      const requestUrl = environment.baseUrl + '/task-assign';
      
           let headers = {};
      
          if (this.httpService.getAuthToken() !== null) {
            headers = {
              Authorization: 'Bearer ' + this.httpService.getAuthToken(),
            };
          }
      
          return this.http.get(requestUrl, headers);
  }

  editData(taskId:number, form_details: any){
    // console.log('In the Service');
    const requestUrl = environment.baseUrl + '/task-assign/'+ taskId.toString();
    
         let headers = {};
    
        if (this.httpService.getAuthToken() !== null) {
          headers = {
            Authorization: 'Bearer ' + this.httpService.getAuthToken(),
          };
        }
    
        return this.http.put(requestUrl, form_details, {headers: headers} );
  }

  deleteData(taskId: number){
    // console.log('In the Service');
    const requestUrl = environment.baseUrl + '/task-assign/'+ taskId.toString();
    
         let headers = {};
    
        if (this.httpService.getAuthToken() !== null) {
          headers = {
            Authorization: 'Bearer ' + this.httpService.getAuthToken(),
          };
        }
    
        return this.http.delete(requestUrl, {headers: headers} );
  }

}
