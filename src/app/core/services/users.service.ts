import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { ConstantsService } from './constants.service';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Account, PersonalDetail, AddressDetail, ContactDetail,DocumentDetail} from '../models/account';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

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

  fetchUserInfo = () => {
  //  return this.http.get(this.apiUrl+'bookTickets')
  return this.http.get(this.apiUrl+'api/account/profile')  
  .pipe(map(data => {
                 console.log('Data received for account profile: '+JSON.stringify(data));
				 return data;
               }))
			   
  }
  
  
  fetchUserInfo_temp = () => {
    return this.http.get("/assets/anc.json")
	.pipe(map(data => {
                 console.log('Data received for account profile: '+JSON.stringify(data));
				 return data;
               }))
  }
  


  fetchUserInfo_account = () => {
    return this.http.get("/assets/user_info.json")
	.pipe(map(data => {
           //      console.log('Data received for account profile: '+JSON.stringify(data));
				 return data;
               }))
	}

  
 
  fetchUserInfo_item = () => {
    return this.http.get("/assets/acct.json")
	.pipe(map(data => {
                 console.log('Data received for account profile: '+JSON.stringify(data));
				 return data;
               }))
	}

  
  fetchAccountInfo_temp = () => {
    return this.http.get("/assets/acct.json")
    .pipe(map(data => {
      console.log('Data received for account profile: '+JSON.stringify(data));
      return data;
    }))
  }


  
  
   fetchUserInfo_fm_temp = () => {
    return this.http.get(this.apiUrl+'api/myFamily/Personal')
     .pipe(map(data => {
                 console.log('Data received for account profile: '+JSON.stringify(data));
				 return data;
               }))
	}
	
   fetchUserInfo_Acct_temp = () => {
     console.log(this.apiUrl+'api/myAccount/PersonalDetail');
    return this.http.get(this.apiUrl+'api/myAccount/PersonalDetail')
     .pipe(map(data => {
                 console.log('Data received for account profile: '+JSON.stringify(data));
				 return data;
               }))
	}
   
    fetchFamilyMembers_temp = ()=>{
    return this.http.get(this.apiUrl+'api/myFamily/members')
               .pipe(map(data => {
                // console.log('Data received for my family: '+JSON.stringify(data));
                 return data;
               }))
			   }

  fetchFamilyMembers=()=>{
    return this.http.get(this.apiUrl+'api/myfamily/members')
               .pipe(map(data => {
                 console.log('Data received for my family: '+JSON.stringify(data));
                 return data;
               }))
  }

  fetchFamilyMemberList=()=>{
    return this.http.get(this.apiUrl+'api/myFamily/getfammemberlist')
               .pipe(map(data => {
                 return data;
               }))
  }
  

  fetchNomineesFamilyMember=()=>{
    return this.http.get(this.apiUrl+'api/nominee/familymembers')
               .pipe(map(data => {
                 console.log('Data received for my nominee: '+JSON.stringify(data));
                 return data;
               }))
  }

  fetchNominees=()=>{
    return this.http.get(this.apiUrl+'api/nominee/members')
               .pipe(map(data => {
                 console.log('Data received for my nominee: '+JSON.stringify(data));
                 return data;
               }))
  }


fetchUtilityList=()=>{
  return this.http.get(this.apiUrl+'api/utility/members')
               .pipe(map(data => {
                // console.log('Utility List received : '+JSON.stringify(data));
                 return data;
               }))
}

  saveUserInfo = (form: String, data:PersonalDetail | AddressDetail | ContactDetail) => {
    let formUrl = '';
    switch (form) {
      case 'personalDetailsForm':
        formUrl = 'api/account/personal-details';
        break;
      case 'addressDetailsForm':
        formUrl = 'api/account/address-details';      
        break;
      case 'contactDetailsForm':
        formUrl = 'api/account/contact-details';      
        break;
      default:
        break;
    }

    

    return this.http.put(this.apiUrl+formUrl, data, {responseType: 'text'})
               .pipe(map(data => {
                 console.log('Data received after saving the users form: %s<<>>%s',formUrl, JSON.stringify(data));
                 return data;
               }))
  }

  saveUserInfoMyFamily = (form: String, data:PersonalDetail|AddressDetail|ContactDetail|DocumentDetail) => {
    let formUrl = '';
    console.log(data)
    switch (form) {
      case 'personalDetailsForm':
        formUrl = 'api/myFamily/personalDetail';
        break;
      case 'addressDetailsForm':
        formUrl = 'api/myFamily/addressDetail';      
        break;
      case 'contactDetailsForm':
        formUrl = 'api/myFamily/contactDetail';      
        break;
      case 'docDetailsForm':
        formUrl = 'api/myfamily/document-details';      
        break;
      default:
        break;
    }

    

    return this.http.put(this.apiUrl+formUrl, data, {responseType: 'text'})
               .pipe(map(data => {
                console.log('Data received after saving the users form: %s<<>>%s',formUrl, JSON.stringify(data));
                 return data;
               }))
  }

  saveUserbankinfo = (form: String, data:PersonalDetail|AddressDetail|ContactDetail|DocumentDetail) => {
    let formUrl = '';
    console.log(data)
    switch (form) {
      case 'AboutBanksForm':
        formUrl = 'api/items/aboutTheBank';
        break;
      case 'PersonalDetails':
        formUrl = 'api/myFamily/personalDetail';
        break;
      case 'AddressDetailsForm':
        formUrl = 'api/myFamily/addressDetail';      
        break;
      case 'EmailDetailsForm':
        formUrl = 'api/myFamily/EmailDetail';      
        break;
      case 'PhoneDetailsForm':
          formUrl = 'api/myFamily/PhoneDetail';      
        break;
      case 'docDetailsForm':
        formUrl = 'api/myFamily/document-details';      
        break;
      case 'AdditionalDetailForm':
        formUrl = 'api/myFamily/AdditionalInfo';
        break;
      default:
        break;
    }

    return this.http.put(this.apiUrl+formUrl, data, {responseType: 'text'})
               .pipe(map(data => {
                console.log('Data received after saving the users form: %s<<>>%s',formUrl, JSON.stringify(data));
                 return data;
               }))
  }

  saveUserInfoMyFamily_temp = (form: String, data:PersonalDetail|AddressDetail|ContactDetail|DocumentDetail) => {
    let formUrl = '';
    console.log(data)
    switch (form) {
      case 'PersonalDetailsForm':
        formUrl = 'api/myFamily/personalDetail';
        break;
      case 'AddressDetailsForm':
        formUrl = 'api/myFamily/addressDetail';      
        break;
      case 'EmailDetailsForm':
        formUrl = 'api/myFamily/EmailDetail';      
        break;
      case 'PhoneDetailsForm':
          formUrl = 'api/myFamily/PhoneDetail';      
        break;
      case 'docDetailsForm':
        formUrl = 'api/myFamily/document-details';      
        break;
      case 'AdditionalDetailForm':
        formUrl = 'api/myFamily/AdditionalInfo';
      break;
      default:
        break;
    }
  

    return this.http.put(this.apiUrl+formUrl, data, {responseType: 'text'})
               .pipe(map(data => {
                console.log('Data received after saving the users form: %s<<>>%s',formUrl, JSON.stringify(data));
                 return data;
               }))
  }
  
  
    saveUserInfo_temp = (form: String, data:PersonalDetail|AddressDetail|ContactDetail|DocumentDetail) => {
    let formUrl = '';
    console.log(data)
    switch (form) {
      case 'PersonalDetailsForm':
        formUrl = 'api/myAccount/personalDetail';
        break;
      case 'AddressDetailsForm':
        formUrl = 'api/myAccount/addressDetail';      
        break;
      case 'EmailDetailsForm':
        formUrl = 'api/myAccount/emailDetail';      
        break;
      case 'PhoneDetailsForm':
          formUrl = 'api/myAccount/phoneDetail';      
        break;
    }
   console.log(this.apiUrl+formUrl);

    return this.http.put(this.apiUrl+formUrl, data, {responseType: 'text'})
               .pipe(map(data => {
                console.log('Data received after saving the users form: %s<<>>%s',formUrl, JSON.stringify(data));
                 return data;
               }))
  }

  saveUserInfoMyNominee_temp = (form: String, data:PersonalDetail|AddressDetail|ContactDetail|DocumentDetail) => {
    let formUrl = '';
    console.log(data)
    switch (form) {
      case 'PersonalDetailsForm':
        formUrl = 'api/nominee/personalDetail';
        break;
      case 'AddressDetailsForm':
        formUrl = 'api/nominee/addressDetail';      
        break;
        case 'EmailDetailsForm':
          formUrl = 'api/nominee/emailDetail';      
          break;
        case 'PhoneDetailsForm':
            formUrl = 'api/nominee/phoneDetail';      
          break;
      case 'docDetailsForm':
        formUrl = 'api/myfamily/document-details';      
        break;
     case 'AdditionalDetailForm':
          formUrl = 'api/nominee/AdditionalInfo';
     break;
      default:
        break;
    }
   

    return this.http.put(this.apiUrl+formUrl, data, {responseType: 'text'})
               .pipe(map(data => {
                console.log('Data received after saving the users form: %s<<>>%s',formUrl, JSON.stringify(data));
                 return data;
               }))
  }

  saveUserInfoMyNominee = (form: String, data:PersonalDetail|AddressDetail|ContactDetail|DocumentDetail) => {
    let formUrl = '';
    console.log(data)
    switch (form) {
      case 'personalDetailsForm':
        formUrl = 'api/mynominee/personal-details';
        break;
      case 'addressDetailsForm':
        formUrl = 'api/mynominee/address-details';      
        break;
      case 'contactDetailsForm':
        formUrl = 'api/mynominee/contact-details';      
        break;
      case 'docDetailsForm':
        formUrl = 'api/mynominee/document-details';      
        break;
      default:
        break;
    }

    

    return this.http.put(this.apiUrl+formUrl, data, {responseType: 'text'})
               .pipe(map(data => {
                 console.log('Data received after saving the users form: %s<<>>%s',formUrl, JSON.stringify(data));
                 return data;
               }))
  }


  saveUser = (form: String, data: any ) => {

    console.log(data);
    return this.http.put("/assets/a.json", data, {responseType: 'text'})
    .pipe(map(data => {
      console.log('Data received after saving the users form: %s<<>>%s',"/assets/a.json", JSON.stringify(data));
      return data;
    }))

  }

  saveDocuments=(data:FormData)=>{
    let formUrl = 'api/myFamily/uploadFile';
    return this.http.put(this.apiUrl+formUrl, data, {responseType: 'text'})
               .pipe(map(data => {
                 console.log('Data received after saving the users form: %s<<>>%s',formUrl, JSON.stringify(data));
                 return data;
               }))
  }

  saveDocumentsNominee=(data:FormData)=>{
    let formUrl = 'api/nominee/uploadFile';
    return this.http.put(this.apiUrl+formUrl, data, {responseType: 'text'})
               .pipe(map(data => {
                 console.log('Data received after saving the users form: %s<<>>%s',formUrl, JSON.stringify(data));
                 return data;
               }))
  }

  saveDocumentsValitems=(data:FormData)=>{
    let formUrl = 'api/valueitem/uploadFile';
    return this.http.put(this.apiUrl+formUrl, data, {responseType: 'text'})
               .pipe(map(data => {
                 console.log('Data received after saving the users form: %s<<>>%s',formUrl, JSON.stringify(data));
                 return data;
               }))
  }


  downloadFiles = (documentId : string) => {
    return this.http.get(this.apiUrl+'api/myFamily/download/'+documentId , {responseType: 'arraybuffer'})
  }

  removeId = (form: string,requiredId: string) => {

    let formUrl = '';
    switch (form) {
      case 'PersonalDetailsForm':
        formUrl = this.apiUrl+'api/myFamily/removeIndividualDetail/';
        break;
      case 'AddressDetailsForm':
        formUrl = this.apiUrl+'api/myFamily/removeAddressDetail/';      
        break;
      case 'EmailDetailsForm':
        formUrl = this.apiUrl+'api/myFamily/removeEmailDetail/';      
        break;
      case 'PhoneDetailsForm':
          formUrl = this.apiUrl+'api/myFamily/removePhoneDetail/';      
      break;
      case 'DocDetailsForm':
        formUrl = this.apiUrl+'api/myFamily/removeDocumentDetail/';      
        break;
        case 'PersonalDetailsFormNominee':
          formUrl = this.apiUrl+'api/nominee/removeIndividualDetail/';
          break;
        case 'AddressDetailsFormNominee':
          formUrl = this.apiUrl+'api/nominee/removeAddressDetail/';      
          break;
        case 'EmailDetailsFormNominee':
          formUrl = this.apiUrl+'api/nominee/removeEmailDetail/';      
          break;
        case 'PhoneDetailsFormNominee':
            formUrl = this.apiUrl+'api/nominee/removePhoneDetail/';      
        break;
        case 'DocDetailsFormNominee':
          formUrl = this.apiUrl+'api/nominee/removeDocumentDetail/';      
          break;
      default:
        break;
    }

    return this.http.put(formUrl + requiredId , requiredId, {responseType: 'text'})
    .pipe(map(data => {
      console.log('Data received after saving the users form:%s', JSON.stringify(data));
      return data;
    }))
  }

  fetchAddressForPostCode = (postCode : string) => {
  // return this.http.get("/assets/AddressList.json")
     return this.http.get(this.apiUrl+'api/address/search/'+postCode)
        .pipe(map(data => {
           //console.log('Data received from API for postal code search: '+JSON.stringify(data));
          return data;
        }))
  }

  fetchBankAccountList=()=>{
    return this.http.get(this.apiUrl+'api/myAccount/bankaccntdtl')
                 .pipe(map(data => {
                  // console.log('Utility List received : '+JSON.stringify(data));
                   return data;
                 }))
  }

  fetchBankLookUpList=()=>{
    return this.http.get(this.apiUrl+'api/utility/banklookup')
                 .pipe(map(data => {
                  // console.log('Utility List received : '+JSON.stringify(data));
                   return data;
                 }))
  }


}
