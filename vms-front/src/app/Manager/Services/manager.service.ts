import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http'; // Import HttpClient
import { BehaviorSubject, map, Observable } from 'rxjs'; // Import BehaviorSubject and Observable
import { requestedPayments } from '../payloads/requestedPayments';
import { payments } from 'src/app/Maker/Payloads/payments';
import { Remark } from 'src/app/Maker/Payloads/remark';
import { file_table } from '../payloads/file_table';
import { addendum_payments } from '../payloads/addendum_payments';
import { PaymentHistory } from '../payloads/payment-history';


@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  private SearchSource = new BehaviorSubject<string>("");
  Search$ = this.SearchSource.asObservable();

  private abcSource = new BehaviorSubject<string>("Select-Type");
  abc$ = this.abcSource.asObservable();

  // Make sure the URL is constructed correctly.
  private url = (window as { [key: string]: any })["cfgApiBaseUrl"] + '/api/manager/';
  public downloadUrl: string = '';

  constructor(private httpClient: HttpClient) { }



  getRequestedPaymentDetail(): Observable<Array<requestedPayments>> {
    return this.httpClient.get<Array<requestedPayments>>(this.url + 'get-requested-payments');
  }
  getPaymentHistory(): Observable<Array<PaymentHistory>> {
    return this.httpClient.get<Array<PaymentHistory>>(this.url + 'get-payments-history');
  }
  getRequestedAddendumPaymentDetail(): Observable<Array<requestedPayments>> {
    return this.httpClient.get<Array<requestedPayments>>(this.url + 'get-requested-addendum-payments');
  }
  // getRequestedPaymentDetail(status: any): Observable<Array<requestedPayments>> {
  //   console.log('id-status: ' + status);
  //   return this.httpClient.get<Array<requestedPayments>>(
  //     this.url + 'get-requested-payments/' + status
  //   );
  // }

  getPaymentById(payment_id: any): Observable<payments> {
    console.log('id-pay: ' + payment_id);
    return this.httpClient.get<payments>(
      this.url + 'get-payments/' + payment_id
    );
  }
  getAddendumPaymentById(payment_id: any): Observable<addendum_payments> {
    console.log('id-pay: ' + payment_id);
    return this.httpClient.get<addendum_payments>(
      this.url + 'get-addendum-payments/' + payment_id
    );
  }

  getRequestedPaymentDoc(payment_id: any): Observable<Array<file_table>> {
    console.log('id: ' + payment_id);
    return this.httpClient.get<Array<file_table>>(
      this.url + 'get-payments-Doc/' + payment_id
    );
  }
  downloadPaymenttFiles(id: any): Observable<HttpEvent<Blob>> {
    this.downloadUrl = `${this.url}download-payment-file/`;
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    return this.httpClient.get(`${this.downloadUrl}${id}`, {
      headers: headers,
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
  }




  approvePayment(payment_id: any): Observable<Boolean> {
    console.log('payment_iddddd: ' + payment_id);
    return this.httpClient.get<Boolean>(this.url + 'approve_payment/' + payment_id);
  }


  RejectPaymentRequest(payment_id: any, remark: Remark, reason: any): Observable<Boolean> {
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
      .post<Boolean>(this.url + 'reject_payment/' + payment_id, remark, requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }

  RejectAddendumPaymentRequest(payment_id: any, remark: Remark, reason: any): Observable<Boolean> {
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
      .post<Boolean>(this.url + 'reject_Addendum_payment/' + payment_id, remark, requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }
  approveAddendumPayment(payment_id: any): Observable<Boolean> {
    console.log('payment_iddddd: ' + payment_id);
    return this.httpClient.get<Boolean>(this.url + 'approve_addendum_payment/' + payment_id);
  }

  setPaymentSearch(value: string) {
    this.SearchSource.next(value);
    console.log('jjjjjjjjjjjjjjjkkkkkkkkkkkkkkkkkkkkkkkkffffffffffffffffffff ' + value)
  }
  getManagerDashboardData(): Observable<any> {
    return this.httpClient.get<Observable<any>>(this.url + 'getManagerData');
  }
  getManagerDetailDashboardData(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.url}getManagerDetailData?id=${id}`);
  }


  // getManagerNotification(): Observable<Array<Remark>> {
  //   return this.httpClient.get<Array<Remark>>(
  //     this.url + 'get-notification'
  //   );
  // }
  setVendorSearch(value: string) {
    this.SearchSource.next(value);
    console.log('Vendor search updated with value: ' + value);
  }

}
