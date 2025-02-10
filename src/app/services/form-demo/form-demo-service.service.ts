import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class FormDemoServiceService {

  constructor( private http:HttpClient , private httpService : HttpService ) { }
/**httpclient
 * (GET, POST , PUT , DELETE)
 */
  serviceCall(form_details: any){
    //console.log('In the Service');

    const requestUrl = environment.baseUrl + '/form-demo'; //http://localhost:8080

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.post(requestUrl, form_details, {headers: headers});

  }

  getData(){
    console.log('In the Service');
    const requestUrl = environment.baseUrl + '/form-demo'; //http://localhost:8080

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl, headers);

  }

  editData(id: number , form_details: any){
    const requestUrl = environment.baseUrl + '/form-demo/' + id.toString(); //http://localhost:8080

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.put(requestUrl, form_details, {headers: headers});
  }

  deleteData(id: number){
    const requestUrl = environment.baseUrl + '/form-demo/' + id.toString(); //http://localhost:8080

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.delete(requestUrl, {headers: headers});
  }
}
