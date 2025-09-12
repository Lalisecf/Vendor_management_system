import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-webstorage';
import { JwtAutResponsePayload } from '../utils_/payloads/Auth/jwt-aut-response-payload';
import { loginPayload } from '../utils_/payloads/Auth/login-payload';
import { registerPayload } from '../utils_/payloads/Auth/register-payload';
import { CheckUsernamePayload } from '../utils_/payloads/Auth/check-username-payload';

import { JsonPipe } from '@angular/common';
import { LogoutPayload } from '../utils_/payloads/Auth/logout-payload';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { RegisterActorPayload } from '../Admin/payloads/register_actor_payload';
import { Photo } from '../c/payload/photo';
import { UserPayload } from '../Admin/payloads/user_payload';
import { CheckEmailExistPayload } from '../Admin/payloads/admin_check_email_exist_payload';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url =
    ((window as { [key: string]: any })['cfgApiBaseUrl'] as string) +
    '/api/auth/';
  // private url = 'http://localhost:5056/api/auth/';
  localData!: JwtAutResponsePayload;
  jsonObject!: JSON;
  logoutPayload!: LogoutPayload;

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.logoutPayload = {
      browser_type: this.detectBrowserName(),
      browser_version: this.detectBrowserVersion(),
    };
  }
  isAuthenticated(): boolean {
    return this.localStorageService.retrieve('user') != null;
  }
  isRoleMulti(): boolean {
    return ((Number)(JSON.parse(
      JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
    ).length) > 1);

  }
  getRoles() {
    return JSON.parse(
      JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
    );
  }
  getroles() {
    const roles = this.localStorageService.retrieve('roles');
    console.log('Retrieved roles:', roles); // Logs the roles array
    return roles ? roles : []; // Returns the roles array or an empty array if null/undefined
  }



  //========Approver auth service===========
  isApprover(): boolean {
    for (let result of JSON.parse(
      JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
    ))
      if (result.name == 'Approver') return true;
    return false;
  }

  isChecker(): boolean {
    for (let result of JSON.parse(
      JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
    ))
      if (result.name == 'Checker') return true;
    return false;
  }
  isMaker(): boolean {
    for (let result of JSON.parse(
      JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
    ))
      if (result.name == 'Maker') return true;
    return false;
  }
  isManager(): boolean {
    for (let result of JSON.parse(
      JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
    ))
      if (result.name == 'Manager') return true;
    return false;
  }
  isDirector(): boolean {
    for (let result of JSON.parse(
      JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
    ))
      if (result.name == 'Director') return true;
    return false;
  }
  isChief(): boolean {
    for (let result of JSON.parse(
      JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
    ))
      if (result.name == 'Chief') return true;
      return false;
    }

  isFinance(): boolean {
    for (let result of JSON.parse(
      JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
    ))
      if (result.name == 'Finance') return true;
    return false;
  }
  
  isAdmin(): boolean {
    for (let result of JSON.parse(
      JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
    ))
      if (result.name == 'Admin') return true;
    return false;
  }
  testConnection(): Observable<Boolean> {
    return this.httpClient.get<Boolean>('http://localhost:5056/test1');
  }
  checkNameExist(
    checkUsernamePayload: CheckUsernamePayload
  ): Observable<Boolean> {
    return this.httpClient.get<Boolean>(
      this.url + 'check_username/' + checkUsernamePayload.username
    );
  }
  forgotPassword(email: any) {
    console.log('the email is: ' + email);
    return this.httpClient.get(this.url + 'forgot_password/' + email);
  }
  login(login_payload: loginPayload): Observable<boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };
    return this.httpClient
      .post<JwtAutResponsePayload>(
        this.url + 'login',
        login_payload,
        requestOptions
      )
      .pipe(
        map(
          (data) => {
            if (data != null) {
              if (data.user.firsttime != '1') {
                console.log('firsttime: ' + data.user.firsttime);
                console.log(
                  'here=====================1' + JSON.stringify(data, null, 2)
                );
                this.localStorageService.store('user', data.user.id);
                console.log('here=====================2');
                this.localStorageService.store('roles', data.user.roles);
                console.log('here=====================3');
                return true;
              } else {
                this.localStorageService.store('password-reset', data.user.id);
                this.router.navigateByUrl('/change-password');
                return false;
              }
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Permission',
                text: 'You are not permitted to perform this action!',
              });

              return false;
            }
          },
          (error: any) => {
            console.log('here=====================4');
            console.log('error: ' + JSON.stringify(error, null, 2));
          }
        )
      );
  }
  login_(login_payload: loginPayload): Observable<boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };
    return this.httpClient
      .post<JwtAutResponsePayload>(
        this.url + 'login_',
        login_payload,
        requestOptions
      )
      .pipe(
        map(
          (data) => {
            if (data != null) {
              if (data.user.firsttime != '1') {
                console.log('firsttime: ' + data.user.firsttime);
                console.log(
                  'here=====================1' + JSON.stringify(data, null, 2)
                );
                this.localStorageService.store('user', data.user.id);
                console.log('here=====================2');
                this.localStorageService.store('roles', data.user.roles);
                console.log('here=====================3');
                return true;
              } else {
                this.localStorageService.store('password-reset', data.user.id);
                this.router.navigateByUrl('/change-password');
                return false;
              }
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Permission',
                text: 'You are not permitted to perform this action!',
              });

              return false;
            }
          },
          (error: any) => {
            console.log('here=====================4');
            console.log('error: ' + JSON.stringify(error, null, 2));
          }
        )
      );
  }
  logout() {
    return this.httpClient.post(this.url + 'logout', this.logoutPayload);
  }
  getLoginTrial(email: any) {
    return this.httpClient.get(this.url + 'get_login_trial/' + email);
  }

  clearCookies() {
    return this.httpClient.post(this.url + 'clear-cookies', '');
  }
  logoutAll() {
    return this.httpClient.post(this.url + 'logout-all', this.logoutPayload);
  }

  detectBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase();
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }

  detectBrowserVersion() {
    var userAgent = navigator.userAgent,
      tem,
      matchTest =
        userAgent.match(
          /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
        ) || [];

    if (/trident/i.test(matchTest[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
      return 'IE ' + (tem[1] || '');
    }
    if (matchTest[1] === 'Chrome') {
      tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    matchTest = matchTest[2]
      ? [matchTest[1], matchTest[2]]
      : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = userAgent.match(/version\/(\d+)/i)) != null)
      matchTest.splice(1, 1, tem[1]);
    return matchTest.join(' ');
  }
  signUp(registerActorPayload: RegisterActorPayload): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(
        this.url + 'signup',
        registerActorPayload,
        requestOptions
      )
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }
  checkEmailExist(email: any
  ): Observable<Boolean> {
    return this.httpClient.get<Boolean>(
      this.url + 'email/' + email
    );
  }
  login_other_device_browser(email: any
  ): Observable<Boolean> {
    return this.httpClient.get<Boolean>(
      this.url + 'login_other_device_browser/' + email
    );
  }
  photo(

  ): Observable<Photo> {
    return this.httpClient.get<Photo>(
      this.url + 'photo'
    );
  }
  capture(webcamImage: any): Observable<Boolean> {
    return this.httpClient
      .post<Boolean>(
        this.url + 'capture',
        webcamImage,
        // {
        //   headers: {
        //     'Content-Type': 'text/plain;charset=UTF-8'
        //   }
        // }
      );
  }
  profile(photo: FormData): Observable<Boolean> {
    return this.httpClient
      .post<Boolean>(
        this.url + 'profile',
        photo,
        //{
        //   headers: {
        //     'Content-Type': 'multipart/form-data'
        //   }
        // }
      );
  }
  detail(

  ): Observable<UserPayload> {
    return this.httpClient.get<UserPayload>(
      this.url + 'user_detail'
    );
  }
  update_user_detail(user_payload: UserPayload): Observable<Boolean> {
    return this.httpClient
      .post<Boolean>(
        this.url + 'update_user_detail',
        user_payload,
        // {
        //   headers: {
        //     'Content-Type': 'text/plain;charset=UTF-8'
        //   }
        // }
      );
  }
  getEmail(

  ): Observable<CheckEmailExistPayload> {
    return this.httpClient.get<CheckEmailExistPayload>(
      this.url + 'getEmail'
    );
  }

}
