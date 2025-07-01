import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../http.service';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GRNServiceService {

  constructor(private http:HttpClient, private httpService:HttpService) { }

  innerEditData(id: number, form_details: any) {
    const requestUrl = environment.baseUrl + '/innergrn/' + id.toString(); //'http://localhost:8080/grn/3'
    //get authtoken and set it to header
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.put(requestUrl,form_details,{headers:headers});
  }


  editDataOuterForm(id: number, form_details: any) {
    const requestUrl = environment.baseUrl + '/outeredit/' + id.toString(); //'http://localhost:8080/grn/3'
    //get authtoken and set it to header
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.put(requestUrl,form_details,{headers:headers});
  }






  deleteDataOuter(id: number){
    console.log("delete data" + id);

    const requestUrl = environment.baseUrl + '/deleteOuter/' + id.toString(); //'http://localhost:8080/form-demo'

    //get authtoken and set it to header
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

     return this.http.delete(requestUrl,{headers:headers});
  }




  //get all GRN
  getData() {
    console.log("get data");

    const requestUrl = environment.baseUrl + '/allgrn'; //'http://localhost:8080/form-demo'

    //get authtoken and set it to header
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl,{headers:headers});
  }

  //stock update
  stockUpdate(item_list: any) {

    const requestUrl = environment.baseUrl + '/stockupdate';//localhost:8080/grn/3'
    //get authtoken and set it to header
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.put(requestUrl,item_list,{headers:headers});
  }

    //stock update
    stockUpdateEdit(item_list: any) {

      const requestUrl = environment.baseUrl + '/stockupdateEdit';
      let headers = {};

      if (this.httpService.getAuthToken() !== null) {
        headers = {
          Authorization: 'Bearer ' + this.httpService.getAuthToken(),
        };
      }

      return this.http.put(requestUrl,item_list,{headers:headers});
    }


  serviceCallPost(form_details:any){
    console.log("service call");

    const requestUrl = environment.baseUrl + '/grn'; //'http://localhost:8080/grn'

    //get authtoken and set it to header
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.post(requestUrl,form_details,{headers:headers});
  }

  serviceCallPostInner(form_details:any){

    const requestUrl = environment.baseUrl + '/inner'; //'http://localhost:8080/inner'

    //get authtoken and set it to header
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.post(requestUrl,form_details,{headers:headers});
  }



  getGRNs() {
    console.log("get data");

    const requestUrl = environment.baseUrl + '/grn'; //'http://localhost:8080/grn'

    //get authtoken and set it to header
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }
    return this.http.get(requestUrl,{headers:headers});
  }


 getQty(itemID:number) {
    console.log("get data");

    const requestUrl = environment.baseUrl + '/getQty/'+ itemID.toString(); //'http://localhost:8080/form-demo'

    //get authtoken and set it to header
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }
    return this.http.get(requestUrl,{headers:headers});
  }



  getItem(){
    console.log("get items");

    const requestUrl = environment.baseUrl + '/grn/get-item'; //'http://localhost:8080/grn/get-item'

    //get authtoken and set it to header
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl,{headers:headers});
  }

  getSuppliers(){
    console.log("get suppliers");

    const requestUrl = environment.baseUrl + '/grn/get-suppliers'; //'http://localhost:8080/grn/get-suppliers'

    //get authtoken and set it to header
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl,{headers:headers});
  }

  getInnerGRN(grnno:number){

    const requestUrl = environment.baseUrl + '/get-inner/' + grnno.toString(); ; //'http://localhost:8080/get-inner'

    //get authtoken and set it to header
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl,{headers:headers});
  }



  deleteInnerData(id: number){
    console.log("delete data" + id);

    const requestUrl = environment.baseUrl + '/innergrn/' + id.toString(); //'http://localhost:8080/form-demo'

    //get authtoken and set it to header
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

     return this.http.delete(requestUrl,{headers:headers});
  }

  }




