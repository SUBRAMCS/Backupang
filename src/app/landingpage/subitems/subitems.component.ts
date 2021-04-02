import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UsersService } from 'src/app/core/services/users.service';
import { ValueItemService } from 'src/app/core/services/valueableitems.service';
import { FormBuilder, FormGroup, Validators, ValidationErrors, FormControl, AbstractControl, NgForm } from '@angular/forms';
import { LandingpageComponent } from 'src/app/landingpage/landingpage.component'
import { first } from 'rxjs/operators';
import { ValidatorService } from 'src/app/core/validators/validator.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { FileUploader } from "ng2-file-upload";
import { saveAs } from 'file-saver';
import { Observable , interval } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { stringify } from 'querystring';
import { CrossFieldMatcher } from '../../core/validators/cross-field-matcher';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { Moment } from 'moment';

const moment = _moment;

@Component({
  selector: 'app-subitems',
  templateUrl: './subitems.component.html',
  styleUrls: ['./subitems.component.css']
})
export class SubItemsComponent implements OnInit {
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
  AddInfoDetailsForm: FormGroup;
  userInfo: any;
  showPanel: boolean;
  phoneNumberpersonal: any;
  individualId: number;
  pfStatusMsgHide: boolean = false;
  loading : boolean = false;
  loadmsg: string;
  adStatusMsg: string;
  baStatusMsg: string;
  edStatusMsg: string;
  pdStatusMsg: string;
  docStatusMsg: string;
  accntStatusMsg: string;
  aiStatusMsg: string;
  alertclass: string;
  familyMap = [];
  familyMapKeysLs = [];
  selectAddr = [];
  selectContact = [];
  selectAddrId: any;
  selectContactId: any;
  accountNumber: any;
  selectAcct = [];
  selectBankAcctList: any;
  butDisable = true;
  butDisableContact = true;
  leader1: string;
  memberId1: any;
  memberId: any;
  memberId_temp: any;
  selFamMemberId: number;
  setAddrMan: boolean;
  butDisAddJoint: boolean;
  showEmailError: boolean=false;
  showPhoneError: boolean=false;
  afStatusMsgHide: boolean = true;
  cfStatusMsgHide: boolean = true;
  dfStatusMsgHide: boolean = true;
  enableInputs: boolean = true;
  AccountDetailsFlag: boolean = true;
  AddressDetailBankLink: boolean = true;
  ContactDetailLink: boolean = true;
  AddressDetailShow: boolean;
  EmailDetailShow: boolean;
  PhoneDetailShow: boolean;
  DocumentDetailShow: boolean;
  AddInfoDetailShow: boolean;
  RequirementDetailShow: boolean;
  PostalListShow: boolean;
  ShowPostalBox: boolean;
  selectedAddressId: number;
  selectPostCodeAddressId: number;
  selectBankId: number;
  selectBankName: string;
  selectedBankAccntDtls: any;
  getAllBankAccntDtls: any;
  getAllFamilyMemberList: any;
  AddressList = [];
  UniversalAddressList = [];
  UniversalAddressList_temp = [];
  AddressPostCodeList = [];
  TitleList = [];
  RelationshipList = [];
  GenderList = [];
  CountryList = [];
  AddressList_temp = [];
  selectedEmailId: number;
  selectedPhoneId: number;
  selectedDocumentId: number;
  selectCountry: string;
  selectTempCountry: string;
  letter: string;
  valItemId: string;
  valAccountId: string;
  vaAccntExtsnId: String;
  bankName: string;
  selUsrAccnt: number;
  BankList = [];
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
  documentPath: string;
  attachDocName: string;
  postCode: string;
  requiredId: string;
  result: string = '';
  emailAddressOne: string;
  emailAddressTwo: string;
  websiteUrl: string;
  addInfoBank: string;
  additionalAccountInfo: string;
  additionalInformation: string;
  addressflag: number;
 
  flag: Number;
  filteredOptions: Observable<string[]>;
  BankIndividualId: number;
  AddressId: number;
  ContactId: number;
  isJointAccount: boolean = false;
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
  showJointAccntLink1: boolean;
  showJointAccntLink2: boolean;
  showJointAccntLink3: boolean;
  showJointAccntLink4: boolean;
  selectedJointAccnt: boolean;
  countryCodePrim: string;
  countryCodeSec: string;
  JMember: string;
  arr = [] as any;
  validatePostcode: boolean; 
  errorMatcher: CrossFieldMatcher;
  vaAccntExtsnAccntId: String;
  selectedAccountHldrNo: number;
  addJointAccntHldr: boolean;
  cntryPrmInputObj: any;
  cntrySecInputObj: any;
  minDate: Date;
  maxDate: Date;
  
  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private valueItemService: ValueItemService,
    private validatorService: ValidatorService,
    private land: LandingpageComponent,
    private dialogService: DialogService
  ) {
    this.userInfo = null;
    this.errorMatcher = new CrossFieldMatcher();
    this.maxDate = new Date();
  }

  ngOnInit() {
    this.initForms();
    this.filteredOptions = this.AboutBanksForm.get('bankName').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    this.showPanel = false;
    this.baStatusMsg = null;
    this.aiStatusMsg = null;
    this.butDisabledSelectCountry = true;
    this.ShowPostalBox = false;
    this.PostalListShow = false;
    this.butDisable = false;
    this.EmailDetailShow = true;
    this.PhoneDetailShow = true;
    this.DocumentDetailShow = true;
    this.AddInfoDetailShow = true;
    this.RequirementDetailShow = true;
    this.selFamMemberId = null;
    this.selectedAddressId = null;
    this.selectPostCodeAddressId = null;
    this.selectedEmailId = null;
    this.selectedPhoneId = null;
    this.selectedDocumentId = null;
    this.selectCountry = null;
    this.selectTempCountry = null;
    this.selUsrAccnt = null;
    this.selectPostCodeAddressId = null;
    this.butDisable = true;
    this.butDisableEmail = true;
    this.butDisablePhone = true;
    this.butDisableDocument = true;
    this.butDisableAddrPostCode = false;
    this.ActiveDocumentIdentifier = null;
    this.documentPath =null;
    this.attachDocName=null;
    this.postCode = null;
    this.PostalListShow = null;
    this.requiredId = null;
    this.addressflag = 0;
    this.butDisableUniversalList = false;
    this.additionalInformation = "";
    this.emailAddressOne = "";
    this.emailAddressTwo = "";
    this.websiteUrl = "";
    this.addInfoBank = "";
    this.valAccountId = null;
    this.vaAccntExtsnId = null;
    this.vaAccntExtsnAccntId = null;
    this.validatePostcode = false;
    this.countryCodePrim = "1";
    this.countryCodeSec = "44";
    this.selectedJointAccnt = false;
    this.selectedAccountHldrNo = 0;
    this.addJointAccntHldr = true;
    this.isJointAccountHldr1 = false;
    this.isJointAccountHldr2 = false;
    this.isJointAccountHldr3 = false;
    this.isJointAccountHldr4 = false;
    this.isJointAccountHldr5 = false;
    this.cntryPrmInputObj = null;
    this.cntrySecInputObj = null;
    this.loading=false;
  } 

  _filter(value: string): string[] {

    const filterValue = value.toLowerCase();
    return this.BankList.filter(option => option.toLowerCase().includes(filterValue));
  }

  initForms() {

    
    //this.fetchBankAccountList();
    this.fetchFamilyMembers();
    this.initAbouttheBankForm();
    this.initPersonalDetailsForm();
    this.initAccountDetailsForm();
    this.initDocDetailsForm();
    this.initAddInfoDetailsForm();
    this.initAddressDetailsForm();
    this.closeMessage();
   
  }

  AddressPostCodeMapping(param: string) {
    for (let i in this.AddressPostCodeList) {
      if (this.AddressPostCodeList[i].line_1 == param) {
        return i;
      }
    }
  }

  fetchFamilyMembers = () => {
    this.usersService.fetchFamilyMembers_temp()
      .pipe(first())
      .subscribe(
        data => {
          console.log('check fam member dtls---'+JSON.stringify(data));
          this.loading=true;
          this.fetchBankAccountDtls();          
          this.getAllFamilyMemberList = data['familyMembers']; 
         
          this.UniversalAddressList = [];
          for (let i in data['universalAddressDetail']) {
            data['universalAddressDetail'][i].addressId = i;
            this.UniversalAddressList.push(data['universalAddressDetail'][i]);
          }
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

  initAbouttheBankForm = () => {
    this.AboutBanksForm = this.formBuilder.group({
      valItemId: [''],
      bankName: ['', Validators.compose([Validators.required])],
      selectCountry: [''],
      address: [''],
      emailAddressOne: ['', [this.forbiddenEmailOneValidator.bind(this),Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')]],
      emailAddressTwo: ['', [this.forbiddenEmailTwoValidator.bind(this),Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')]],
      prmCountryCode: [''],
      scndCountryCode: [''],
      phoneNumPrim: ['',[this.forbiddenPhoneOneValidator.bind(this)]],
      phoneNumSec: ['',[this.forbiddenPhoneTwoValidator.bind(this)]],
      postCode: [''],
      websiteUrl: [''],
      addInfoBank: [''],
      selectPostCodeAddressId: ['']
    },{
      validators: this.validatorService.matchValue
    });
    this.AboutBanksForm.controls.selectCountry.disable();
    this.AboutBanksForm.disable();
  }

  forbiddenEmailOneValidator(control:AbstractControl):{[key: string]: any} | null{

    let forbidden=false;
    let loadData = null;
  if(this.AboutBanksForm!=undefined){
    if(this.AboutBanksForm.value.emailAddressTwo!=null && this.AboutBanksForm.value.emailAddressTwo!=''){
      if(control.value===this.AboutBanksForm.value.emailAddressTwo){
          forbidden= true;
        }
      }
    }
    return forbidden?{'forbiddenMail':{value:control.value}}:null;
  }

  forbiddenEmailTwoValidator(control:AbstractControl):{[key: string]: any} | null{

     let forbidden=false;
     let loadData = null;
   if(this.AboutBanksForm!=undefined){
    if(this.AboutBanksForm.value.emailAddressOne!=null && this.AboutBanksForm.value.emailAddressOne!=''){
     if(control.value===this.AboutBanksForm.value.emailAddressOne){
         forbidden= true;
       }
     }
    }
     return forbidden?{'forbiddenMail':{value:control.value}}:null;
   }

   forbiddenPhoneOneValidator(control:AbstractControl):{[key: string]: any} | null{

     let forbidden=false;
     let loadData = null;
   if(this.AboutBanksForm!=undefined){
    if(this.AboutBanksForm.value.phoneNumSec!=null && this.AboutBanksForm.value.phoneNumSec!=''){
      if((this.countryCodePrim===this.countryCodeSec) && (control.value===this.AboutBanksForm.value.phoneNumSec)){
          forbidden= true;
        }
      }
     }
     return forbidden?{'forbiddenPhone':{value:control.value}}:null;
   }
 
   forbiddenPhoneTwoValidator(control:AbstractControl):{[key: string]: any} | null{
 
    let forbidden=false;
      let loadData = null;
 
    if(this.AboutBanksForm!=undefined){
      if(this.AboutBanksForm.value.phoneNumPrim!=null && this.AboutBanksForm.value.phoneNumPrim!=''){
        if((this.countryCodePrim===this.countryCodeSec) && (control.value===this.AboutBanksForm.value.phoneNumPrim)){
            forbidden= true;
          }
       }
      }
      return forbidden?{'forbiddenPhone':{value:control.value}}:null;
    }

    forbiddenFutureDateValidator(control:AbstractControl):{[key: string]: any} | null{

      const momentDate = new Date();

      const formattedDate = moment.now ;  
      let forbidden=false;
      let loadData = null;
      if(this.AccountDetailsForm!=undefined){
        if(this.AccountDetailsForm.value.accountOpenDate!=''){
          if(control.value===this.AboutBanksForm.value.emailAddressTwo){
              forbidden= true;
            }
          }
        }
      return forbidden?{'forbiddenFutureDate':{value:control.value}}:null;
    }
 

  initAddressDetailsForm = () => {

    this.AddressDetailsForm = this.formBuilder.group({
      addressLine1: [''],
      addressLine2: [''],
      addressLine3: [''],
      addressLine4: [''],
      postCode: [''],
      countryState: [''],
      country: [''],
      selectPostCodeAddressId: ['']
    });

    this.AddressDetailsForm.disable();
  }

  initPersonalDetailsForm = () => {
    this.PersonalDetailsForm = this.formBuilder.group({
      selFamMemberId: ['',[Validators.required]],
      title: [''],
      firstName: ['', [Validators.pattern('^[a-zA-Z]+[a-zA-Z\.\'\,\-]+[a-zA-Z]+$|^[a-zA-Z]+$'), Validators.maxLength(50), Validators.minLength(1)]],
      middleName: ['', [Validators.pattern('^[a-zA-Z]+[a-zA-Z\.\'\,\-]+[a-zA-Z]+$|^[a-zA-Z]+$'), Validators.maxLength(50), Validators.minLength(0)]],
      lastName: ['', [Validators.pattern('^[a-zA-Z]+[a-zA-Z\.\'\,\-]+[a-zA-Z]+$|^[a-zA-Z]+$'), Validators.maxLength(50), Validators.minLength(1)]],
      gender: [''],
      dateOfBirth: ['', [this.validatorService.ageEligibility]],
      selectedAddressId: [''],
      addressLine1 : [''],
      addressLine2 : [''],
      addressLine3 : [''],
      addressLine4 : [''],
      postCode : [''],
      countryState : [''],
      selectedEmailId: [''],
      selectedPhoneId: ['']
    });

    this.PersonalDetailsForm.disable();
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
      showJointAccntLink1: [false],
      showJointAccntLink2: [false],
      showJointAccntLink3: [false],
      showJointAccntLink4: [false],
      jointAccountHolderLst: [''],
      additionalAccountInfo: ['']
    });
    this.AccountDetailsForm.disable();
  }

  initDocDetailsForm = () => {
    this.DocDetailsForm = this.formBuilder.group({
      documentType: [''],
      countryOfIssue: [''],
      documentNumber: [''],
      issueingAuthority: [''],
      issueDate: [''],
      expiaryDate: [''],
      additionalInformation: [''],
      selectedDocumentId: ['']
    });
    this.DocDetailsForm.disable();
  }

  initAddInfoDetailsForm = () => {
    this.AddInfoDetailsForm = this.formBuilder.group({
      additionalInformation: ['']
    });
    this.AddInfoDetailsForm.disable();
  }

  showSection(param: string) {

    this.land.showSection(param);
  }

  //Toggle forms edit state
  toggleEditState = (form: string) => {
    switch (form) {
      case 'AboutBanksForm':
          this.DocumentDetailShow = true;
          this.AddInfoDetailShow = true;
          this.AccountDetailsForm.disable();
          this.PersonalDetailsForm.disable();
        if (this.AboutBanksForm.status !== 'DISABLED') {
          this.AboutBanksForm.disable();
        } else {

          if (!this.enableInputs) {
            this.setAddrMan = true;
            this.AboutBanksForm.controls.selectCountry.disable();
            this.AboutBanksForm.controls.emailAddressOne.disable();
            this.AboutBanksForm.controls.emailAddressTwo.disable();
            this.AboutBanksForm.controls.prmCountryCode.disable();
            this.AboutBanksForm.controls.scndCountryCode.disable();
            this.AboutBanksForm.controls.phoneNumPrim.disable();
            this.AboutBanksForm.controls.phoneNumSec.disable();
            this.AboutBanksForm.controls.websiteUrl.disable();
            this.AboutBanksForm.controls.addInfoBank.disable();
            this.AboutBanksForm.controls.postCode.disable();
            this.AboutBanksForm.controls.bankName.disable();
            this.AboutBanksForm.controls.selectPostCodeAddressId.disable();
          } else {
            this.setAddrMan = false;
            this.AboutBanksForm.controls.bankName.enable();
            this.AboutBanksForm.controls.selectCountry.enable();
            this.AboutBanksForm.controls.postCode.enable();
            this.AboutBanksForm.controls.selectPostCodeAddressId.enable();
            this.AboutBanksForm.controls.emailAddressOne.enable();
            this.AboutBanksForm.controls.emailAddressTwo.enable();
            this.AboutBanksForm.controls.prmCountryCode.enable();
            this.AboutBanksForm.controls.scndCountryCode.enable();
            this.AboutBanksForm.controls.phoneNumPrim.enable();
            this.AboutBanksForm.controls.phoneNumSec.enable();
            this.AboutBanksForm.controls.websiteUrl.enable();
            this.AboutBanksForm.controls.addInfoBank.enable();
            if(this.addressflag===0){
              this.butDisable = false;
              this.AddressDetailsForm.enable();
            }
          }
        }
        break;

      case 'PersonalDetailsForm':

          this.DocumentDetailShow = true;
          this.AddInfoDetailShow = true;
          this.AccountDetailsForm.disable();
          this.AboutBanksForm.disable();
        if (this.PersonalDetailsForm.status !== 'DISABLED') {
          this.PersonalDetailsForm.disable();
          this.PersonalDetailsForm.controls.selectedAddressId.disable();
        } else {
          this.PersonalDetailsForm.controls.selFamMemberId.enable();
          this.PersonalDetailsForm.controls.selectedAddressId.enable();
          this.PersonalDetailsForm.controls.selectedEmailId.enable();
          this.PersonalDetailsForm.controls.selectedPhoneId.enable();
          
        }
        break;
      case 'AccountDetailsForm':
        this.DocumentDetailShow = true;
        this.AddInfoDetailShow = true;
          this.PersonalDetailsForm.disable();
          this.AboutBanksForm.disable();
        this.AccountDetailsFlag = false;
        if (this.AccountDetailsForm.status !== 'DISABLED') {
          this.butDisAddJoint=true;
          this.AccountDetailsForm.disable();
          this.addJointAccntHldr =true;
        } else {
          this.butDisAddJoint=false;
          this.AccountDetailsForm.enable();
          this.addJointAccntHldr =false;

        }
        break;
      case 'DocDetailsForm':
          this.AddInfoDetailShow = true;
          this.AccountDetailsForm.disable();
          this.PersonalDetailsForm.disable();
          this.AboutBanksForm.disable();
        if (this.DocumentDetailShow !== false) {
          this.DocDetailsForm.enable();
          this.DocumentDetailShow = false;
          this.DocDetailsForm.controls.documentType.enable();
          this.DocDetailsForm.controls.documentNumber.enable();
          this.DocDetailsForm.controls.selectedDocumentId.enable();
          this.DocDetailsForm.controls.countryOfIssue.enable();
          this.DocDetailsForm.controls.issueingAuthority.enable();
          this.DocDetailsForm.controls.issueDate.enable();
          this.DocDetailsForm.controls.expiaryDate.enable();
          this.DocDetailsForm.controls.additionalInformation.enable();
        }
        else {
          this.DocumentDetailShow = true;
          this.butDisableDocument = false;
          this.DocDetailsForm.enable();
          this.DocDetailsForm.controls.documentType.disable();
          this.DocDetailsForm.controls.documentNumber.disable();
          this.DocDetailsForm.controls.countryOfIssue.disable();
          this.DocDetailsForm.controls.issueingAuthority.disable();
          this.DocDetailsForm.controls.selectedDocumentId.disable();
          this.DocDetailsForm.controls.issueDate.disable();
          this.DocDetailsForm.controls.expiaryDate.disable();
          this.DocDetailsForm.controls.additionalInformation.disable();
        }
        if (this.DocumentList.length > 0) {
          this.uploader.clearQueue();
          this.ActiveDocumentIdentifier = this.DocumentList[0].documentIdentifier;
          this.DocDetailsForm.patchValue(this.DocumentList[0]);
         // this.DocDetailsForm.patchValue({"selectedDocumentId": this.DocumentList[0].documentId});
          this.selectedDocumentId = this.DocumentList[0].documentId;
          this.DocDetailsForm.enable();
        }
        else {
          this.selectedDocumentId = null;
          this.uploader.clearQueue();
        }
        break;
        case 'AddInfoDetailsForm':
          this.DocumentDetailShow = true;
          this.AddInfoDetailShow =false;
          this.PersonalDetailsForm.disable();
          this.AccountDetailsForm.disable();
          this.AboutBanksForm.disable();
        if (this.AddInfoDetailsForm.status !== 'DISABLED') {
          this.AddInfoDetailsForm.disable();
          //this.AddInfoDetailShow = false;
        } else {
         // this.AddInfoDetailShow = true;
          this.AddInfoDetailsForm.enable();
        }
        break;

      default:
        break;
    }
  }

  resetForm = (form: string) => {
   
    switch (form) {
      case 'AboutBanksForm':
        this.setAddrMan = true;
        if(this.selectedBankAccntDtls!=null){
          this.AboutBanksForm.patchValue(this.selectedBankAccntDtls);
          this.AddressDetailsForm.patchValue(this.selectedBankAccntDtls);    
        }else{
          this.initAbouttheBankForm();
          this.initAddressDetailsForm();
        }
        this.AboutBanksForm.controls.selectCountry.disable();
        this.AboutBanksForm.disable();
        this.AddressDetailsForm.disable();
      break;
      case 'PersonalDetailsForm':
        if(this.selectedBankAccntDtls!=null){
          this.PersonalDetailsForm.patchValue(this.selectedBankAccntDtls.personalDetail);
          this.selectFamilyMemDtl(this.selectedBankAccntDtls.personalDetail.selFamMemberId);
          this.selFamMemberId = this.selectedBankAccntDtls.personalDetail.selFamMemberId;
          this.selFamMemberId = this.selectedBankAccntDtls.personalDetail.selFamMemberId;
          this.AddeClk(this.selectedBankAccntDtls.personalDetail.addressId);
          this.PersonalDetailsForm.patchValue({"selFamMemberId": this.selFamMemberId});
          this.selectedAddressId = this.selectedBankAccntDtls.personalDetail.addressId;
          this.selectedEmailId = this.selectedBankAccntDtls.personalDetail.emailId;
          this.selectedPhoneId = this.selectedBankAccntDtls.personalDetail.phoneId;
          this.AddeEmail(this.selectedEmailId);
          this.AddePhone(this.selectedPhoneId);          
        }else{
          this.initPersonalDetailsForm();
        }
        this.PersonalDetailsForm.disable();
      break;
      case 'AccountDetailsForm':
        this.butDisAddJoint = true;

        if(this.selectedBankAccntDtls!=null){
          this.AccountDetailsForm.patchValue(this.selectedBankAccntDtls.bankAccountDto);
          this.vaAccntExtsnId = this.selectedBankAccntDtls.personalDetail.vaAccntExtsnId;
          this.vaAccntExtsnAccntId = this.selectedBankAccntDtls.bankAccountDto.vaAccntExtsnAccntId;
          this.isJointAccount = this.selectedBankAccntDtls.bankAccountDto.jointAccount;
          this.selectedJointAccnt = this.isJointAccount;
          this.isJointAccountHldr1 = false;
          this.isJointAccountHldr2 = false;
          this.isJointAccountHldr3 = false;
          this.isJointAccountHldr4 = false;
          this.isJointAccountHldr5 = false;
          if(this.selectedJointAccnt){
            if(this.selectedBankAccntDtls.bankAccountDto.jntAccntHldrName1!=null && this.selectedBankAccntDtls.bankAccountDto.jntAccntHldrName1 !=''){
              this.isJointAccountHldr1 = true;
            }
            if(this.selectedBankAccntDtls.bankAccountDto.jntAccntHldrName2!=null && this.selectedBankAccntDtls.bankAccountDto.jntAccntHldrName2 !=''){
              this.isJointAccountHldr2 = true;
            }
            if(this.selectedBankAccntDtls.bankAccountDto.jntAccntHldrName3!=null && this.selectedBankAccntDtls.bankAccountDto.jntAccntHldrName3 !=''){
              this.isJointAccountHldr3 = true;
            }
            if(this.selectedBankAccntDtls.bankAccountDto.jntAccntHldrName4!=null && this.selectedBankAccntDtls.bankAccountDto.jntAccntHldrName4 !=''){
              this.isJointAccountHldr4 = true;
            }
            if(this.selectedBankAccntDtls.bankAccountDto.jntAccntHldrName5!=null && this.selectedBankAccntDtls.bankAccountDto.jntAccntHldrName5 !=''){
              this.isJointAccountHldr5 = true;
            }
          }
        }else{
          this.initAccountDetailsForm();
        }
        this.AccountDetailsForm.disable();
      break;
      case 'DocDetailsForm':

      if(this.selectedBankAccntDtls!=null && this.selectedBankAccntDtls.documentDetail!=null){
        this.DocumentList = this.selectedBankAccntDtls.documentDetail;
            if(this.DocumentList!=null && this.DocumentList.length >0){
      
              this.DocDetailsForm.patchValue(this.DocumentList[0]);
              this.selectedDocumentId = this.DocumentList[0].documentId;
              this.ActiveDocumentIdentifier =this.DocumentList[0].documentIdentifier;
              this.documentPath = this.DocumentList[0].documentStorePath;
              this.attachDocName = this.DocumentList[0].documentIdentifier;
            }
      } else{
          this.initDocDetailsForm();
        }
        this.DocDetailsForm.disable();
        this.DocumentDetailShow = true;
        this.butDisableDocument = true;
      break;
      case 'AddInfoDetailsForm':
        this.AddInfoDetailShow = true;
        if(this.selectedBankAccntDtls!=null){
          this.AddInfoDetailsForm.patchValue(this.selectedBankAccntDtls.personalDetail);
        }else{
          this.initAddInfoDetailsForm();
        }
        this.AddInfoDetailsForm.disable();
      break;

      default:
        break;
    }
  }

  onSubmit = (form: string) => {
    let payload = null;
    switch (form) {
      case 'AboutBanksForm':
        payload = this.AboutBanksForm.value;
        payload.addressLine1 = this.AddressDetailsForm.value.addressLine1;
        payload.addressLine2 = this.AddressDetailsForm.value.addressLine2;
        payload.addressLine3 = this.AddressDetailsForm.value.addressLine3;
        payload.addressLine4 = this.AddressDetailsForm.value.addressLine4;
        if(this.selectCountry!=undefined && this.selectCountry!=null){
          payload.selectCountry = this.selectCountry;
        }
        payload.postCode = this.AddressDetailsForm.value.postCode;
        payload.countryState = this.AddressDetailsForm.value.countryState;
      
        if(this.AboutBanksForm.value.phoneNumPrim!=undefined && this.AboutBanksForm.value.phoneNumPrim!=null && this.AboutBanksForm.value.phoneNumPrim!=''){
          payload.phoneNumPrim = this.AboutBanksForm.value.phoneNumPrim;
          payload.countryCodePrim = this.countryCodePrim;
        }
        if(this.AboutBanksForm.value.phoneNumSec!=undefined  && this.AboutBanksForm.value.phoneNumSec!=null && this.AboutBanksForm.value.phoneNumSec!= ''){
          payload.phoneNumSec = this.AboutBanksForm.value.phoneNumSec;
          payload.countryCodeSec = this.countryCodeSec;
        }
        payload.valAccountId = this.valAccountId;
        payload.individualId = this.individualId;
        payload.addressflag = this.addressflag;
        
        break;
      case 'PersonalDetailsForm':
        payload = this.PersonalDetailsForm.value;
        payload.valAccntId = this.valAccountId;
        payload.individualId = this.PersonalDetailsForm.value.selFamMemberId;
        payload.vaAccntExtsnId = this.vaAccntExtsnId;
        payload.addressId = this.PersonalDetailsForm.value.selectedAddressId;
        payload.emailId = this.PersonalDetailsForm.value.selectedEmailId;
        payload.phoneId = this.PersonalDetailsForm.value.selectedPhoneId;

        break;
      case 'AccountDetailsForm':
        payload = this.AccountDetailsForm.value;
        payload.valAccntId = this.valAccountId;
        payload.accountNo = this.AccountDetailsForm.value.accountNo;
        payload.shortCode = this.AccountDetailsForm.value.shortCode;
        payload.accounType = this.AccountDetailsForm.value.accounType;
        payload.accountOpenDate = this.AccountDetailsForm.value.accountOpenDate;
        payload.accountHolderNo = this.AccountDetailsForm.value.accountHolderNo;
        payload.jointAccount = this.selectedJointAccnt;
        payload.jntAccntHldrName1 = this.AccountDetailsForm.value.jntAccntHldrName1;
        payload.jntAccntHldrName2 = this.AccountDetailsForm.value.jntAccntHldrName2;
        payload.jntAccntHldrName3 = this.AccountDetailsForm.value.jntAccntHldrName3;
        payload.jntAccntHldrName4 = this.AccountDetailsForm.value.jntAccntHldrName4;
        payload.jntAccntHldrName5 = this.AccountDetailsForm.value.jntAccntHldrName5;
        payload.additionalAccountInfo = this.AccountDetailsForm.value.additionalAccountInfo;
        payload.vaAccntExtsnAccntId = this.vaAccntExtsnAccntId;

      break;
      case 'AddInfoDetailsForm':
          payload={};
          payload.valAccntId = this.valAccountId;
          payload.individualId = this.PersonalDetailsForm.value.selFamMemberId;
          payload.vaAccntExtsnId = this.vaAccntExtsnId;
          payload.additionalInformation = this.AddInfoDetailsForm.value.additionalInformation;
      break;
      
      default:
        break;
    }
   
    switch (form) {
      case 'AboutBanksForm':
        this.valueItemService.saveUserbankinfo(form, payload)
          .pipe(first()).subscribe(data => {
            this.valAccountId = data;
            this.selUsrAccnt = parseInt(this.valAccountId);
            this.baStatusMsg = "Bank Account details saved/updated successfully";
            //this.fetchBankAccountList();
            this.fetchBankAccountDtls();
            this.toggleEditState('AboutBanksForm');
            this.AddressDetailsForm.disable();
            this.setAddrMan = true;
            setTimeout (() => {
              this.baStatusMsg = null;
           }, 10000);
          },
            error => {
              console.log('Error when saving the users info: ' + JSON.stringify(error));
              this.resetForm(form);
            }
          );
        break;
      case 'PersonalDetailsForm':
        this.valueItemService.saveUserBankPersonalinfo(form, payload)
          .pipe(first()).subscribe(data => {

            this.vaAccntExtsnId = data;
            this.pdStatusMsg = "Personal details saved/updated successfully";
           // this.fetchBankAccountList();
            this.fetchBankAccountDtls();
            this.toggleEditState('PersonalDetailsForm');
            this.PersonalDetailsForm.disable();
            setTimeout (() => {
              this.pdStatusMsg = null;
           }, 10000);
          },
            error => {
              console.log('Error when saving the users info: ' + JSON.stringify(error));
              this.resetForm(form);
            }
          );
       break;
       case 'AccountDetailsForm':
        this.valueItemService.saveUserBankAccntDtlInfo(form, payload)
          .pipe(first()).subscribe(data => {

            this.vaAccntExtsnAccntId = data;
            this.accntStatusMsg = "Account details saved/updated successfully";
            //this.fetchBankAccountList();
            this.fetchBankAccountDtls();
            this.toggleEditState('AccountDetailsForm');
            this.AccountDetailsForm.disable();
            this.butDisAddJoint=true;
            setTimeout (() => {
              this.accntStatusMsg = null;
           }, 10000);
          },
            error => {
              console.log('Error when saving the Accounts info: ' + JSON.stringify(error));
              this.resetForm(form);
            }
          );
       break;
       case 'AddInfoDetailsForm':
        this.valueItemService.saveUserBankAccntAdditionalInfo(form, payload)
          .pipe(first()).subscribe(data => {

            //if(parseInt(data)>0){
              this.aiStatusMsg = "Additional Information updated successfully ";
           // }
           //this.toggleEditState('AddInfoDetailsForm');
            this.AddInfoDetailShow =true;
            this.AddInfoDetailsForm.disable();
            setTimeout (() => {
              this.aiStatusMsg = null;
           }, 10000);
          },
            error => {
              console.log('Error when saving the Accounts info: ' + JSON.stringify(error));
              this.resetForm('AddInfoDetailsForm');
            }
          );
       break;
    }
    
  }

  onSubmitDoc = () => {
    let payload = this.DocDetailsForm.value;
    payload.individualId = this.individualId;
    payload.documentId = this.selectedDocumentId;   
    payload.valAccntId = this.valAccountId; 
    let formData: any = new FormData();
    for (let i = 0; i < this.uploader.queue.length; i++) {
      let fileItem = this.uploader.queue[i]._file;
      formData.append("file", fileItem);
    }

    formData.append('payload', JSON.stringify(payload));
    this.usersService.saveDocumentsValitems(formData).pipe(first()).subscribe(
      data => {
          this.DocumentDetailShow =false;
          this.docStatusMsg = "Document Detail saved/updated successfully ";
         // this.fetchBankAccountList();
          this.fetchBankAccountDtls();
          this.toggleEditState('DocDetailsForm');
          this.DocDetailsForm.disable();
          setTimeout (() => {
            this.docStatusMsg = null;
         }, 10000);
        },
        error => {
          console.log('Error when saving the users info: ' + JSON.stringify(error));
        }
      );
      
      this.DocDetailsForm.disable();
      this.DocumentDetailShow = true;
      this.butDisableDocument = false;
  }

  hideFormStatusMsg = () => {
    this.pfStatusMsgHide = !this.pfStatusMsgHide ? !this.pfStatusMsgHide : this.pfStatusMsgHide;
    this.afStatusMsgHide = !this.afStatusMsgHide ? !this.afStatusMsgHide : this.afStatusMsgHide;
    this.cfStatusMsgHide = !this.cfStatusMsgHide ? !this.cfStatusMsgHide : this.cfStatusMsgHide;
    this.dfStatusMsgHide = !this.dfStatusMsgHide ? !this.dfStatusMsgHide : this.dfStatusMsgHide;
  }

  AddeClk(param: any) {

    var counter =0;
    if(param=== -1){
    }else{
      for (let j in this.AddressList) {
        if (this.AddressList[j].addressId === parseInt(param)) {
          counter++
          this.PersonalDetailsForm.patchValue(this.AddressList[j]);
        }
      }
    }
    if(!(counter>0)){
      this.AddressList_temp.push({
        addressId: "-1",
        addressLine1: "",
        addressLine2: "",
        addressLine3: "",
        addressLine4: "",
        countryState: "",
        country: "",
        postCode: "",
        addressflag: 0
      });
      this.PersonalDetailsForm.patchValue(this.AddressList_temp[0])
    }
  }

  AddeEmail = (param: number) => {
    if (param != null && param!=0) {   
      this.PersonalDetailsForm.patchValue({"selectedEmailId": param});
    }
  }

  AddePhone = (param: number) => {
    if (param != null && param!=0) {
      this.PersonalDetailsForm.patchValue({"selectedPhoneId": param});
    }
  }

  EmailMapping(param: number) {
    for (let i in this.EmailList) {
      if (this.EmailList[i].emailId == param) {
        return i;
      }
    }
  }

  PhoneMapping(param: number) {
    for (let i in this.PhoneList) {
      if (this.PhoneList[i].phoneId == param) {
        return i;
      }
    }
  }

  AddressMapping(param: number) {
    for (let i in this.AddressList) {
      if (this.AddressList[i].addressId == param) {
        return i;
      }
    }
  }


  AddeContact(param1: any) {
    if (param1 != -1) {
      this.contactDetailsForm.patchValue(this.selectContact[param1]);
      this.ContactId = this.selectContact[param1].contactId;
    }
  }

  AcctClk(param1: any) {
    this.AccountDetailsForm.patchValue(this.selectAcct[param1]);
    this.addressDetailsBank.patchValue(this.selectAcct[param1]);

    for (let k in this.selectAddr) {
      if (this.selectAddr[k].addressId == this.selectAcct[param1].addressId) {
        this.addressDetails.patchValue(this.selectAddr[k]);
        break;
      }
    }
    this.AccountDetails.disable();
    this.addressDetails.disable();
    //  this.butDisable = true;
    this.selectAddrId = -1;
  }

  panelClk = (param: any) => {

    this.showPanel = true;
    this.selectCountry = null;
    this.AddressDetailsForm.disable();
    this.butDisable = true;
    this.butDisabledSelectCountry = true;
    this.ShowPostalBox = false;
    this.PostalListShow = false;
    this.butDisable = false;
    this.valAccountId = null;
    this.AddressDetailShow = true;
    this.selectPostCodeAddressId = null;
    this.selectedEmailId = null;
    this.selFamMemberId = null;
    this.selectedPhoneId = null;
    this.selectedDocumentId = null;
    this.ActiveDocumentIdentifier = null;
    this.documentPath = null;
    this.attachDocName = null;
    this.baStatusMsg = null;
    this.aiStatusMsg = null;
    this.addJointAccntHldr = true;
    this.isJointAccountHldr1 = false;
    this.isJointAccountHldr2 = false;
    this.isJointAccountHldr3 = false;
    this.isJointAccountHldr4 = false;
    this.isJointAccountHldr5 = false;
    this.selectedJointAccnt = false;
    this.DocumentDetailShow = true;
    this.butDisableDocument = true;
    this.setAddrMan = true;
    this.pfStatusMsgHide =false;
    this.butDisAddJoint=true;
    this.DocumentList = [];
    this.uploader.clearQueue();
    this.closeMessage();

    if (this.selUsrAccnt === -1) {
      this.initAbouttheBankForm();
      this.initAddressDetailsForm();
      this.initPersonalDetailsForm();
      this.initDocDetailsForm();
      this.initAccountDetailsForm();
    }
    else {
    
      this.selectedBankAccntDtls = this.getAllBankAccntDtls[param];
      this.individualId = this.selectedBankAccntDtls.individualId;
      this.AboutBanksForm.patchValue(this.selectedBankAccntDtls);
      this.addressflag = this.selectedBankAccntDtls.addressflag;
      this.AddressDetailsForm.patchValue(this.selectedBankAccntDtls);
      this.PersonalDetailsForm.patchValue(this.selectedBankAccntDtls.personalDetail);
      this.selectFamilyMemDtl(this.selectedBankAccntDtls.personalDetail.selFamMemberId);
      this.selFamMemberId = this.selectedBankAccntDtls.personalDetail.selFamMemberId;
      this.AddeClk(this.selectedBankAccntDtls.personalDetail.addressId);
      this.PersonalDetailsForm.patchValue({"selFamMemberId": this.selFamMemberId});
      this.selectedAddressId = this.selectedBankAccntDtls.personalDetail.addressId;
      this.PersonalDetailsForm.patchValue({"selectedAddressId": this.selectedAddressId});
      this.selectedEmailId = this.selectedBankAccntDtls.personalDetail.emailId;
      this.selectedPhoneId = this.selectedBankAccntDtls.personalDetail.phoneId;
      this.AddeEmail(this.selectedEmailId);
      this.AddePhone(this.selectedPhoneId);
      //this.PersonalDetailsForm.controls.selFamMemberId.setValue(this.selFamMemberId);
      this.valAccountId = this.selectedBankAccntDtls.valAccountId;
      this.AccountDetailsForm.patchValue(this.selectedBankAccntDtls.bankAccountDto);
      this.vaAccntExtsnId = this.selectedBankAccntDtls.personalDetail.vaAccntExtsnId;
      this.vaAccntExtsnAccntId = this.selectedBankAccntDtls.bankAccountDto.vaAccntExtsnAccntId;
      this.isJointAccount = this.selectedBankAccntDtls.bankAccountDto.jointAccount;
      this.selectedJointAccnt = this.isJointAccount;

      if(this.selectedJointAccnt){
        if(this.selectedBankAccntDtls.bankAccountDto.jntAccntHldrName1!=null && this.selectedBankAccntDtls.bankAccountDto.jntAccntHldrName1 !=''){
          this.isJointAccountHldr1 = true;
        }
        if(this.selectedBankAccntDtls.bankAccountDto.jntAccntHldrName2!=null && this.selectedBankAccntDtls.bankAccountDto.jntAccntHldrName2 !=''){
          this.isJointAccountHldr2 = true;
        }
        if(this.selectedBankAccntDtls.bankAccountDto.jntAccntHldrName3!=null && this.selectedBankAccntDtls.bankAccountDto.jntAccntHldrName3 !=''){
          this.isJointAccountHldr3 = true;
        }
        if(this.selectedBankAccntDtls.bankAccountDto.jntAccntHldrName4!=null && this.selectedBankAccntDtls.bankAccountDto.jntAccntHldrName4 !=''){
          this.isJointAccountHldr4 = true;
        }
        if(this.selectedBankAccntDtls.bankAccountDto.jntAccntHldrName5!=null && this.selectedBankAccntDtls.bankAccountDto.jntAccntHldrName5 !=''){
          this.isJointAccountHldr5 = true;
        }
      }

      this.DocumentList = this.selectedBankAccntDtls.documentDetail;
      if(this.DocumentList!=null && this.DocumentList.length >0){

        this.DocDetailsForm.patchValue(this.DocumentList[0]);
        this.selectedDocumentId = this.DocumentList[0].documentId;
        this.ActiveDocumentIdentifier =this.DocumentList[0].documentIdentifier;
        this.documentPath = this.DocumentList[0].documentStorePath;
        this.attachDocName = this.DocumentList[0].documentIdentifier;
      }else{
        this.initDocDetailsForm();
      }
      this.AddInfoDetailsForm.patchValue(this.selectedBankAccntDtls.personalDetail);


    }
    this.AboutBanksForm.disable();
    this.AddressDetailsForm.disable();
    this.PersonalDetailsForm.disable();
    this.AccountDetailsForm.disable();
    this.DocDetailsForm.disable();
    this.AddInfoDetailsForm.disable();

  }

  fetchUtilityMembers = () => {
    this.TitleList = [];
    this.GenderList = [];
    this.CountryList = [];
    this.usersService.fetchUtilityList()
      .pipe(first())
      .subscribe(
        data => {

          console.log(data);

          for (let i in data['countrycode']) {
           
            this.CountryList.push(data['countrycode'][i]);
          }

          for (let i in data['title']) {
            this.TitleList.push(data['title'][i]);
          }

          for (let i in data['gender']) {
            this.GenderList.push(data['gender'][i]);
          }

          for (let i in data['relationship']) {
            if (data['relationship'][i].relationship_type == 'Family') {
              this.RelationshipList.push(data['relationship'][i]);
            }
          }
          

        });
  }

  AddeSelectCountry = (param: string) => {
  
    if (param != null && param != undefined) {
      var paramTemp = '0';
      for (let i in this.CountryList) {
        if (this.CountryList[i].country_name === param) {
          paramTemp = i;
        }
      }
      this.selectTempCountry = paramTemp;
      this.selectPostCodeAddressId = null;
      this.PostalListShow = false;
      this.butDisable = false;
      this.ShowPostalBox = false;
      this.UniversalAddressList_temp = [];
      this.AddressList = this.AddressList_temp;
      this.AboutBanksForm.controls.postCode.enable();

      this.AddressList.push({
        addressId: "-2",
        addressLine1: "Others",
        addressLine2: "",
        addressLine3: "",
        addressLine4: "",
        countryState: "",
        country: "",
        postCode: "",
        addressflag: 0
      });

      this.AddressList = [];
      for (let i in this.UniversalAddressList) {
        if (this.UniversalAddressList[i].country == this.CountryList[paramTemp].country_name) {

          this.AddressList.push(this.UniversalAddressList[i]);
        }
      }    

      this.AddressDetailsForm.controls.country.setValue(this.CountryList[paramTemp].country_name);

      if (this.CountryList[paramTemp].search_flag == 'N') {
          this.initAddressDetailsForm();
          this.addressflag = 0;
          this.butDisable = false;
          this.AddressDetailsForm.enable();
      }
      else {
          this.initAddressDetailsForm();
          this.addressflag = 1;
          this.postCode=null;
          this.butDisable = false;
          this.ShowPostalBox = true;
        
      }
    }
  }

  AddeDocument = (param: number) => {

    if(param==0){
      this.initDocDetailsForm();
      this.uploader.clearQueue();
      this.ActiveDocumentIdentifier = null;
      this.DocDetailsForm = this.formBuilder.group({
        documentType: [''],
        countryOfIssue: [''],
        documentNumber: [''],
        issueingAuthority: [''],
        issueDate: [''],
        expiaryDate: [''],
        additionalInformation: [''],
        selectedDocumentId: ['']
      });
    } else{

      this.DocDetailsForm.patchValue(this.DocumentList[this.DocumentMapping(param)]);
    this.ActiveDocumentIdentifier = this.DocumentList[this.DocumentMapping(param)].documentIdentifier;
    this.uploader.clearQueue();
    }  
   // this.uploader.clearQueue();
  }

  DownloadFile() {
    this.usersService.downloadFiles(this.selectedDocumentId.toString())
      .subscribe(data => {
        saveAs(new Blob([data], { type: '' }), this.ActiveDocumentIdentifier)


      });
  }

  DocumentMapping(param: number) {
    for (let i in this.DocumentList) {
      if (this.DocumentList[i].documentId == param) {
        return i;
      }
    }
  }

  fetchAddressForPostCode = (postalCode: string) => {

    if (postalCode != '' && postalCode.length == 0) {

      return;
    }
    
    this.initAddressDetailsForm();
    this.usersService.fetchAddressForPostCode(postalCode)
      .pipe(first())
      .subscribe(
        data => {
        
          if (data['result']) {

            this.AddressPostCodeList = data['result'];
            
            if(this.AddressPostCodeList != null && this.AddressPostCodeList.length >0){
              this.butDisable = false;
              this.initAddressDetailsForm();
              this.AddressDetailsForm.controls.country.setValue(this.CountryList[this.selectTempCountry].country_name);
              this.ShowPostalBox = true;
              this.PostalListShow = true;
              this.butDisable = false;
              this.pfStatusMsgHide = false;
            }
            else{
              this.pfStatusMsgHide = true;
            }

          }
        },
        error => {
          this.pfStatusMsgHide = true;
        });
  }

  AddAddressManually() {

    this.butDisableAddrPostCode = false;
    this.initAddressDetailsForm();
    this.AddressDetailsForm.controls.country.setValue(this.CountryList[this.selectTempCountry].country_name);
    this.selectPostCodeAddressId = null;
    this.AddressDetailsForm.enable();
    this.addressflag = 0;
    this.butDisable = false;
    this.PostalListShow = false;
    //this.ShowPostalBox = false;
  }

  AddeClkPostCode = (param: string) => {
    if(param!=null){
      this.AddressDetailsForm.patchValue({ 'addressLine1': this.AddressPostCodeList[this.AddressPostCodeMapping(param)].line_1 });
      this.AddressDetailsForm.patchValue({ 'addressLine2': this.AddressPostCodeList[this.AddressPostCodeMapping(param)].line_2 });
      this.AddressDetailsForm.patchValue({ 'addressLine3': this.AddressPostCodeList[this.AddressPostCodeMapping(param)].line_3 });
      this.AddressDetailsForm.patchValue({ 'addressLine4': this.AddressPostCodeList[this.AddressPostCodeMapping(param)].post_town });
      this.AddressDetailsForm.patchValue({ 'postCode': this.AddressPostCodeList[this.AddressPostCodeMapping(param)].postcode });
      this.AddressDetailsForm.patchValue({ 'countryState': this.AddressPostCodeList[this.AddressPostCodeMapping(param)].county });
    }
    this.addressflag = 1;
    this.butDisable = false;
  }

  addNew = (form: string) => {
    switch (form) {

      case 'AddressDetailsForm':
        this.initAbouttheBankForm();
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

  getNumber(obj: any) {
    obj.setCountry('gb');
  }
  
  public onCountryChange(e: any,param: string) {

    if(param==='p'){
    this.countryCodePrim = e.dialCode;
    }else{
      this.countryCodeSec = e.dialCode;
    }
  }

  public onToggleChange(e: any) {

    this.isJointAccount = e.checked;
    this.selectedJointAccnt = this.isJointAccount;
    this.isJointAccountHldr1 = this.isJointAccount;
    this.isJointAccountHldr2 = false;
    this.isJointAccountHldr3 = false;
    this.isJointAccountHldr4 = false;
    this.isJointAccountHldr5 = false;
  }

  public addJointAccountHolder() {

    if(this.AccountDetailsForm.value.jntAccntHldrName1!=null && this.AccountDetailsForm.value.jntAccntHldrName1!=''){
      this.selectedAccountHldrNo = 2;
    }
    if(this.AccountDetailsForm.value.jntAccntHldrName2!=null && this.AccountDetailsForm.value.jntAccntHldrName2!=''){
      this.selectedAccountHldrNo=3;
    }
    if(this.AccountDetailsForm.value.jntAccntHldrName3!=null && this.AccountDetailsForm.value.jntAccntHldrName3!=''){
      this.selectedAccountHldrNo=4
    }
    if(this.AccountDetailsForm.value.jntAccntHldrName4!=null && this.AccountDetailsForm.value.jntAccntHldrName4!=''){
      this.selectedAccountHldrNo = 5;
    }
  
    switch (this.selectedAccountHldrNo) {
      case 2:
          this.isJointAccountHldr2 = true;
          this.showJointAccntLink1 = false;
          this.showJointAccntLink2 = true;
          this.showJointAccntLink3 = false;
          this.showJointAccntLink4 = false;
        break;
      case 3:
          this.isJointAccountHldr3 = true;
          this.showJointAccntLink1 = false;
          this.showJointAccntLink2 = false;
          this.showJointAccntLink3 = true;
          this.showJointAccntLink4 = false;
        break;
      case 4:
          this.isJointAccountHldr4 = true;
          this.showJointAccntLink1 = false;
          this.showJointAccntLink2 = false;
          this.showJointAccntLink3 = false;
          this.showJointAccntLink4 = true;
        break;
      case 5:
          this.isJointAccountHldr5 = true;
          this.showJointAccntLink1 = false;
          this.showJointAccntLink2 = false;
          this.showJointAccntLink3 = false;
          this.showJointAccntLink4 = false;
        break;

    }

  }

  fetchBankLookUpList = () => {
    this.valueItemService.fetchBankLookUpList().pipe(first())
      .subscribe(
        data => {

          for (let i in data) {
            this.BankList.push(data[i]);
          }

        });

  }

  fetchBankAccountList = () => {
    this.valueItemService.fetchBankAccountList().pipe(first()).subscribe(
        data => {
          this.loading=false;
          this.selectBankAcctList = data;
        });
  }

  fetchBankAccountDtls = () => {
    this.valueItemService.fetchBankAccountDtls().pipe(first())
      .subscribe(
        data => {
          this.getAllBankAccntDtls = data;
          //this.fetchBankLookUpList();
          //this.fetchUserInfo();
          //this.fetchFamilyMemberList();
          //this.fetchBankLookUpList();
          this.fetchUtilityMembers();
          this.fetchBankAccountList();
          this.panelClk(this.valAccountId);
        });
  }

  fetchBankAccountDtlsForItem = (valAccountId: String) => {
    
    this.valueItemService.fetchBankAccountDtlFrItem(valAccountId).pipe(first())
      .subscribe(
        data => {
          this.getAllBankAccntDtls = data;
        });
  }

  selectFamilyMemDtl = (param: number) => {
    if (param != null) {
      for (let i in this.getAllFamilyMemberList) {
        if (this.getAllFamilyMemberList[i].personalDetail.individualId === param) {
          this.PersonalDetailsForm.patchValue({"title": this.getAllFamilyMemberList[i].personalDetail.title});
          this.PersonalDetailsForm.patchValue({"firstName": this.getAllFamilyMemberList[i].personalDetail.firstName});
          this.PersonalDetailsForm.patchValue({"middleName": this.getAllFamilyMemberList[i].personalDetail.middleName});
          this.PersonalDetailsForm.patchValue({"lastName": this.getAllFamilyMemberList[i].personalDetail.lastName});
          this.PersonalDetailsForm.patchValue({"gender": this.getAllFamilyMemberList[i].personalDetail.gender});
          this.PersonalDetailsForm.patchValue({"dateOfBirth": this.getAllFamilyMemberList[i].personalDetail.dateOfBirth});
          this.PersonalDetailsForm.patchValue({"addressLine1": ''});
          this.PersonalDetailsForm.patchValue({"addressLine2": ''});
          this.PersonalDetailsForm.patchValue({"addressLine3":''});
          this.PersonalDetailsForm.patchValue({"addressLine4": ''});
          this.PersonalDetailsForm.patchValue({"postCode": ''});
          this.PersonalDetailsForm.patchValue({"selectedAddressId":''});
          this.PersonalDetailsForm.patchValue({"selectedEmailId": ''});
          this.PersonalDetailsForm.patchValue({"selectedPhoneId": ''});
          /*this.PersonalDetailsForm.value.firstName = this.getAllFamilyMemberList[i].personalDetail.firstName;
          this.PersonalDetailsForm.value.middleName = this.getAllFamilyMemberList[i].personalDetail.middleName;
          this.PersonalDetailsForm.value.lastName = this.getAllFamilyMemberList[i].personalDetail.lastName;
          this.PersonalDetailsForm.value.gender = this.getAllFamilyMemberList[i].personalDetail.gender;
          this.PersonalDetailsForm.value.dateOfBirth = this.getAllFamilyMemberList[i].personalDetail.dateOfBirth;
          this.PersonalDetailsForm.value.selectedAddressId = '';
          this.PersonalDetailsForm.value.selectedEmailId = '';
          this.PersonalDetailsForm.value.selectedPhoneId = '';
          this.PersonalDetailsForm.value.addressLine1 = "";
          this.PersonalDetailsForm.value.addressLine2 = '';
          this.PersonalDetailsForm.value.addressLine3 = '';
          this.PersonalDetailsForm.value.addressLine4 = '';
          this.PersonalDetailsForm.value.postCode = '';
          this.PersonalDetailsForm.value.countryState = ''; */
          //this.PersonalDetailsForm.patchValue(this.getAllFamilyMemberList[i].personalDetail);
          this.butDisable = true;
          this.AddressList = this.getAllFamilyMemberList[i].addressDetail;
          this.EmailList = this.getAllFamilyMemberList[i].emailDetail;
          this.PhoneList = this.getAllFamilyMemberList[i].phoneDetail;
          //this.PersonalDetailsForm.patchValue({"selFamMemberId": this.getAllFamilyMemberList[i].personalDetail.individualId});
        }
      }
    }

  }

  closeMessage = () => {
  
    this.baStatusMsg = null;
    //this.adStatusMsg = null;
    this.pdStatusMsg = null;
    this.docStatusMsg = null;
    this.accntStatusMsg = null;
    this.aiStatusMsg = null;
    this.showEmailError = false;
    this.showPhoneError = false;
    this.pfStatusMsgHide =false;
  }

  confirmbox = (valAccntId: any) => {

   this.dialogService.openConfirmDialog('DelAccountInfo')
    .afterClosed().subscribe(res =>{
     
      if(res){
            this.delete(valAccntId);
       }
      
    });

  }

  confirmDocBox = (form: string) => {

    this.dialogService.openConfirmDialog('delDocInfo').afterClosed().subscribe(res =>{
      if(res==true){
        
            this.requiredId = this.selectedDocumentId.toString();
            this.usersService.removeId(form,this.requiredId).pipe(first()).subscribe(
            data => {
           
                this.docStatusMsg = "Document detail deleted successfully ";
                this.fetchBankAccountList();
                this.fetchBankAccountDtls();
                this.panelClk(this.valAccountId);
                //this.toggleEditState('DocDetailsForm');
                //this.DocumentList = this.selectedBankAccntDtls.documentDetail;
      
                //this.DocDetailsForm.disable();
                setTimeout (() => {
                  this.docStatusMsg = null;
                }, 10000);          
             // }
            },
            error => {
              console.log('Error when removing the Doc info: ' + JSON.stringify(error));
              this.resetForm(form);
            }
          ); 
       }
    });

  }

  delete(param: any) {
 
    this.valueItemService.deleteBankAccountInfo(param)
      .pipe(first())
      .subscribe(
        data => {

          this.adStatusMsg = "Bank Account deleted successfully";
            this.fetchBankAccountList();
            this.initForms();
            setTimeout (() => {
              this.adStatusMsg = null;
           }, 10000);
        },
        error => {
          console.log('Error when saving the users info: ' + JSON.stringify(error));
         // this.resetForm(form);
        }
      );
    
  }

}
