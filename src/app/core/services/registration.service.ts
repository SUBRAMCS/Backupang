import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from './constants.service';
import { map, catchError } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private showPwdHints: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public showPwdHints$ = this.showPwdHints.asObservable();

  constructor(
    private http: HttpClient,
    private constants: ConstantsService
    ) {

  }

  register = (user: User) => {
    
    const {baseUrl} = this.constants.getConfig();
    //console.log('user.dateOfBirth.getTimezoneOffset()',user.dateOfBirth.getTimezoneOffset())
    user.dateOfBirth.setTime(user.dateOfBirth.getTime()-user.dateOfBirth.getTimezoneOffset()*60*1000);
    //console.log("User provided for registration: "+JSON.stringify(user));
     console.log(baseUrl);
      return this.http.post(baseUrl+`api/users/register`, user, {responseType: 'text'})
          .pipe(map(token => {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              sessionStorage.setItem('rgnToken', token);
          }));
  }

  togglePwdHints = () => {
    this.showPwdHints.next(!this.showPwdHints.value);
  }

  fetchEmailIds= () => {
    const {baseUrl} = this.constants.getConfig();
    return this.http.get(baseUrl+`api/users/fetchAllUsers`)
        //.delay(1000)
        .pipe(map(data => {
           //console.log('Data received from API for fetchEmailIds: '+JSON.stringify(data));
          return data;
        }))
  }

}
