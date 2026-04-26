import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceMarkService {
  // getAttendanceByDate: any;


  constructor(
      private http:HttpClient,
      private httpService:HttpService
  ) { }

  saveAttendance(attendanceList: any[]) {
        // console.log('In the Service');
        const requestUrl = environment.baseUrl + '/attendance-mark/save';
        
             let headers: any = {
              'Content-Type': 'application/json'
             };
        
            if (this.httpService.getAuthToken()) {
              headers = {
                Authorization: 'Bearer ' + this.httpService.getAuthToken(),
              };
            }
        
            return this.http.post(requestUrl, attendanceList, {headers: headers} );
    }

    getData(){
      console.log('In the Service');
        const requestUrl = environment.baseUrl + '/attendance-mark';
        
             let headers = {};
        
            if (this.httpService.getAuthToken() !== null) {
              headers = {
                Authorization: 'Bearer ' + this.httpService.getAuthToken(),
              };
            }
        
            return this.http.get(requestUrl, headers);
    }

    //Load all employees to the attendance mark table
    getAllActiveEmployees(){
      console.log('In the Service 2');
      const requestUrl = environment.baseUrl + '/attendance-mark/active-employee';

      let headers = {};

      if (this.httpService.getAuthToken() !== null) {
        headers = {
          Authorization: 'Bearer ' + this.httpService.getAuthToken(),
        };
      }

      return this.http.get(requestUrl, headers );
    }

    getAttendanceByDate(date: string){
      const requestUrl = `${environment.baseUrl}/attendance-mark/by-date?date=${date}`;

      let headers: any = {
        'Content-Type': 'application/json'
      };

      if (this.httpService.getAuthToken() !== null) {
        headers = {
          ...headers,
          Authorization: 'Bearer ' + this.httpService.getAuthToken(),
        };
      }

      return this.http.get<any[]>(requestUrl, {headers} );
    }

  editAttendance(attendanceList: any[]) {
        console.log('In the EDIT ATTENDANCE Service');
        const requestUrl = environment.baseUrl + '/attendance-mark/update';
        
             let headers: any = {
              'Content-Type': 'application/json'
             };
        
            if (this.httpService.getAuthToken()) {
              headers = {
                Authorization: 'Bearer ' + this.httpService.getAuthToken(),
              };
            }
        
            return this.http.put(requestUrl, attendanceList, {headers: headers} );
  }

}
