import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { ConstantsService } from './constants.service';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BankAccountDetails,PersonalDetailAccnt,AccountDetailAccnt} from '../models/account';

@Injectable({
  providedIn: 'root'
})
export class ValueItemService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private apiUrl: String;


  constructor(
    private http: HttpClient,
    private constants: ConstantsService
  ) {
    this.apiUrl = this.constants.getAPIUrl();
  //  this.apiUrl = "http://localhost:8080/";
   }

   fetchBankLookUpList=()=>{
    return this.http.get(this.apiUrl+'api/utility/banklookup')
                 .pipe(map(data => {
                  // console.log('Utility List received : '+JSON.stringify(data));
                   return data;
                 }))
  }

  fetchBankAccountList=()=>{
    return this.http.get(this.apiUrl+'api/valueitem/getBankAccntList')
                 .pipe(map(data => {
                  // console.log('Utility List received : '+JSON.stringify(data));
                   return data;
                 }))
  }

  fetchBankAccountDtls=()=>{
   
    return this.http.get(this.apiUrl+'api/valueitem/bankaccntdtl')
                 .pipe(map(data => {
                  // console.log('Utility List received : '+JSON.stringify(data));
                   return data;
                 }))
  }

  fetchBankAccountDtlFrItem=(valAccountId: String)=>{
   
    return this.http.get(this.apiUrl+'api/valueitem/bankaccntdtlforitem/'+valAccountId)
                 .pipe(map(data => {
                   return data;
                 }))
  }

  saveUserbankinfo= (form: String, data:BankAccountDetails) => {

    let formUrl = '';
    console.log(data)
    formUrl = 'api/valueitem/saveuserbankaccnt';
    return this.http.put(this.apiUrl+formUrl, data, {responseType: 'text'})
        .pipe(map(data => {
          //alert(JSON.stringify(data))
        console.log('Data received after saving the users form: %s<<>>%s',formUrl, JSON.stringify(data));
          return data;
        }))
  }

  saveUserBankPersonalinfo= (form: String, data:PersonalDetailAccnt)  => {

    let formUrl = '';
    console.log(data)
    formUrl = 'api/valueitem/savebankpersonalinfo';
    return this.http.put(this.apiUrl+formUrl, data, {responseType: 'text'})
        .pipe(map(data => {
          //alert(JSON.stringify(data))
        console.log('Data received after saving the users form: %s<<>>%s',formUrl, JSON.stringify(data));
          return data;
        }))
  }

  saveUserBankAccntDtlInfo= (form: String, data:AccountDetailAccnt)  => {

    let formUrl = '';
    console.log(data)
    formUrl = 'api/valueitem/savebankaccntdtlinfo';
    return this.http.put(this.apiUrl+formUrl, data, {responseType: 'text'})
        .pipe(map(data => {
          //alert(JSON.stringify(data))
        console.log('Data received after saving the users form: %s<<>>%s',formUrl, JSON.stringify(data));
          return data;
        }))
  }

  deleteBankAccountInfo= (valAccountId: String)  => {

    let formUrl = '';
    //alert(valAccountId)
    formUrl = 'api/valueitem/deleteBankAccountInfo/';
    return this.http.put(this.apiUrl+formUrl+valAccountId, valAccountId, {responseType: 'text'})
    .pipe(map(data => {
      console.log('Data received after saving the users form:%s', JSON.stringify(data));
      return data;
    }))
  }

  saveUserBankAccntAdditionalInfo= (form: String, data:AccountDetailAccnt)  => {

    let formUrl = '';
    console.log(data)
    formUrl = 'api/valueitem/savebankaccntaddinfo';
    return this.http.put(this.apiUrl+formUrl, data, {responseType: 'text'})
        .pipe(map(data => {
          //alert(JSON.stringify(data))
        console.log('Data received after saving the users form: %s<<>>%s',formUrl, JSON.stringify(data));
          return data;
        }))
  }



}
