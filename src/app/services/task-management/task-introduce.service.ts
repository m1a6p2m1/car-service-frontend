import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { environment } from 'src/app/environments/environment';
import { Task } from 'src/app/models/task.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskIntroduceService {

  constructor(private http: HttpClient, private httpService: HttpService) {}

    serviceCall(form_details: any) {
      console.log('In the Service save data');
      const requestUrl = environment.baseUrl + '/task-introduce';
  
      let headers = {};
  
      if (this.httpService.getAuthToken() !== null) {
        headers = {
          Authorization: 'Bearer ' + this.httpService.getAuthToken(),
        };
      }
  
      return this.http.post(requestUrl, form_details, { headers: headers });
    }


    getData(): Observable<Task[]> {
      console.log('In the Service get data');
      const requestUrl = environment.baseUrl + '/task-introduce';
  
      let headers = {};
  
      if (this.httpService.getAuthToken() !== null) {
        headers = {
          Authorization: 'Bearer ' + this.httpService.getAuthToken(),
        };
      }
  
      return this.http.get<Task[]>(requestUrl, headers);
    }

    getTaskById(id:number): Observable<Task[]>{
      console.log('In the service getTaskbyid');
      const requestUrl = environment.baseUrl + '/task-introduce/'+ id.toString();
      let headers = {};
          
      if (this.httpService.getAuthToken() !== null) {
        headers = {
          Authorization: 'Bearer ' + this.httpService.getAuthToken(),
        };
      }
  
      return this.http.get<Task[]>(requestUrl, headers );    
              
    }

    editData(id: number, form_details: any){
      console.log('In the Service');
      const requestUrl = environment.baseUrl + '/task-introduce/' + id.toString();
      
           let headers = {};
      
          if (this.httpService.getAuthToken() !== null) {
            headers = {
              Authorization: 'Bearer ' + this.httpService.getAuthToken(),
            };
          }
      
          return this.http.put(requestUrl, form_details, {headers: headers} );
    }

    deleteData(id: number) {
      console.log('In the Service');
      const requestUrl =
        environment.baseUrl + '/task-introduce/' + id.toString();
  
      let headers = {};
  
      if (this.httpService.getAuthToken() !== null) {
        headers = {
          Authorization: 'Bearer ' + this.httpService.getAuthToken(),
        };
      }
  
      return this.http.delete(requestUrl, { headers: headers });
    }
}
