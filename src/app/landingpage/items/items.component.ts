import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UsersService } from 'src/app/core/services/users.service';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { LandingpageComponent } from 'src/app/landingpage/landingpage.component'
import { first } from 'rxjs/operators';
import { ValidatorService } from 'src/app/core/validators/validator.service';
import { FileUploader } from "ng2-file-upload";
import { saveAs } from 'file-saver';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';

@Component({

  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit 
{

public uploader: FileUploader = new FileUploader({ isHTML5: true });
  PersonalDetails: FormGroup;
  AboutBanksForm: FormGroup;
  AccountDetails: FormGroup;
  AccountDetailsForm: FormGroup;
  AddressDetailsForm: FormGroup;
  addressDetails: FormGroup;
  addressDetailsBank: FormGroup;
  contactDetailsForm: FormGroup;
  DocDetailsForm: FormGroup;
  PersonalDetailsForm: FormGroup;
  
  userInfo: any;
  showPanel: boolean;
  phoneNumberpersonal :any;
  individualId: number;
  pfStatusMsgHide: boolean = false;
  loadmsg: string;
  adStatusMsg: string;
  alertclass: string;
  familyMap = [];
  familyMapKeysLs = [];
  selectAddr = [];
  selectContact = [];
  selectAddrId: any;
  selectContactId: any;
  accountNumber: any;
  selectAcct = [];
  butDisable = true;
  butDisableContact = true;
  leader1: string;
  memberId1:any;
  memberId: any;
  memberId_temp: any;
  afStatusMsgHide: boolean = true;
  cfStatusMsgHide: boolean = true;
  dfStatusMsgHide: boolean = true;
  enableInputs: boolean = true;
  AccountDetailsFlag:  boolean = true;
  AddressDetailBankLink: boolean = true;
  ContactDetailLink: boolean = true;
  AddressDetailShow: boolean;
  EmailDetailShow: boolean;
  PhoneDetailShow: boolean;
  DocumentDetailShow: boolean;
  RequirementDetailShow: boolean;
  PostalListShow: boolean;
  ShowPostalBox: boolean;
  selectedAddressId: number;
  selectPostCodeAddressId:  number;
  selectBankId: number;
  selectBankName: string;
  AddressList = [];
  UniversalAddressList = [];
  UniversalAddressList_temp = [];
  AddressPostCodeList = [];
  TitleList = [];
  RelationshipList = [];
  GenderList = [];
  CountryList=[];
  AddressList_temp = [];
  selectedEmailId: number;
  selectedDocumentId: number;
  selectCountry: string;
  letter: string;
  selBankAccnt: string;
  selUsrAccnt : string;
  BankList= [];
  PhoneList = [];
  EmailList = [];
  DocumentList = [];
  butDisableEmail: boolean;
  butDisablePhone: boolean;
  butDisableDocument: boolean;
  butDisableAddrPostCode: boolean;
  butDisabledSelectCountry: boolean;
  butDisableUniversalList: boolean;
  ActiveDocumentIdentifier: string;
  postCode: string;
  requiredId: string;
  result: string = '';
  addressflag: number;
  additionalInformation: string;
  flag: Number;
  stateGroupOptions: Observable<StateGroup[]>;
  BankIndividualId: number;
  AddressId: number;
  ContactId: number;
  isJointAccount: any=false;
  jntAccntHldrName1: string;
  jntAccntHldrName2: string;
  jntAccntHldrName3: string;
  jntAccntHldrName4: string;
  jntAccntHldrName5: string;
  isJointAccountHldr1: boolean;
  isJointAccountHldr2: boolean;
  isJointAccountHldr3: boolean;
  isJointAccountHldr4: boolean;
  isJointAccountHldr5: boolean;
  JMember:String;
  selectedPhoneId: any;
  arr= [] as  any;


  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private validatorService: ValidatorService,
    private land: LandingpageComponent
  ) {
    this.userInfo = null;
  }

  ngOnInit() {
    this.initForms();
    this.showPanel = false;
    this.selectBankId = null;
    this.AddressDetailShow = true;
    this.EmailDetailShow = true;
    this.PhoneDetailShow = true;
    this.DocumentDetailShow = true;
    this.RequirementDetailShow = true;
    this.selectedAddressId = null;
    this.selectedEmailId = null;
    this.selectedPhoneId = null;
    this.selectedDocumentId = null;
    this.selectCountry = null;
    this.selBankAccnt = null;
    this.selUsrAccnt =  null;
    this.selectPostCodeAddressId = null;
    this.butDisable = true;
    this.butDisableEmail = true;
    this.butDisablePhone = true;
    this.butDisableDocument = true;
    this.butDisableAddrPostCode = false;
    this.ActiveDocumentIdentifier = null;
    this.postCode = null;
    this.PostalListShow = null;
    this.requiredId = null;
    this.addressflag = 0;
    this.butDisabledSelectCountry = false;
    this.ShowPostalBox = false;
    this.butDisableUniversalList = false;
    this.additionalInformation = "";
    this.fetchUtilityMembers();
    this.fetchUserInfo();
    this.stateGroupOptions = this.AboutBanksForm.get('stateGroup')!.valueChanges
      .pipe(startWith(''),map(value => this._filterGroup(value))
      );
  }

  
  AddJointHolders() {
   alert(this.isJointAccount)
  }  

  initForms() {

    this.initAbouttheBankForm();
    this.initAccountDetailsForm();
    this.initPersonalDetailsForm();
    this.initAddressDetail();
    this.initAddressDetailBank();
    this.initContactDetailsForm();
    this.initDocDetailsForm();
    this.fetchUserInfo();
    this.fetchFamilyMembers();
    this.initAddressDetailsForm();
    

  }
  IndividualMapping(param: number) {
    for (let i in this.familyMap) {
      if (this.familyMap[i].personalDetail.individualId == param) {
        return i;
      }
    }
  }
  
   AddressPostCodeMapping(param: string){
    for( let i in this.AddressPostCodeList){
      if(this.AddressPostCodeList[i].line_1 == param){
        return i;
      }
    }
  }
  
  fetchFamilyMembers = () => {
    this.usersService.fetchFamilyMembers_temp()
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
           for (let i in data['familyMembers']) {
            this.familyMap[data['familyMembers'][i]["personalDetail"]["individualId"]] = data['familyMembers'][i];
            
          }
         
              
         this.UniversalAddressList = [];

          for(let i in data['universalAddressDetail']){
            data['universalAddressDetail'][i].addressId = i;
            this.UniversalAddressList.push(data['universalAddressDetail'][i]);
          }


          for (let k in this.familyMap) {
            this.familyMapKeysLs.push(k);

          }

          this.memberId_temp = this.memberId;

        }
      );

  }

  initAddressDetailBank = () => {
    this.addressDetailsBank = this.formBuilder.group({
      addressLine1: [''],
      addressLine2: [''],
      addressLine3: [''],
      addressLine4: [''],
      postCode: [''],
      countryState: [''],
      country: ['']
    });

    this.addressDetailsBank.disable();
  }

  initAddressDetail = () => {
    this.addressDetails = this.formBuilder.group({
      addressLine1: [''],
      addressLine2: [''],
      addressLine3: [''],
      addressLine4: [''],
      postCode: [''],
      countryState: [''],
      country: ['']
    });

    this.addressDetails.disable();
  }
    
  initAccountDetailsForm = () => {
    this.AccountDetailsForm = this.formBuilder.group({
      accountNo: [''],
      shortCode: [''],
      accounType: [''],
      accountOpenDate: [''],
      accountHolderNo: [''],
      isJointAccount: [false],
      jntAccntHldrName1: [''],
      jntAccntHldrName2: [''],
      jntAccntHldrName3: [''],
      jntAccntHldrName4: [''],
      jntAccntHldrName5: [''],
      isJointAccountHldr1: [false],
      isJointAccountHldr2: [false],
      isJointAccountHldr3: [false],
      isJointAccountHldr4: [false],
      isJointAccountHldr5: [false],
      jointAccountHolderLst: ['']
    });
    this.AccountDetailsForm.disable();
  }

 initAbouttheBankForm = () => {
    this.AboutBanksForm = this.formBuilder.group({
      title: [''],
      address: [''],
      email: [''],
      email1: [''],
      prmCountryCode: [''],
      scndCountryCode: [''],
      prmPhnumber: [''],
      scndPhnumber: [''],
      url: [''],
      addinfo: [''],
      postCode: [''],
      stateGroup: ''
    });
    this.AboutBanksForm.disable() ;
  }
    initPersonalDetailsForm = () => {
    this.PersonalDetailsForm = this.formBuilder.group({
      title: [''],
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+[a-zA-Z\.\'\,\-]+[a-zA-Z]+$|^[a-zA-Z]+$'), Validators.maxLength(50), Validators.minLength(1)]],
      middleName: ['', [Validators.pattern('^[a-zA-Z]+[a-zA-Z\.\'\,\-]+[a-zA-Z]+$|^[a-zA-Z]+$'), Validators.maxLength(50), Validators.minLength(0)]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+[a-zA-Z\.\'\,\-]+[a-zA-Z]+$|^[a-zA-Z]+$'), Validators.maxLength(50), Validators.minLength(1)]],
      gender: [''],
      dateOfBirth: ['', [Validators.required,this.validatorService.ageEligibility]]
   });

    this.PersonalDetailsForm.disable();
  }


  initAddressDetailsForm = () => {
    this.AddressDetailsForm = this.formBuilder.group({
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      addressLine3: [''],
      addressLine4: [''],
      postCode: ['', Validators.required],
      countryState: [''],
      country: [''],

    });

    this.AddressDetailsForm.disable();
  }

  initContactDetailsForm = () => {
    this.contactDetailsForm = this.formBuilder.group({
      primaryEmailAddress: [''],
      primaryCountryCode: [''],
      primaryPhoneNumber: [''],
      secondaryEmailAddress: [''],
      secondaryCountryCode: [''],
      secondaryPhoneNumber: ['']
    });
    this.contactDetailsForm.disable();
  }

  initDocDetailsForm = () => {
    this.DocDetailsForm = this.formBuilder.group({
      documentType: [''],
      countryOfIssue: [''],
      documentNumber: [''],
      issueingAuthority: [''],
      issueDate: [''],
      expiaryDate: [''],
      additionalInformation: ['']
    });
    this.DocDetailsForm.disable();
  }
  
  fetchUserInfo = () => {
				this.usersService.fetchUserInfo_Acct_temp()
				  .pipe(first())
				  .subscribe(
					(data: any) => {
				//	  console.log(data);
					  if (data) {
						this.familyMap = data['familyMembers'];
						//alert(JSON.stringify(this.familyMap))
					    //this.panelClk();
					  }

					},
					(error: any) => {
					  console.log('Error when fetching the account profile data in component: ' + JSON.stringify(error));
					});
  }

		showSection(param:string){
		
			this.land.showSection(param);

		}

    //Toggle forms edit state
    toggleEditState = (form: string) => {
      switch (form) {
        case 'AboutBanksForm':
          if (this.AboutBanksForm.status !== 'DISABLED') {
            this.AboutBanksForm.disable();
          } else {
            this.AboutBanksForm.enable();
            if (!this.enableInputs) {
              this.AboutBanksForm.controls.title.disable();
              this.AboutBanksForm.controls.address.disable();
              this.AboutBanksForm.controls.email.disable();
              this.AboutBanksForm.controls.email1.disable();
               this.AboutBanksForm.controls.prmCountryCode.disable();
              this.AboutBanksForm.controls.scndCountryCode.disable();
              this.AboutBanksForm.controls.prmPhnumber.disable();
              this.AboutBanksForm.controls.scndPhnumber.disable();
              this.AboutBanksForm.controls.url.disable();
              this.AboutBanksForm.controls.addinfo.disable();
              this.AboutBanksForm.controls.postCode.disable();
              //this.AboutBanksForm.controls.selectedAddressId.disable();
            } else {
              this.AboutBanksForm.controls.title.enable();
              this.AboutBanksForm.controls.address.enable();
              this.AboutBanksForm.controls.email.enable();
              this.AboutBanksForm.controls.email1.enable();
              this.AboutBanksForm.controls.prmCountryCode.enable();
              this.AboutBanksForm.controls.scndCountryCode.enable();
              this.AboutBanksForm.controls.prmPhnumber.enable();
              this.AboutBanksForm.controls.scndPhnumber.enable();
              this.AboutBanksForm.controls.url.enable();
              this.AboutBanksForm.controls.addinfo.enable();
              this.AboutBanksForm.controls.postCode.enable();
              //this.AboutBanksForm.controls.selectedAddressId.enable();
              this.addNew('AddressDetailsForm');
            }
          }
          break;
		  case 'PersonalDetails':
          if (this.PersonalDetails.status !== 'DISABLED') {
            this.PersonalDetails.disable();
          } else {
            this.PersonalDetails.enable();
            if (!this.enableInputs) {
              this.PersonalDetails.controls.firstName.disable();
              this.PersonalDetails.controls.lastName.disable();
              this.PersonalDetails.controls.middleName.disable();
              this.PersonalDetails.controls.gender.disable();
              this.PersonalDetails.controls.title.disable();
              this.PersonalDetails.controls.dateOfBirth.disable();
            } else {
              this.PersonalDetails.controls.firstName.enable();
              this.PersonalDetails.controls.lastName.enable();
              this.PersonalDetails.controls.middleName.enable();
              this.PersonalDetails.controls.gender.enable();
              this.PersonalDetails.controls.title.enable();
              this.PersonalDetails.controls.dateOfBirth.enable();
            }
          }
          break;
          
          case 'PersonalDetailsForm':
			this.PersonalDetailsForm.enable();	
			break;	
          case 'AccountDetailsForm':
            this.AccountDetailsFlag=false;
            if (this.AccountDetailsForm.status !== 'DISABLED') {
                this.AccountDetailsForm.disable();
            } else {            
              this.AccountDetailsForm.enable(); 
             

            }
            break;
            case 'addressDetailsBankForm':
              if (this.addressDetailsBank.status !== 'DISABLED') {
                this.addressDetailsBank.disable();
              } else {
                this.addressDetailsBank.enable();
              }
            break;
        case 'addressDetailsForm':
            this.AddressDetailBankLink = false;
            this.butDisable = false;
       
        break;
        case 'contactDetailsForm':
          this.ContactDetailLink = false;
          this.butDisableContact = false;
          
 /*         if (this.contactDetailsForm.status !== 'DISABLED') {
            this.contactDetailsForm.disable();
          } else {
            
            if (!this.enableInputs) {
              this.contactDetailsForm.controls.primaryEmailAddress.disable();
              this.contactDetailsForm.controls.primaryCountryCode.disable();
              this.contactDetailsForm.controls.primaryPhoneNumber.disable();
              this.contactDetailsForm.controls.secondaryCountryCode.disable();
            } else {
              this.contactDetailsForm.controls.primaryEmailAddress.enable();
              this.contactDetailsForm.controls.primaryCountryCode.enable();
              this.contactDetailsForm.controls.primaryPhoneNumber.enable();
              this.contactDetailsForm.controls.secondaryCountryCode.enable();
            }
          }*/
  
          break;
  
        case 'DocDetailsForm':
        if (this.DocDetailsForm.status !== 'DISABLED') {
          this.DocDetailsForm.disable();
          this.DocumentDetailShow = true;
        }
        else {
          this.DocDetailsForm.disable();
          this.DocumentDetailShow = false;
          this.butDisableDocument = true;
        }
        if(this.DocumentList.length>0){
          this.uploader.clearQueue();
          this.ActiveDocumentIdentifier = this.DocumentList[0].documentIdentifier;
          this.selectedDocumentId= this.DocumentList[0].documentId;
          this.DocDetailsForm.patchValue(this.DocumentList[0]);
          this.DocDetailsForm.enable();
          
         
       }
      else
      {
       this.selectedDocumentId = null;
       this.uploader.clearQueue();
    
       
      }
        break;
          
          case 'RequirementDetailsForm':
          if(this.RequirementDetailShow==false){
            this.RequirementDetailShow = true;
          }
          else
          {
            this.RequirementDetailShow = false;
          }
        break;
          
  
        default:
          break;
      }
    }
  
    //Reset the form
    resetForm = (form: string) => {
      console.log(form);
      switch (form) {
        case 'PersonalDetails':
          this.PersonalDetails.patchValue(this.userInfo.personalDetail != null ? this.userInfo.personalDetail : {});
          break;
        case 'PersonalDetailsForm':
	        this.PersonalDetailsForm.disable();
	        this.initPersonalDetailsForm();
	        break;
        case 'AboutBanksForm':
        //  this.addressDetails.patchValue(this.userInfo.addressDetail != null ? this.userInfo.addressDetails : {});
          this.initAbouttheBankForm();
          this.butDisabledSelectCountry = true;
          this.selectedAddressId = null;
         
          break;
        case 'contactDetailsForm':
          //this.contactDetailsForm.patchValue(this.userInfo.contactDetail != null ? this.userInfo.contactDetail : {});
          this.initContactDetailsForm();
          this.ContactDetailLink = true;
          this.butDisableContact = true;
          this.selectContactId = -1;
          break;
        case 'AccountDetailsForm':
          //  this.AccountDetails.patchValue(this.userInfo.AccountDetails != null ? this.userInfo.AccountDetails : {});
          this.initAccountDetailsForm();
          this.AccountDetailsFlag=true;
          break;  
        case 'addressDetailsBankForm':
          this.initAddressDetailBank();
          this.addressDetailsBank.disable();
       break;
       case 'AddressDetailsForm':
        //  this.initAddressDetailsForm();
        this.selectedAddressId = null;
        this.AddressDetailsForm.disable();
        this.AddressDetailShow = true;
        this.butDisable = false;
        this.AddressPostCodeList = [];
        this.butDisableAddrPostCode = false;
        this.PostalListShow = false;
        this.butDisabledSelectCountry = false;
        this.ShowPostalBox = false;
        break;
        case 'DocDetailsForm':
          this.DocDetailsForm.patchValue(this.userInfo.docDetail != null ? this.userInfo.docDetail : {});
          break;
        default:
          break;
      }
   //   this.hideFormStatusMsg();
    //  this.toggleEditState(form);
    }

    

    //Save the changes made to the forms
    onSubmit = (form: string) => {
      let payload = null;
      switch (form) {
        case 'AboutBanksForm':
          payload = this.AboutBanksForm.value;
          if(this.selectCountry==null && this.selectedAddressId!=null){
            payload.addressId = this.selectedAddressId;
          }
          console.log(payload);
          payload.individualId = this.individualId;
          //alert(this.arr[0].id);
          payload.id =this.arr[0].id;
          //alert(this.selectedPhoneId)
          //alert(JSON.stringify(payload));
        break;
        case 'PersonalDetails':
          payload = this.PersonalDetails.value;
          //alert(JSON.stringify(payload));
          payload.individualId = this.individualId;
        break;
        case 'AccountDetailsForm':
            //this.isJointAccount=this.AccountDetails.value.isJointAccount;
            // this.JMember = this.AccountDetails.value.JMember;
            payload = this.AccountDetails.value;
            payload.individualId = this.individualId;
            payload.BankId = this.BankIndividualId;         
            this.AccountDetailsFlag = true;
            this.AccountDetailsForm.disable();
            // this.AccountDetails.value.IsJointAcct=this.isJointAccount;
            // this.AccountDetails.value.JMember=this.JMember;
            //this.AccountDetails.value.IsJointAcct.disable();
            //this.AccountDetails.value.JMember.disable();
          
            break;  
       case 'addressDetailsForm':
          payload = this.addressDetails.value;
          payload.individualId = this.individualId;
          payload.addressId = this.AddressId;
          payload.BankId = this.BankIndividualId;
          this.AddressDetailBankLink = true;
          this.butDisable = true;
          break;
       case 'AddressDetailsForm':
        payload = this.AddressDetailsForm.value;
        if(this.selectCountry==null && this.selectedAddressId!=null){
            payload.addressId = this.selectedAddressId;
        }
        payload.individualId = this.memberId;
   //     payload.addressId = this.selectedAddressId;
        payload.addressflag = this.addressflag;
        this.adStatusMsg = "Address Detail saved/updated successfully ";
        this.AddressDetailShow = true;
        this.butDisable = true;

        break;
        case 'contactDetailsForm':
          payload = this.contactDetailsForm.value;
          payload.individualId = this.individualId;
          payload.BankId = this.BankIndividualId;
          payload.contactId = this.ContactId;
          this.butDisableContact = true;
          //console.log('payload',payload)
          this.ContactDetailLink = true;
          break;
        case 'addressDetailsBankForm':
          payload = this.addressDetailsBank.value;
          payload.individualId = this.individualId;
          payload.BankId = this.BankIndividualId;
          payload.BankId = this.BankIndividualId;
          this.addressDetailsBank.disable();
          break;
        case 'DocDetailsForm':
          payload = this.DocDetailsForm.value;
          payload.individualId = this.individualId;
          console.log(payload);
          break;
        default:
          break;
      }
      console.log(payload);
      this.usersService.saveUserbankinfo(form, payload)
      .pipe(first())
      .subscribe(
        data => {

          // console.log('Response received from service when saving user data : '+ JSON.stringify(data));

          switch (form) {
            case 'AboutBanksForm':
             
              //alert(data);
             // alert( Number(data));
             this.selectedPhoneId = Number(data);    
              break;
          }
        },
        error => {
          console.log('Error when saving the users info: ' + JSON.stringify(error));
          this.resetForm(form);
        }
      );
 
  
    }

    hideFormStatusMsg = () => {
      this.pfStatusMsgHide = !this.pfStatusMsgHide ? !this.pfStatusMsgHide : this.pfStatusMsgHide;
      this.afStatusMsgHide = !this.afStatusMsgHide ? !this.afStatusMsgHide : this.afStatusMsgHide;
      this.cfStatusMsgHide = !this.cfStatusMsgHide ? !this.cfStatusMsgHide : this.cfStatusMsgHide;
      this.dfStatusMsgHide = !this.dfStatusMsgHide ? !this.dfStatusMsgHide : this.dfStatusMsgHide;
    }
  

  AddeClk(param1: any) {
    if (param1 != -1) {
      this.addressDetails.patchValue(this.selectAddr[param1]);
      this.AddressId = this.selectAddr[param1].addressId;
  
    }
  }

  AddeContact(param1: any){
    if (param1 != -1) {
      this.contactDetailsForm.patchValue(this.selectContact[param1]);
      this.ContactId = this.selectContact[param1].contactId;
    }
  }

  AcctClk(param1: any) {
    this.AccountDetailsForm.patchValue(this.selectAcct[param1]);
    this.addressDetailsBank.patchValue(this.selectAcct[param1]);
   
    for( let k in this.selectAddr){
       if(this.selectAddr[k].addressId == this.selectAcct[param1].addressId){
       this.addressDetails.patchValue(this.selectAddr[k]);
       break;
      }
    }
    this.AccountDetails.disable();
    this.addressDetails.disable();
  //  this.butDisable = true;
    this.selectAddrId = -1;
  }

  AddNewAcct() {
    this.initAccountDetailsForm();
    this.initAddressDetail();
    this.selectAddrId = -1;
    this.butDisable = false;
    this.AccountDetails.enable();
    this.accountNumber = -1;

  }

  panelClk = (param: any, param2: any, param3: any, param4: any, param5: any) => {

    //alert(param);
    this.showPanel = true;
    this.selectCountry = null;
    this.PersonalDetailsForm.patchValue(this.familyMap[this.IndividualMapping(param)].personalDetail);
    this.additionalInformation = this.familyMap[this.IndividualMapping(param)].personalDetail.additional_info;
    this.PersonalDetailsForm.disable();
    this.showPanel = true;
    this.AddressDetailsForm.disable();
    this.DocDetailsForm.disable();
    this.butDisable = true;
    this.butDisableEmail = true;
    this.butDisablePhone = true;
    this.butDisableDocument = true;
    this.butDisabledSelectCountry = false;
    this.AddressDetailShow = true;
    this.EmailDetailShow = true;
    this.PhoneDetailShow = true;
    this.DocumentDetailShow = true;
    this.selectedAddressId = null;
    this.selectedEmailId = null;
    this.selectedPhoneId = null;
    this.selectedDocumentId = null;
    this.ActiveDocumentIdentifier = null;
    this.AddressList = [];
    this.EmailList = [];
    this.PhoneList = [];
    this.DocumentList = [];
    this.uploader.clearQueue();
    for (let i in this.familyMap[this.IndividualMapping(param)].addressDetail) {
      this.AddressList.push(this.familyMap[this.IndividualMapping(param)].addressDetail[i]);
    }
    this.AddressList_temp = this.AddressList;
    if(this.AddressList.length==0){
      this.butDisable = false;
    }
    for (let i in this.familyMap[this.IndividualMapping(param)].emailDetail) {
      this.EmailList.push(this.familyMap[this.IndividualMapping(param)].emailDetail[i]);
    }
    if(this.EmailList.length==0){
      this.butDisableEmail = false;
    }

    for (let i in this.familyMap[this.IndividualMapping(param)].phoneDetail) {
      this.PhoneList.push(this.familyMap[this.IndividualMapping(param)].phoneDetail[i]);
    }
    if(this.PhoneList.length==0){
      this.butDisablePhone = false;
    }

    for (let i in this.familyMap[this.IndividualMapping(param)].documentDetail) {
      this.DocumentList.push(this.familyMap[this.IndividualMapping(param)].documentDetail[i]);
    }
    if(this.DocumentList.length==0){
      this.butDisableDocument = false;
    }

  }
   
  fetchUtilityMembers = () => {

    this.usersService.fetchUtilityList()
    .pipe(first())
    .subscribe(
      data => {
      
        console.log(data);

        for(let i in data['title']){
            this.TitleList.push(data['title'][i]);
        }
        
        //alert(JSON.stringify(this.TitleList))

        for(let i in data['gender']){
          this.GenderList.push(data['gender'][i]);
        }

        for(let i in data['relationship']){
          if(data['relationship'][i].relationship_type=='Family'){
          this.RelationshipList.push(data['relationship'][i]);
          }
        }

        for(let i in data['countrycode']){
          this.CountryList.push(data['countrycode'][i]);
        }
      
	//alert(JSON.stringify(this.CountryList))
    });


  }
  
  AddeSelectCountry = (param: string) => {
  
  //alert(param)
  
    this.AddressDetailsForm.controls.country.setValue(this.CountryList[param].country_name);
    //this.AddressList = [];
    this.selectedAddressId = null;
    this.PostalListShow = false;
    this.butDisable = false;
    this.ShowPostalBox = false;
    this.UniversalAddressList_temp = [];
    this.AddressList = this.AddressList_temp;
  
  //alert(this.UniversalAddressList);

  for(let i in this.UniversalAddressList)
  {
       this.flag = 0;
       for(let j in this.AddressList)
       {
            if(this.AddressList[j].addressLine1===this.UniversalAddressList[i].addressLine1)
            {
             this.flag = 1;
             }
        }
       if(this.flag == 0)
        {
           this.UniversalAddressList_temp.push(this.UniversalAddressList[i]);
        }
    
    }
    
     //alert(JSON.stringify(this.UniversalAddressList_temp))

    this.AddressList = [];
     for (let i in this.UniversalAddressList_temp) {
      if(this.UniversalAddressList_temp[i].country==this.CountryList[param].country_name){
      	
      		//alert(this.UniversalAddressList_temp[i])
          this.AddressList.push(this.UniversalAddressList_temp[i]);
      }
    }

	  //alert(2222222);
    
    this.AddressDetailsForm.controls.country.setValue(this.CountryList[param].country_name);
    // this.ShowPostalBox = true;
    // this.butDisableUniversalList = true;
   //  this.butDisable = true;
     this.AddressList.push({addressId: "-2",
     addressLine1: "Others",
     addressLine2: "",
     addressLine3: "",
     addressLine4: "",
     countryState: "",
     country: "",
     postCode: "",
     addressflag: 0});

	 // alert(this.CountryList[param].search_flag);

    if(this.CountryList[param].search_flag=='N'){
      this.initAddressDetailsForm();
    
      this.AddressDetailsForm.controls.country.setValue(this.CountryList[param].country_name);
     if(this.AddressList.length==1){
         this.butDisable = false;
         this.AddressDetailsForm.enable();
     }
     else
     {
       // this.butDisableUniversalList = true;     
        this.butDisable = true;
     }
      
    }
    else
    {
    
    //alert('else');
     
      this.initAddressDetailsForm();
      this.AddressDetailsForm.controls.country.setValue(this.CountryList[param].country_name);
      //alert(this.AddressList.length);
      if(this.AddressList.length==1){
        this.butDisable = false;
        this.ShowPostalBox = true;
        }
    else
      {
      // this.butDisableUniversalList = true;     
       this.butDisable = true;
      }
    }
  }
  
  AddeDocument = (param: number) => {
    this.DocDetailsForm.patchValue(this.DocumentList[this.DocumentMapping(param)]);
    this.ActiveDocumentIdentifier = this.DocumentList[this.DocumentMapping(param)].documentIdentifier;
    this.uploader.clearQueue();
  }
  
  DownloadFile() {
    this.usersService.downloadFiles(this.selectedDocumentId.toString())
      .subscribe(data => {
        saveAs(new Blob([data], { type: '' }), this.DocumentList[this.DocumentMapping(this.selectedDocumentId)].documentIdentifier)


      });
  }
  
  DocumentMapping(param: number) {
    for (let i in this.DocumentList) {
      if (this.DocumentList[i].documentId == param) {
        return i;
      }
    }
  }
 
  fetchAddressForPostCode = (postalCode : string) => {
    if(postalCode.length == 0) {
      return ;
    }
    
  this.initAddressDetailsForm();
    this.usersService.fetchAddressForPostCode(postalCode)
    .pipe(first())
    .subscribe(
      data => {
        // console.log('Response received from service for searched postal code: '+JSON.stringify(data));
        if(data['result']) {
        //  this.togglePCAddressForm();
      
          this.AddressPostCodeList = data['result']; 
         
         
         // console.log(this.AddressPostCodeList);
        
        }
      },
      error => {
        // console.log('Something went wrong while fetching the list of addresses for searched postal code: '+JSON.stringify(error));
        // this.addressList = [{'postcode': 'PO9 1NG','post_town': 'HAVANT','line_1': '1 Cross Way','line_2': '','line_3': '','county': 'Hampshire','postal_county': 'Hampshire'},{'postcode': 'PO9 1NG','post_town': 'HAVANT','line_1': '2 Cross Way','line_2': '','line_3': '','county': 'Hampshire','postal_county': 'Hampshire'},{'postcode': 'PO9 1NG','post_town': 'HAVANT','line_1': '3 Cross Way','line_2': '','line_3': '','county': 'Hampshire','postal_county': 'Hampshire'}];
       
      });
     // this.AddAddressManually();
     
      this.butDisable = false;
      this.initAddressDetailsForm();
      this.AddressDetailsForm.controls.country.setValue(this.CountryList[this.selectCountry].country_name);
      this.ShowPostalBox = true;
      this.PostalListShow = true;
      this.butDisable = false;
     
  }
    
    AddAddressManually(){
    this.butDisableAddrPostCode = false;
    this.initAddressDetailsForm();
    this.AddressDetailsForm.controls.country.setValue(this.CountryList[this.selectCountry].country_name);
    this.selectedAddressId = null;
    this.AddressDetailsForm.enable();
    this.addressflag = 0;
    this.butDisable = false;
    this.ShowPostalBox = false;
  }
  
    AddeClkPostCode = (param: string) => {
   this.AddressDetailsForm.patchValue({'addressLine1': this.AddressPostCodeList[this.AddressPostCodeMapping(param)].line_1}); 
   this.AddressDetailsForm.patchValue({'addressLine2': this.AddressPostCodeList[this.AddressPostCodeMapping(param)].line_2}); 
   this.AddressDetailsForm.patchValue({'addressLine3': this.AddressPostCodeList[this.AddressPostCodeMapping(param)].line_3}); 
   this.AddressDetailsForm.patchValue({'addressLine4': this.AddressPostCodeList[this.AddressPostCodeMapping(param)].post_town}); 
   this.AddressDetailsForm.patchValue({'postCode': this.AddressPostCodeList[this.AddressPostCodeMapping(param)].postcode}); 
   this.AddressDetailsForm.patchValue({'countryState': this.AddressPostCodeList[this.AddressPostCodeMapping(param)].county}); 
   this.addressflag = 1;
  }
  
  addNew = (form: string) => {
  
  //alert(form)
    
    switch (form) {
     
      case 'AddressDetailsForm':
        this.initAbouttheBankForm();
        this.selectedAddressId = null;
      //  this.AddressDetailsForm.enable();
        this.AddressDetailShow = false;
        this.butDisable = false;
        this.butDisableAddrPostCode = true;

        this.postCode = null;
        this.AddressPostCodeList = [];
        this.selectPostCodeAddressId = null;
        this.PostalListShow = false;
        this.butDisabledSelectCountry = true;
        break;

      default:
        break;
    }
  }

  telInputObject(obj : any) {
   // alert(JSON.stringify(obj));
    console.log(obj);
    obj.setCountry('gb');
  }

  hasError: boolean;
 onError(obj : any) {
        this.hasError = obj;
        //alert('haserror--'+JSON.stringify(obj))
    }

  
  public onCountryChange(e: any) {

    //alert('getnumcountrychange----'+JSON.stringify(e))

    this.AboutBanksForm.value.prmPhnumber = e.dailCode;
    

  }

  public onToggleChange(e: any)
  {
   
    this.isJointAccount =  e.checked;
    this.isJointAccountHldr1 = this.isJointAccount;
    this.isJointAccountHldr2 = false;
    this.isJointAccountHldr3 = false;
    this.isJointAccountHldr4 = false;
    this.isJointAccountHldr5 = false;
        
  }

  public addJointAccountHolder(param: any)
  {
    
    switch (param) {
      case 2:
        this.isJointAccountHldr2 = true;
      break;
      case 3:
        this.isJointAccountHldr3 = true;
      break;
      case 4:
        this.isJointAccountHldr4 = true;
      break;
      case 5:
        this.isJointAccountHldr5 = true;
      break;

    }
        
  }

  getNumber(e:any)
  {
    //alert('getnumber--'+JSON.stringify(e))
  }

  stateGroups: StateGroup[] = [{
    letter: 'A',
    names: ['Apna Bank', 'Alhabad Bank', 'Asian Bank']
  }, {
    letter: 'B',
    names: ['	Barclays','Banco Santander', 'BNP Paribas', 'Bank of Amaerica']
  }, {
    letter: 'C',
    names: ['Crédit Agricole','Credit Suisse']
  }, {
    letter: 'D',
    names: ['DZ Bank','Deutsche Bank']
  }, {
    letter: 'E',
    names: ['Elliot Bank']
  }, {
    letter: 'G',
    names: ['Groupe BPCE']
  }, {
    letter: 'I',
    names: ['Icici Bank', 'Intesa Sanpaolo', 'IDBI Bank', 'Ing Vysya']
  }];

  private _filterGroup(value: string): StateGroup[] {
    if (value) {
      return this.stateGroups
        .map(group => ({letter: group.letter, names: _filter(group.names, value)}))
        .filter(group => group.names.length > 0);
    }
  
    return this.stateGroups;
  }
}
export const _filter = (opt: string[], value: string): string[] => {
const filterValue = value.toLowerCase();

return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};

export interface StateGroup {
letter: string;
names: string[];
}



  
