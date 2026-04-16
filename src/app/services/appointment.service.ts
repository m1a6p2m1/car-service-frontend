import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Appointment, TimeSlot } from '../models/appointment.model';


@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private baseUrl = environment.baseUrl + '/appointment-service';

  constructor(private http: HttpClient, private httpService: HttpService) { }

  // GET available slots for a given date
  getAvailableSlots(date: string): Observable<TimeSlot[]> {
    console.log('In the Service → get available slots');
    const requestUrl = `${this.baseUrl}/available-slots?date=${date}`;

    const token = this.httpService.getAuthToken();
    const headers = token ? new HttpHeaders()
                           .set('Authorization', `Bearer ${token}`)
                         : undefined;


    // let headers = {};
    // if (this.httpService.getAuthToken() !== null) {
    //   headers = {
    //     Authorization: 'Bearer ' + this.httpService.getAuthToken(),
    //   };
    // }
    // Angular HttpClient expects an *options* object; keep the shape identical to your snippet
    return this.http.get<TimeSlot[]>(requestUrl, { headers: headers });
  }



  /** -------------------- 2.  Book a new appointment -------------------- */
  bookAppointment(appointment: any): Observable<Appointment>{
    console.log('In the Service → save appointment');
    const requestUrl = `${this.baseUrl}`;            // POST /appointments

    let headers = {};
    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.post<Appointment>(requestUrl, appointment, { headers: headers });
  }

  /** -------------------- 3.  (Optional) Get all existing appointments -------------------- */
  getAppointments(): Observable<any[]> {
    console.log('In the Service → get appointments');
    const requestUrl = this.baseUrl + '/get-all-appointments';            // GET /appointments

    let headers = {};
    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get<any[]>(requestUrl, { headers: headers });
  }

  getAppointmentsByCustomer(uniqueCusNo: string) {
    console.log('In the Service → get appointments');
    const requestUrl = this.baseUrl + '/get-all-appointments/' + uniqueCusNo;            // GET /appointments

    let headers = {};
    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl, { headers: headers });
  }

    changeAssignee(data: any) {
    const requestUrl = environment.baseUrl + '/change-appointment-assignee';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.put(requestUrl,data, headers);
  }


  //load logged customer data
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

  //load logged customer's vehicles
  getVehiclesByCustomer(id: number){
     const requestUrl =
      environment.baseUrl + '/vehicles/vehicles-by-Customer/' + id.toString();

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get<any[]>(requestUrl, { headers: headers });
  }

  deleteAppointment(id: number){
    const requestUrl = environment.baseUrl + '/all-appointments/' + id.toString(); //http://localhost:8080

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.delete(requestUrl, {headers: headers});
  }
  

}
