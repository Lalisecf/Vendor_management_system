import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterActorPayload } from 'src/app/Admin/payloads/register_actor_payload';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  private url = (window as { [key: string]: any })["cfgApiBaseUrl"] as string + '/api/auth/';
  constructor(private httpClient: HttpClient) {}
  
  checkAccessTokenDoesNotExpired() {
    return this.httpClient.post<Boolean>(this.url + 'token-not-expired', '');
  }
  refreshToken() {
    return this.httpClient.get<Boolean>(this.url + 'refresh-token');
  }
  handleTokenExpired(error: any): Boolean {
    console.log('checking if access token is expired');
    var res = false;
    return res;
  }

}
