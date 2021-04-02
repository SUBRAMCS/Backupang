import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { ConstantsService } from './constants.service';
import * as process from 'process';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  

  constructor(
    private http: HttpClient,
    private constants: ConstantsService
    ) {
      this.currentUserSubject = new BehaviorSubject(sessionStorage.getItem('toeknId') === null ? "" : JSON.parse(sessionStorage.getItem('tokenId')));
      this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
      return this.currentUserSubject.value;
  }

  login(username, password,captchaResp) {
    const {baseUrl} = this.constants.getConfig();
      return this.http.post<any>(baseUrl+`api/users/authenticate`, { username, password, "recaptchaResponse": captchaResp })
          .pipe(map(data => {
            const {tokenId, username} = data
              sessionStorage.setItem('tempToken', JSON.stringify(tokenId));
              sessionStorage.setItem('tokenId', JSON.stringify(tokenId));
              this.currentUserSubject.next(tokenId);
              return of();
          }),
          catchError((err, caught) => {
            return throwError(err.error);
          }));
  }

  validateOTP(otp) {
    const {baseUrl} = this.constants.getConfig();
      return this.http.post<any>(baseUrl+`api/otp/otpConfirm`, { "otpNo":otp })
          .pipe(map(data => {
              const {status} = data;
              if(status === 'success') {
                sessionStorage.removeItem('tempToken');
                return of();
              } 
          }));
  }

  resendOTP = () => {
    const {baseUrl} = this.constants.getConfig();
    return this.http.get(baseUrl+`api/otp/resend`)
               .pipe(map(data => {
                 console.log("Response received from service: "+data);
               }))
  }

  validateToken(token) {
    const {baseUrl} = this.constants.getConfig();
    return this.http.get(baseUrl+`api/users/confirm-account?token=`+token,{responseType: 'text'})
          .pipe(map(data => {
            console.log("Response from tokenVerification :" + data)
              return data;
          }));
  }

  resetPwd(email) {
    const {baseUrl} = this.constants.getConfig();
    return this.http.post(baseUrl+`api/users/forgotPassword`, { email },{responseType: 'text'})
          .pipe(map(data => {
              return data;
          }));
  }

  changePwd(rpwd,cpwd, token) {
    const {baseUrl} = this.constants.getConfig();
    return this.http.post(baseUrl+`api/users/resetPassword`, { "token": token, "password": rpwd, "confirmPassword": cpwd },{responseType: 'text'})
          .pipe(map(data => {
              return data;
          }));
  }

  getUname(user: User) {
    const {baseUrl} = this.constants.getConfig();
    const {dateOfBirth, lastName, motherMaidenName} = user;
    return this.http.post(baseUrl+`api/users/forgotLogin`, { "dateOfBirth": dateOfBirth, "lastName": lastName, "motherMaidenName": motherMaidenName }, {responseType: 'text'})
          .pipe(map(data => {
              console.log('Response received on forgot username: '+JSON.stringify(data));
              return data;
          }));
  }

  logout() {
      // remove user from local storage and set current user to null
      sessionStorage.removeItem('tokenId');
      this.currentUserSubject.next(null);
      return of(true);
  }

  verifySuccessLogin() {
    if(sessionStorage.getItem('tempToken') == null && 
      sessionStorage.getItem('tokenId') != null && 
      sessionStorage.getItem('tokenId') != undefined) {
      return of(true);
    } else {
      return throwError(false);
    }

  }
}
