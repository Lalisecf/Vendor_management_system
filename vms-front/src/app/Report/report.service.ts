import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { paymentReport } from './payload/payment-report';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private url = (window as { [key: string]: any })["cfgApiBaseUrl"] as string + '/api/report/';

  constructor(private httpClient: HttpClient) { }

  paymentReport(): Observable<Array<paymentReport>> {
    return this.httpClient.get<Array<paymentReport>>(this.url + 'payment-report');
  }

}
