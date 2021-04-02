import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsersService } from 'src/app/core/services/users.service';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { ValidatorService } from 'src/app/core/validators/validator.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-acct-nomination',
  templateUrl: './acct-nomination.component.html',
  styleUrls: ['./acct-nomination.component.css']
})
export class AcctNominationComponent implements OnInit {

 userInfo: any | Account = {};
  personalDetailsForm: FormGroup;
  addressDetailsForm: FormGroup;
  contactDetailsForm: FormGroup;
  docDetailsForm:FormGroup;
  showAddressForm: boolean = false;
  showPCAddressForm: boolean = false;
  addressList = [];
  pfStatusMsgHide: boolean = true;
  afStatusMsgHide: boolean = true;
  cfStatusMsgHide: boolean = true;
  dfStatusMsgHide: boolean = true;
  enableInputs:boolean=false;
  maxDate:Date = null;
  minDate:Date=null;
  individualId:number;
  nomineeMap={};
  nomineeMapKeysLs=[];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private usersService: UsersService,
    private validatorService: ValidatorService
  ) {
    this.userInfo.accountProfileId = null;
    this.userInfo.individualId = null;
    this.userInfo.registrationId = null;
    this.userInfo.personalDetail = null;
    this.userInfo.addressDetail = null;
    this.userInfo.contactDetail = null;
    this.userInfo.docDetail=null;
  }

  ngOnInit() {

    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear()-18);
    this.maxDate.setMonth(this.maxDate.getMonth());
    this.maxDate.setDate(this.maxDate.getDate());

    
    this.minDate = new Date();
    this.minDate.setFullYear(this.minDate.getFullYear()-100);
    this.minDate.setMonth(this.minDate.getMonth());
    this.minDate.setDate(this.minDate.getDate()+1);

    this.initForms();
    //Populate the form for logged-in user
    //this.fetchUserInfo();
    this.fetchNominees();
   

  }

  initForms(){
    //Initialize personal details form
    this.initPersonalDetailsForm();

    //Initialize address details form
    this.initAddressDetailsForm();

    //Initialize contact details form
    this.initContactDetailsForm();

    //Initialize documents form
    this.initDocDetailsForm();
  }

    // convenience getter for easy access to form fields
    get pf() {
      return this.personalDetailsForm.controls;
    }
    get af() {
      return this.addressDetailsForm.controls;
    }
    get cf() {
      return this.contactDetailsForm.controls;
    }
    get df(){
      return this.docDetailsForm.controls;
    }

    panelClk(param:string){
     
      this.initForms();
      this.hideFormStatusMsg();
      console.log(param,this.nomineeMap[param]);
      if('newNomineeMem'!==param && this.nomineeMap[param].individualId!=null){
        this.individualId=parseInt(param);
        this.userInfo=this.nomineeMap[param];
        this.personalDetailsForm.patchValue(this.userInfo.personalDetail != null ? this.userInfo.personalDetail : {});
        this.addressDetailsForm.patchValue(this.userInfo.addressDetail != null ? this.userInfo.addressDetail : {});
        this.contactDetailsForm.patchValue(this.userInfo.contactDetail != null ? this.userInfo.contactDetail : {});
        this.docDetailsForm.patchValue(this.userInfo.docDetail != null ? this.userInfo.docDetail : {});
        this.enableInputs=false;
      }
      else if('newNomineeMem'!==param && this.nomineeMap[param].individualId==null){
        this.individualId=parseInt(param);
        this.userInfo=this.nomineeMap[param];
        let emailLs=this.nomineeMap[param].emails;
        let contactDetails={};
        for(let x in emailLs){
          if(emailLs[x].primaryEmailFlag==="Y")
          {
            contactDetails['primaryEmailAddress']=emailLs[x].emailAddress;
            contactDetails['primaryEmailId']=emailLs[x].emailId;
          }else{
            contactDetails['secondaryEmailAddress']=emailLs[x].emailAddress;
            contactDetails['secondaryEmailId']=emailLs[x].emailId;
          }
        }
        let phoneLs=this.nomineeMap[param].phones;
        for(let x in phoneLs){
          if(phoneLs[x].primaryPhoneFlag==="Y")
          {
            contactDetails['primaryPhoneNumber']=phoneLs[x].phoneNumber;
            contactDetails['primaryPhoneId']=phoneLs[x].phoneId;
            contactDetails['primaryCountryCode']='044';
          }else{
            contactDetails['secondaryPhoneNumber']=phoneLs[x].phoneNumber;
            contactDetails['secondaryPhoneId']=phoneLs[x].phoneId;
            contactDetails['secondaryCountryCode']='044';
          }
        }
        this.userInfo.contactDetail=contactDetails;
        this.personalDetailsForm.patchValue(this.userInfo.personalDetail != null ? this.userInfo.personalDetail : {});
        this.addressDetailsForm.patchValue(this.userInfo.addressDetail != null ? this.userInfo.addressDetail : {});
        this.contactDetailsForm.patchValue(this.userInfo.contactDetail != null ? this.userInfo.contactDetail : {});
        this.docDetailsForm.patchValue(this.userInfo.document != null ? this.userInfo.document : {});
        this.enableInputs=true;
      }
      else{
      this.enableInputs=true;
      }
    }

    //Fetch the details of the logged-in user
   /* fetchUserInfo = () => {
      this.usersService.fetchUserInfo()
      .pipe(first())
          .subscribe(
            data => {
              console.log('Account profile data in component is : '+ JSON.stringify(data));
              if(data) {
                this.userInfo = data;
                this.nomineeMap[data["individualId"]]=data;
                if(!this.userInfo.contactDetail.primaryCountryCode)
                  this.userInfo.contactDetail.primaryCountryCode = '044';
                if(!this.userInfo.contactDetail.secondaryCountryCode)
                  this.userInfo.contactDetail.secondaryCountryCode = '044';
                this.personalDetailsForm.patchValue(this.userInfo.personalDetail != null ? this.userInfo.personalDetail : {});
                this.addressDetailsForm.patchValue(this.userInfo.addressDetail != null ? this.userInfo.addressDetail : {});
                this.contactDetailsForm.patchValue(this.userInfo.contactDetail != null ? this.userInfo.contactDetail : {});
                this.docDetailsForm.patchValue(this.userInfo.docDetail != null ? this.userInfo.docDetail : {});
              }
            },
            error => {
              console.log('Error when fetching the account profile data in component: '+JSON.stringify(error));
            }
          );
    }*/

    fetchNominees=() => {
      this.usersService.fetchNominees()
      .pipe(first())
          .subscribe(
            data => {
              for(let i in data['nomineeMembers']){
                this.nomineeMap[data['nomineeMembers'][i]["personalDetail"]["individualId"]]=data['nomineeMembers'][i];
              }
              console.log('Family members data in component for nominee is : '+ JSON.stringify(data));
              console.log('Nominee map : '+ JSON.stringify(this.nomineeMap));

              for(let k in this.nomineeMap){
                this.nomineeMapKeysLs.push(k);
              }
             
            }
          );
    }

  initPersonalDetailsForm = () => {
    this.personalDetailsForm = this.formBuilder.group({
      title: [''],
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z ]+')]],
      middleName: ['',Validators.pattern('[a-zA-Z ]+')],
      lastName: ['', [Validators.required,Validators.pattern('[a-zA-Z ]+')]],
      gender: [''],
      dateOfBirth: ['', [Validators.required]],
      relationship:[''],
      primaryFlag:'1'
    });
    this.personalDetailsForm.disable();
  }

  initAddressDetailsForm = () => {
    this.addressDetailsForm = this.formBuilder.group({
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      addressLine3: [''],
      addressLine4: [''],
      countryState: [''],
      postCode: ['', Validators.required],
      country: ['UK', Validators.required],
      selectedAddress: [{}],
      addressList: [[]]
    });
    this.addressDetailsForm.disable();
  }

  initContactDetailsForm = () => {
    this.contactDetailsForm = this.formBuilder.group({
      primaryEmailAddress: [{value: '', disabled: true}, [Validators.required, Validators.email,Validators.pattern('.+.com'), Validators.maxLength(75)]],
      primaryCountryCode: [{value: '044', disabled: true},[Validators.required,Validators.pattern('[0-9]+'), Validators.maxLength(5)]],
      primaryPhoneNumber: [{value: '', disabled: true}, [Validators.required, Validators.pattern('^(0-)*[0-9]{10}')]],
      secondaryEmailAddress: ['', [Validators.email,Validators.pattern('.+.com'), Validators.maxLength(75)]],
      secondaryCountryCode: [{value: '044', disabled: true},[Validators.required,Validators.pattern('[0-9]+'), Validators.maxLength(5)]],
      secondaryPhoneNumber: ['', [Validators.pattern('^(0-)*[0-9]{10}')]]
    });
    this.contactDetailsForm.disable();
  }

  initDocDetailsForm= () => {
    this.docDetailsForm = this.formBuilder.group({
      documentType: [{value: '', disabled: true}, [Validators.required]],
      countryOfIssue: [{value: '', disabled: true}],
      documentNumber: [{value: '', disabled: true}],
      issueingAuthority: [''],
      issueDate: [''],
      expiaryDate: [''],
      additionalInformation: [{value: '', disabled: true}]
    });
    this.docDetailsForm.disable();
  }

  //Toggle address form for manual entry
  toggleAddressForm = () => {
    this.showAddressForm = !this.showAddressForm;
    this.showPCAddressForm ? this.togglePCAddressForm() : null;
  }

  //Toggle post code search addess form
  togglePCAddressForm = () => {
    this.showPCAddressForm = !this.showPCAddressForm;
    this.showAddressForm ? this.toggleAddressForm() : null;
  }

  //Toggle forms edit state
  toggleEditState = (form: string) => {
    switch (form) {
      case 'personalDetailsForm':
        if(this.personalDetailsForm.status !== 'DISABLED'){
          this.personalDetailsForm.disable();
        } else {
          this.personalDetailsForm.enable();
          if(!this.enableInputs){
          this.personalDetailsForm.controls.firstName.disable();
          this.personalDetailsForm.controls.lastName.disable();
          this.personalDetailsForm.controls.middleName.disable();
          this.personalDetailsForm.controls.gender.disable();
          this.personalDetailsForm.controls.title.disable();
          this.personalDetailsForm.controls.dateOfBirth.disable();
          }else{
          this.personalDetailsForm.controls.firstName.enable();
          this.personalDetailsForm.controls.lastName.enable();
          this.personalDetailsForm.controls.middleName.enable();
          this.personalDetailsForm.controls.gender.enable();
          this.personalDetailsForm.controls.title.enable();
          this.personalDetailsForm.controls.dateOfBirth.enable();
          }
        }
        break;
      case 'addressDetailsForm':
        if(this.addressDetailsForm.status !== 'DISABLED'){
          this.addressDetailsForm.disable();
        } else {
          this.addressDetailsForm.enable();
        }
        this.showAddressForm ? this.toggleAddressForm() : null;
        this.showPCAddressForm ? this.togglePCAddressForm() : null;
        break;
      case 'contactDetailsForm':
        if(this.contactDetailsForm.status !== 'DISABLED'){
          this.contactDetailsForm.disable();
        } else {
          this.contactDetailsForm.enable();
          if(!this.enableInputs){
          this.contactDetailsForm.controls.primaryEmailAddress.disable();
          this.contactDetailsForm.controls.primaryCountryCode.disable();
          this.contactDetailsForm.controls.primaryPhoneNumber.disable();
          this.contactDetailsForm.controls.secondaryCountryCode.disable();
          }else{
          this.contactDetailsForm.controls.primaryEmailAddress.enable();
          this.contactDetailsForm.controls.primaryCountryCode.enable();
          this.contactDetailsForm.controls.primaryPhoneNumber.enable();
          this.contactDetailsForm.controls.secondaryCountryCode.enable();
          }
        }

        break;

        case 'docDetailsForm':
          if(this.docDetailsForm.status !== 'DISABLED')
            this.docDetailsForm.disable();
          else {
            this.docDetailsForm.enable();
            if(!this.enableInputs){
            this.docDetailsForm.controls.documentType.disable();
            this.docDetailsForm.controls.countryOfIssue.disable();
            this.docDetailsForm.controls.documentNumber.disable();
            this.docDetailsForm.controls.issueingAuthority.disable();
            this.docDetailsForm.controls.issueDate.disable();
            this.docDetailsForm.controls.expiaryDate.disable();
            this.docDetailsForm.controls.additionalInformation.disable();
            }else{
            this.docDetailsForm.controls.documentType.enable();
            this.docDetailsForm.controls.countryOfIssue.enable();
            this.docDetailsForm.controls.documentNumber.enable();
            this.docDetailsForm.controls.issueingAuthority.enable();
            this.docDetailsForm.controls.issueDate.enable();
            this.docDetailsForm.controls.expiaryDate.enable();
            this.docDetailsForm.controls.additionalInformation.enable(); 
            }
          }
  
          break;

      default:
        break;
    }
  }

  //Reset the form
  resetForm = (form: string) => {
    switch (form) {
      case 'personalDetailsForm':
        this.personalDetailsForm.patchValue(this.userInfo.personalDetail != null ? this.userInfo.personalDetail : {});
        break;
      case 'addressDetailsForm':
        this.addressDetailsForm.patchValue(this.userInfo.addressDetail != null ? this.userInfo.addressDetail : {});
        break;
      case 'contactDetailsForm':
        this.contactDetailsForm.patchValue(this.userInfo.contactDetail != null ? this.userInfo.contactDetail : {});
        break;
      case 'docDetailsForm':
        this.docDetailsForm.patchValue(this.userInfo.docDetail != null ? this.userInfo.docDetail : {});
        break;
      default:
        break;
    }
    this.hideFormStatusMsg();
    this.toggleEditState(form);
  }

  //Save the changes made to the forms
  onSubmit = (form: string) => {
    let payload = null;
    switch (form) {
      case 'personalDetailsForm':
        payload = this.personalDetailsForm.value;
       // payload.individualId=this.individualId;
        break;
      case 'addressDetailsForm':
        payload = this.addressDetailsForm.value;
       // payload.individualId=this.individualId;
        break;
      case 'contactDetailsForm':
       // payload = this.contactDetailsForm.value;
        payload={};
        payload.emails=[{"emailAddress":this.contactDetailsForm.value.primaryEmailAddress,"individualId":this.individualId,"primaryEmailFlag":"Y"},{"emailAddress":this.contactDetailsForm.value.secondaryEmailAddress,"individualId":this.individualId,"primaryEmailFlag":"N"}];
        payload.phones=[{"phoneNumber":this.contactDetailsForm.value.primaryPhoneNumber,"individualId":this.individualId,"primaryPhoneFlag":"Y"},{"phoneNumber":this.contactDetailsForm.value.secondaryPhoneNumber,"individualId":this.individualId,"primaryPhoneFlag":"N"}];
       // payload.individualId=this.individualId;
        //console.log('payload',payload)
        break;
      case 'docDetailsForm':
          payload = this.docDetailsForm.value;
          payload.individualId=this.individualId;
          //console.log(payload);
          break;
      default:
        break;
    }

   this.usersService.saveUserInfoMyNominee(form, payload)
        .pipe(first())
        .subscribe(
          data => {
            if(form==='personalDetailsForm')
            this.individualId=parseInt(data);

            console.log('Response received from service when saving user data : '+ JSON.stringify(data));
            this.hideFormStatusMsg();
            this.alertService.success("Personal Details saved Successfuly");
            switch (form) {
              case 'personalDetailsForm':
                this.userInfo.personalDetail = payload;
                this.pfStatusMsgHide = !this.pfStatusMsgHide;
                break;
              case 'addressDetailsForm':
                this.userInfo.addressDetail = payload;                
                this.afStatusMsgHide = !this.afStatusMsgHide;
                break;
              case 'contactDetailsForm':
                this.userInfo.contactDetail = payload;
                this.cfStatusMsgHide = !this.cfStatusMsgHide;
                break;
              case 'docDetailsForm':
                this.userInfo.docDetail = payload;
                this.dfStatusMsgHide = !this.dfStatusMsgHide;
                break;
              default:
                break;
            }
            //this.nomineeMap={};
            this.nomineeMapKeysLs=[];
            //for(let k in nomineeMap)
           // this.fetchUserInfo();
           for(let k in this.nomineeMap){
            if(this.nomineeMap[k].individualId==null)
              delete this.nomineeMap[k];
           }
            this.fetchNominees();
            this.toggleEditState(form);
          },
          error => {
            console.log('Error when saving the users info: '+JSON.stringify(error));
            this.hideFormStatusMsg();
            this.alertService.error(error.error)
            this.resetForm(form);
          }
        );

  }

  //Fetch address list for searched postal code
  fetchAddressForPostCode = (postalCode : string) => {

    if(postalCode.length == 0) {
      return ;
    }
    this.usersService.fetchAddressForPostCode(postalCode)
    .pipe(first())
    .subscribe(
      data => {
        // console.log('Response received from service for searched postal code: '+JSON.stringify(data));
        if(data['result']) {
          this.togglePCAddressForm();
          this.addressList = data['result'];          
        }
      },
      error => {
        // console.log('Something went wrong while fetching the list of addresses for searched postal code: '+JSON.stringify(error));
        // this.addressList = [{'postcode': 'PO9 1NG','post_town': 'HAVANT','line_1': '1 Cross Way','line_2': '','line_3': '','county': 'Hampshire','postal_county': 'Hampshire'},{'postcode': 'PO9 1NG','post_town': 'HAVANT','line_1': '2 Cross Way','line_2': '','line_3': '','county': 'Hampshire','postal_county': 'Hampshire'},{'postcode': 'PO9 1NG','post_town': 'HAVANT','line_1': '3 Cross Way','line_2': '','line_3': '','county': 'Hampshire','postal_county': 'Hampshire'}];
        this.togglePCAddressForm();
        this.addressDetailsForm.get('postCode').setErrors({invalid: true});
        this.alertService.error(error.error);
      });
       
  }

  populateAddressForm = () => {
    const {postCode, post_town, line_1, line_2, line_3, county, postal_county} = this.addressDetailsForm.controls.selectedAddress.value;
    this.addressDetailsForm.patchValue({'addressLine1': line_1});
    this.addressDetailsForm.patchValue({'addressLine2': line_2});
    this.addressDetailsForm.patchValue({'addressLine3': line_3});
    this.addressDetailsForm.patchValue({'countryState': county});
  }

  hideFormStatusMsg = () => {
    this.pfStatusMsgHide = !this.pfStatusMsgHide ? !this.pfStatusMsgHide : this.pfStatusMsgHide;
    this.afStatusMsgHide = !this.afStatusMsgHide ? !this.afStatusMsgHide : this.afStatusMsgHide;
    this.cfStatusMsgHide = !this.cfStatusMsgHide ? !this.cfStatusMsgHide : this.cfStatusMsgHide;
    this.dfStatusMsgHide = !this.dfStatusMsgHide ? !this.dfStatusMsgHide : this.dfStatusMsgHide;
  }


}
