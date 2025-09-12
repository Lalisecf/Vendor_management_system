import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { contract } from 'src/app/Maker/Payloads/contract';
import { Product } from 'src/app/Maker/Payloads/product';
import { Remark } from 'src/app/Maker/Payloads/remark';
import { services } from 'src/app/Maker/Payloads/services';
import { Vendors } from 'src/app/Maker/Payloads/vendors';

@Injectable({
  providedIn: 'root'
})
export class CheckerService {
  private url = (window as { [key: string]: any })["cfgApiBaseUrl"] as string + '/api/checker/';
  constructor(private httpClient: HttpClient) { }


  getAllVendors(): Observable<Array<Vendors>> {
    return this.httpClient.get<Array<Vendors>>(this.url + 'get_all_vendors');
  }

  RejectVendorRequest(vendor_id: any, remark: Remark): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(this.url + 'reject_request/' + vendor_id, remark, requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }
  AcceptVendorRequest(id: any, remark: Remark, type: any): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      params: { type: type },
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(this.url + 'accept_request/' + id, remark, requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }
  getRemark(id: number): Observable<Array<Remark>> {
    return this.httpClient.get<Array<Remark>>(
      this.url + 'get-remark/' + id
    );
  }
  VendorRemark(vendor_id: any, remark: Remark): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(this.url + 'vendor_remark/' + vendor_id, remark, requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }
  updateRemark(remark_id: any, remark: Remark): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(this.url + 'update_your_remark/' + remark_id, remark, requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }

  deleteRemark(remark_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(
      this.url + 'delete_remark/' + remark_id
    );
  }
  getRemarkById(id: any) {
    return this.httpClient.get<Remark>(
      this.url + 'get_remark_byId/' + id
    );
  }

  ApproveVendor(vendor_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(
      this.url + 'approve_vendor/' + vendor_id
    );
  }

  rejectVendor(vendor_id: any, remark: Remark): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(this.url + 'reject_vendor/' + vendor_id, remark, requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }
  getReason(id: any, type: any): Observable<Remark> {
    return this.httpClient.get<Remark>(this.url + 'get_reason/' + id,
      { params: { type: type } });
  }

  getEditedVendorId(vendor_id: any): Observable<Vendors> {
    return this.httpClient.get<Vendors>(
      this.url + 'get_vendor_id/' + vendor_id
    );
  }

  ApproveContract(contract_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(
      this.url + 'approve_contract/' + contract_id
    );
  }

  RejectContractRequest(contract_id: any, remark: Remark, reason: any): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      params: { reason: reason },
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(this.url + 'reject_contract/' + contract_id, remark, requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }

  contractRemark(contract_id: any, remark: Remark): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(this.url + 'contract_remark/' + contract_id, remark, requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }

  getContractRemark(id: number): Observable<Array<Remark>> {
    return this.httpClient.get<Array<Remark>>(
      this.url + 'get-contract-remark/' + id
    );
  }

  getextend_renewal_for_approved(contract_id: any): Observable<Array<contract>> {
    return this.httpClient.get<Array<contract>>(
      this.url + 'get_extend_or_renew_contract/' + contract_id
    );
  }

  approvePayment(payment_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(this.url + 'approve_payment/' + payment_id);
  }

  getCheckerNotification(): Observable<Array<Remark>> {
    return this.httpClient.get<Array<Remark>>(
      this.url + 'get-notification'
    );
  }
}


