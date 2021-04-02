import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { UsersService } from 'src/app/core/services/users.service';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { DatePipe } from '@angular/common';
import { pipe } from 'rxjs';
import { first } from 'rxjs/operators';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RegistrationService } from 'src/app/core/services/registration.service';
import { FileUploader } from "ng2-file-upload";
import { MatSelectModule } from '@angular/material';
import { ValidatorService } from 'src/app/core/validators/validator.service';
import { saveAs } from 'file-saver';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { DialogService } from 'src/app/core/services/dialog.service';
import {MatDialogModule} from '@angular/material';






@Component({
  selector: 'app-myfamily',
  templateUrl: './myfamily.component.html',
  styleUrls: ['./myfamily.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyfamilyComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({ isHTML5: true });
  pipe = new DatePipe('en-US');
  memberId: any;
  showPanel: boolean;
  pfStatusMsg: string;
  adStatusMsg: string;
  edStatusMsg: string;
  pdStatusMsg: string;
  doStatusMsg: string;
  aiStatusMsg: string;
  AddressDetailShow: boolean;
  EmailDetailShow: boolean;
  PhoneDetailShow: boolean;
  DocumentDetailShow: boolean;
  RequirementDetailShow: boolean;
  PostalListShow: boolean;
  ShowPostalBox: boolean;
  selectedAddressId: number;
  selectPostCodeAddressId:  number;
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
  selectedPhoneId: number;
  selectedDocumentId: number;
  selectCountry: string;
  PhoneList = [];
  EmailList = [];
  DocumentList = [];
  familyMap = {};
  familyMapKeysLs = [];
  butDisable: boolean;
  butDisableEmail: boolean;
  butDisablePhone: boolean;
  butDisableDocument: boolean;
  butDisableAddrPostCode: boolean;
  butDisabledSelectCountry: boolean;
  butDisableUniversalList: boolean;
  ActiveDocumentIdentifier: string;
  memberId_temp: any;
  postCode: string;
  requiredId: string;
  result: string = '';
  addressflag: number;
  additionalInformation: string;
  flag: Number;
  


  PersonalDetailsForm: FormGroup;
  AddressDetailsForm: FormGroup;
 // ContactDetailsForm: FormGroup;
  EmailDetailsForm: FormGroup;
  PhoneDetailsForm: FormGroup;
  DocDetailsForm: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private validatorService: ValidatorService,
    private usersService: UsersService,
    private dialogService: DialogService
  ) {

  }

  ngOnInit() {
    this.initForms();
    //this.fetchUserInfo();
    this.fetchUtilityMembers();
    this.fetchFamilyMembers();
    this.showPanel = false;
    this.pfStatusMsg = null;
    this.adStatusMsg = null;
    this.edStatusMsg = null;
    this.pdStatusMsg = null;
    this.doStatusMsg = null;
    this.aiStatusMsg = null;
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

  }

  initForms = () => {
    this.initPersonalDetailsForm();
    this.initEmailDetailsForm();
    this.initPhoneDetailsForm();
    this.initAddressDetailsForm();
    this.initDocDetailsForm();
  }

  initPersonalDetailsForm = () => {
    this.PersonalDetailsForm = this.formBuilder.group({
      title: [''],
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$'), this.validatorService.nameValidation, Validators.maxLength(50), Validators.minLength(3)]],
      middleName: ['', [Validators.pattern('^[a-zA-Z]+$'), this.validatorService.nameValidation, Validators.maxLength(50), Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$'), this.validatorService.nameValidation, Validators.maxLength(50), Validators.minLength(3)]],
      gender: [''],
      dateOfBirth: ['', [Validators.required, this.validatorService.ageEligibility]],
      relationship: ['', [Validators.required]]
    
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
      country: ['']
    });

    this.AddressDetailsForm.disable();
  }

initEmailDetailsForm = () => {
  this.EmailDetailsForm = this.formBuilder.group({
    emailAddress: [{ value: '', disabled: true }, [Validators.required, Validators.email, Validators.pattern('.+.com'), Validators.maxLength(75)]],
    primaryFlag: ['N']
  });
  

  this.EmailDetailsForm.disable();
}

initPhoneDetailsForm = () => {
  this.PhoneDetailsForm = this.formBuilder.group({
    countryCode: [{ value: '044', disabled: true }, [Validators.required, Validators.pattern('[0-9]+'), Validators.maxLength(5)]],
    phoneNumber: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^(0-)*[0-9]{10}')]],
    primaryFlag: ['N']
  });

  this.PhoneDetailsForm.disable();
}


  initDocDetailsForm = () => {
    this.DocDetailsForm = this.formBuilder.group({
      documentType: ['', [Validators.required]],
      countryOfIssue: [''],
      documentNumber: [''],
      issueingAuthority: [''],
      issueDate: [''],
      expiaryDate: [''],
      additionalInformation: [''],
      documentIdentifier: [''],
      documentSize: ['']
    });


    this.DocDetailsForm.disable();
  }

  toggleEditState = (form: string) => {
    this.pfStatusMsg = null;
    this.adStatusMsg = null;
    this.pdStatusMsg = null;
    this.edStatusMsg = null;
    this.doStatusMsg = null;
    this.aiStatusMsg = null;
    this.selectCountry = null;
    switch (form) {
      case 'PersonalDetailsForm':
        if (this.PersonalDetailsForm.status !== 'DISABLED') {
          this.PersonalDetailsForm.disable();
        }
        else {
          this.PersonalDetailsForm.enable();
          if(this.memberId!=null){
            if(this.familyMap[this.IndividualMapping(this.memberId)].personalDetail.relationship == 'Self'){
              this.PersonalDetailsForm.controls.relationship.disable();
            }
          }
        }
        
        break;
      case 'AddressDetailsForm':
        if (this.AddressDetailsForm.status !== 'DISABLED') {
          this.AddressDetailsForm.disable();
          this.AddressDetailShow = true;
        }
        else {
          this.AddressDetailsForm.enable();
          this.AddressDetailShow = false;
          this.butDisable = true;        
        }
        
        if(this.AddressList.length>0){
           this.selectedAddressId = this.AddressList[0].addressId;
           this.AddressDetailsForm.patchValue(this.AddressList[0]);
           if(this.AddressList[0].addressflag==1){
            this.AddressDetailsForm.disable();
          }
          else
          {
            this.AddressDetailsForm.enable();
          }
        }
       else
       {
        this.selectedAddressId = null;
        this.AddressDetailsForm.disable();
        this.butDisable = false;
       }

        break;
        case 'EmailDetailsForm':
          if (this.EmailDetailsForm.status !== 'DISABLED') {
            this.EmailDetailsForm.disable();
            this.EmailDetailShow = true;
          }
          else {
            this.EmailDetailsForm.enable();
            this.EmailDetailShow = false;
            this.butDisableEmail = true;
          }
          if(this.EmailList.length>0){
            this.selectedEmailId = this.EmailList[0].emailId;
            this.EmailDetailsForm.patchValue(this.EmailList[0]);
         }
        else
        {
         this.selectedEmailId = null;
         this.EmailDetailsForm.disable();
         this.butDisableEmail = false;
        }
          break;

       case 'PhoneDetailsForm':
            if (this.PhoneDetailsForm.status !== 'DISABLED') {
              this.PhoneDetailsForm.disable();
              this.PhoneDetailShow = true;
            }
            else {
              this.PhoneDetailsForm.enable();
              this.PhoneDetailShow = false;
              this.butDisablePhone = true;
            }
            if(this.PhoneList.length>0){
              this.selectedPhoneId = this.PhoneList[0].phoneId;
              this.PhoneDetailsForm.patchValue(this.PhoneList[0]);
           }
          else
          {
           this.selectedPhoneId = null;
           this.PhoneDetailsForm.disable();
           this.butDisablePhone = false;
          }
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

  resetForm = (form: string) => {
    this.pfStatusMsg = null;
    this.adStatusMsg = null;
    this.edStatusMsg = null;
    this.pdStatusMsg = null;
    this.doStatusMsg = null;
    this.aiStatusMsg = null;
    this.selectCountry = null;
    switch (form) {
      case 'PersonalDetailsForm':
        this.PersonalDetailsForm.disable();
        this.initPersonalDetailsForm();

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

        case 'EmailDetailsForm':
        this.selectedEmailId= null;
        this.EmailDetailShow = true;
        this.butDisableEmail = false;
        this.EmailDetailsForm.disable();
         
          break;

       case 'PhoneDetailsForm':
        this.selectedPhoneId= null;
       
        this.PhoneDetailShow = true;
        this.butDisablePhone = false; 
        this.PhoneDetailsForm.disable(); 
            break;












      case 'DocDetailsForm':
        // alert(this.ActiveDocumentIdentifier);
        //alert(this.selectedAddressId);
        //this.selectedDocumentId = null
        this.DocDetailsForm.disable();
        this.DocumentDetailShow = true;
        this.butDisableDocument = true;

        break;

        case 'RequirementDetailsForm':
          
          this.RequirementDetailShow = true;

      default:
        break;
    }
if(this.memberId!=null){
    this.panelClk(this.memberId,0,0,0,0);
}
  }

  addNew = (form: string) => {
    this.pfStatusMsg = null;
    this.adStatusMsg = null;
    this.edStatusMsg = null;
    this.pdStatusMsg = null;
    this.doStatusMsg = null;
    this.selectCountry = null;
    this.aiStatusMsg = null;
    this.RequirementDetailShow = true;
    this.additionalInformation="";
    switch (form) {
      case 'PersonalDetailsForm':
        this.PersonalDetailsForm.disable();
        this.initPersonalDetailsForm();


        break;
      case 'AddressDetailsForm':
        this.initAddressDetailsForm();
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

        case 'EmailDetailsForm':
        this.initEmailDetailsForm();
        this.selectedEmailId = null;
        this.EmailDetailsForm.enable();
        this.EmailDetailShow = false;
        this.butDisableEmail = false;
        if(this.EmailList.length>0){
          this.EmailDetailsForm.controls.primaryFlag.setValue('N')
        }
        else
        {
          this.EmailDetailsForm.controls.primaryFlag.setValue('Y')
        }
        break;


        case 'PhoneDetailsForm':
          this.initPhoneDetailsForm();
          this.selectedPhoneId = null;
          this.PhoneDetailsForm.enable();
          this.PhoneDetailShow = false;
          this.butDisablePhone = false;
          if(this.PhoneList.length>0){
            this.PhoneDetailsForm.controls.primaryFlag.setValue('N')
          }
          else
          {
            this.PhoneDetailsForm.controls.primaryFlag.setValue('Y')
          }
          break;

      case 'DocDetailsForm':
       
        this.selectedDocumentId = null
        this.DocumentDetailShow = false;
        this.butDisableDocument = false;
        this.ActiveDocumentIdentifier = null;
        this.DocumentList = [];
        this.uploader.clearQueue();
        this.initDocDetailsForm();
        this.DocDetailsForm.enable();
        break;

      default:
        break;
    }
  }

  onSubmit = (form: string) => {
    let payload = null;
    switch (form) {
      case 'PersonalDetailsForm':
        this.PersonalDetailsForm.value.dateOfBirth = this.changeDateFormat(this.PersonalDetailsForm.value.dateOfBirth)
        payload = this.PersonalDetailsForm.value;
        payload.individualId = this.memberId;
        this.pfStatusMsg = "Personal Detail saved/updated successfully";

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

        case 'EmailDetailsForm':
          payload = this.EmailDetailsForm.value;
          payload.individualId = this.memberId;
          payload.emailId = this.selectedEmailId;
          this.edStatusMsg = "Email Detail saved/updated successfully ";
          this.EmailDetailShow = true;
          this.butDisableEmail = true;
          break;

          case 'PhoneDetailsForm':
            payload = this.PhoneDetailsForm.value;
            payload.individualId = this.memberId;
            payload.phoneId = this.selectedPhoneId;
            this.pdStatusMsg = "Phone Detail saved/updated successfully ";
            this.PhoneDetailShow = true;
            this.butDisablePhone = true;
            break;

            case 'RequirementDetailsForm':
              payload={};
              payload.individualId = this.memberId;
              payload.additionalInformation = this.additionalInformation;
              this.aiStatusMsg = "Additional Information saved/updated successfully ";
            //  payload= '{individualId : '+this.memberId+',additionalInformation : "' + this.additionalInformation + '"}';

            break;






      default:
        break;
    }
    console.log(payload);

    this.usersService.saveUserInfoMyFamily_temp(form, payload)
      .pipe(first())
      .subscribe(
        data => {

          // console.log('Response received from service when saving user data : '+ JSON.stringify(data));

          switch (form) {
            case 'PersonalDetailsForm':
             
             this.memberId = data;     
             this.memberId_temp = this.memberId;     
              break;

            case 'AddressDetailsForm':
              
              
              this.adStatusMsg = "Address Detail saved/updated successfully ";
            //  alert(data);
           
                this.selectedAddressId = Number(data);
          


              break;
            case 'EmailDetailsForm':
              this.edStatusMsg = "Email Detail saved/updated successfully ";
            
                this.selectedEmailId = Number(data);
             
           
              break;

              case 'PhoneDetailsForm':
                this.pdStatusMsg = "Phone Detail saved/updated successfully ";
              
                this.selectedPhoneId = Number(data);
               
              //  this.ContactDetailsForm.disable();
                break;

              case 'RequirementDetailsForm':
                  this.aiStatusMsg = "Additional Information saved/updated successfully ";
                //  payload= '{individualId : '+this.memberId+',additionalInformation : "' + this.additionalInformation + '"}';
    
                break;

            default:
              break;
          }
          
          this.familyMapKeysLs = [];
          for (let k in this.familyMap) {
             delete this.familyMap[k];
          }
          // this.fetchUserInfo();
          this.fetchFamilyMembers();
      
          


        },
        error => {
          console.log('Error when saving the users info: ' + JSON.stringify(error));
          this.resetForm(form);
        }
      );
 
      if(form === 'AddressDetailsForm'){

      this.AddressDetailsForm.disable();
              this.PostalListShow = false;
              this.AddressPostCodeList = [];
              this.butDisableAddrPostCode = false;
              this.selectPostCodeAddressId = null;
              this.selectCountry = null;
              this.butDisabledSelectCountry = false;
              this.ShowPostalBox = false;
              
      }

      if(form == 'EmailDetailsForm'){
        this.EmailDetailsForm.disable();
        
      }

      if(form == 'PhoneDetailsForm'){
        this.PhoneDetailsForm.disable();
      }



            
      if(form === 'PersonalDetailsForm'){
    
     this.PersonalDetailsForm.disable();
    //  this.memberId = this.familyMap[this.IndividualMapping(this.memberId_temp)].personalDetail.individualId;
  //   this.panelClk(this.memberId,0,0,0);
      this.memberId = null;
      this.pfStatusMsg = "Personal Detail saved/updated successfully";
      }

  
      if(form == 'RequirementDetailsForm'){
        this.aiStatusMsg = "Additional Information saved/updated successfully ";
        this.RequirementDetailShow = true;
      }
  }

  onSubmitDoc = () => {
    let payload = this.DocDetailsForm.value;
    payload.individualId = this.memberId;
    payload.documentId = this.selectedDocumentId;
    // console.log('docDetailsPayload',payload);
    let formData: any = new FormData();
    for (let i = 0; i < this.uploader.queue.length; i++) {
      let fileItem = this.uploader.queue[i]._file;
      formData.append("file", fileItem);
    }
    formData.append('payload', JSON.stringify(payload));
    console.log(Array.from(formData));

    this.usersService.saveDocuments(formData)
      .pipe(first())
      .subscribe(
        data => {

          this.familyMapKeysLs = [];
      for (let k in this.familyMap) {
        if (this.familyMap[k].individualId == null)
          delete this.familyMap[k];
      }
      // this.fetchUserInfo();
      this.fetchFamilyMembers();
          
        

        },
        error => {
          console.log('Error when saving the users info: ' + JSON.stringify(error));

        }
      );

     
      this.doStatusMsg = "Document Detail saved/updated successfully ";
      this.DocDetailsForm.disable();
      this.DocumentDetailShow = true;
      this.butDisableDocument = false;

  }

  panelClk = (param: any, param2: any, param3: any, param4: any, param5: any) => {
    this.pfStatusMsg = null;
    this.adStatusMsg = null;
    this.edStatusMsg = null;
    this.pdStatusMsg = null;
    this.doStatusMsg = null;
    this.aiStatusMsg = null;
    this.selectCountry = null;
    this.PersonalDetailsForm.patchValue(this.familyMap[this.IndividualMapping(param)].personalDetail);
    this.additionalInformation = this.familyMap[this.IndividualMapping(param)].personalDetail.additional_info;
    this.PersonalDetailsForm.disable();
    this.showPanel = true;
    this.AddressDetailsForm.disable();
    this.EmailDetailsForm.disable();
    this.PhoneDetailsForm.disable();
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

    if (this.AddressList.length != 0) {
      this.selectedAddressId = this.AddressList[param2].addressId;
     // this.AddeClk(this.selectedAddressId);
      this.AddressDetailsForm.patchValue(this.AddressList[this.AddressMapping(this.selectedAddressId)]);
    }
    else {
      this.initAddressDetailsForm();
    }


    if (this.EmailList.length != 0) {
      this.selectedEmailId = this.EmailList[param3].emailId;
      this.AddeEmail(this.selectedEmailId);
    }
    else {
      this.initEmailDetailsForm();
    }

    if (this.PhoneList.length != 0) {
      this.selectedPhoneId = this.PhoneList[param4].phoneId;
      this.AddePhone(this.selectedPhoneId);
    }
    else {
      this.initPhoneDetailsForm();
    }

    if (this.DocumentList.length != 0) {
      this.selectedDocumentId = this.DocumentList[param5].documentId;
      this.AddeDocument(this.selectedDocumentId);
    }
    else {
      this.initDocDetailsForm();
    }


  }


  SectionRefresh = (param1: any, param2: any, param3: any, param4: any, param5: any) => {
  
    this.memberId = param1;
    this.PersonalDetailsForm.patchValue(this.familyMap[this.IndividualMapping(param1)].personalDetail);
    //this.additionalInformation = this.familyMap[this.IndividualMapping(param1)].personalDetail.additional_info;
    
    this.selectedAddressId = param2;
    if(param2==-1 && this.AddressList.length>0){
      this.AddressDetailsForm.patchValue(this.AddressList[0]);
    }
    else if(this.AddressList.length>0){
    this.AddressDetailsForm.patchValue(this.AddressList[this.AddressMapping(this.selectedAddressId)]);
    }
    else
    {
      this.initAddressDetailsForm();
    }

   
    if(param3==-1 && this.EmailList.length>0){
      this.EmailDetailsForm.patchValue(this.EmailList[0]);
      this.selectedEmailId = this.EmailList[0].emailId;
    }
    else if(this.EmailList.length>0){
    this.selectedEmailId = param3;
    this.EmailDetailsForm.patchValue(this.EmailList[this.EmailMapping(this.selectedEmailId)]);
    }
    else
    {
      this.initEmailDetailsForm();
    }

    this.selectedPhoneId = param4;
    if(param4==-1 && this.PhoneList.length>0){
      this.PhoneDetailsForm.patchValue(this.PhoneList[0]);
      this.selectedPhoneId = this.PhoneList[0].phoneId;
    }
    else if(this.PhoneList.length>0){
      this.PhoneList[0]
      this.PhoneDetailsForm.patchValue(this.PhoneList[this.PhoneMapping(this.selectedPhoneId)]);
      }
      else
      {
        this.initPhoneDetailsForm();
      }
   


   
  
  }

  fetchUserInfo = () => {
    this.usersService.fetchUserInfo_fm_temp()
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data) {
            data["personalDetail"].relationship = "Self";
            this.familyMap[0] = data;
          }

        },
        (error: any) => {
          console.log('Error when fetching the account profile data in component: ' + JSON.stringify(error));
        }
      );

  }

  fetchFamilyMembers = () => {
    this.usersService.fetchFamilyMembers_temp()
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          for (let i in data['familyMembers']) {
            this.familyMap[i] = (data['familyMembers'][i]);

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

          if (this.memberId != null && this.memberId != 0) {
            this.AddressList = [];
            this.EmailList = [];
            this.PhoneList = [];
            this.DocumentList = [];
            for (let s in this.familyMap[this.IndividualMapping(this.memberId)].addressDetail) {
              this.AddressList.push(this.familyMap[this.IndividualMapping(this.memberId)].addressDetail[s]);
              //alert(this.familyMap[this.IndividualMapping(this.individualId)].addressDetail[s].addressId);
            }
            this.AddressList_temp = this.AddressList;
            if(this.AddressList.length==0){
              this.butDisable = false;
            }
            for (let s in this.familyMap[this.IndividualMapping(this.memberId)].emailDetail) {
              this.EmailList.push(this.familyMap[this.IndividualMapping(this.memberId)].emailDetail[s]);
            }
            if(this.EmailList.length==0){
              this.butDisableEmail = false;
            }

            for (let s in this.familyMap[this.IndividualMapping(this.memberId)].phoneDetail) {
              this.PhoneList.push(this.familyMap[this.IndividualMapping(this.memberId)].phoneDetail[s]);
            }
            if(this.PhoneList.length==0){
              this.butDisablePhone = false;
            }

            for (let s in this.familyMap[this.IndividualMapping(this.memberId)].documentDetail) {
              this.DocumentList.push(this.familyMap[this.IndividualMapping(this.memberId)].documentDetail[s]);
            }

             this.SectionRefresh(this.memberId,this.selectedAddressId,this.selectedEmailId,this.selectedPhoneId,0);

          }


        }
      );

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

    });
  }

  IndividualMapping(param: number) {
    for (let i in this.familyMap) {
      if (this.familyMap[i].personalDetail.individualId == param) {
        return i;
      }
    }
  }

  DocumentMapping(param: number) {
    for (let i in this.DocumentList) {
      if (this.DocumentList[i].documentId == param) {
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


  AddressPostCodeMapping(param: string){
    for( let i in this.AddressPostCodeList){
      if(this.AddressPostCodeList[i].line_1 == param){
        return i;
      }
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


  AddNewFamilyMember = () => {
    this.showPanel = true;
    this.memberId = null;
    this.selectCountry = null;
    this.selectedAddressId = null;
    this.selectedEmailId = null;
    this.selectedPhoneId = null;
    this.selectedDocumentId = null;
    this.pfStatusMsg = null;
    this.adStatusMsg = null;
    this.edStatusMsg = null;
    this.pdStatusMsg = null;
    this.doStatusMsg = null;
    this.ActiveDocumentIdentifier = null;
    this.initPersonalDetailsForm();
    this.initAddressDetailsForm();
    this.initEmailDetailsForm();
    this.initPhoneDetailsForm();
    this.initDocDetailsForm();
    this.AddressDetailShow = true;
    this.butDisable = false;
    this.butDisableEmail = false;
    this.butDisablePhone = false;
    this.AddressList = [];
    this.selectedAddressId = null;
    this.AddressPostCodeList = [];
    this.butDisableAddrPostCode = false;
    this.PostalListShow = false;

  }

  AddeClk = (param: number) => {

    if(param==-2 && this.CountryList[this.selectCountry].search_flag!='N'){
      this.ShowPostalBox = true;
      this.butDisable = false;
      this.initAddressDetailsForm();
      this.AddressDetailsForm.controls.country.setValue(this.CountryList[this.selectCountry].country_name);
      return;
    }
    else
    {
      if(param==-2){
      this.initAddressDetailsForm();
      this.AddressDetailsForm.enable();
      this.AddressDetailsForm.controls.country.setValue(this.CountryList[this.selectCountry].country_name);
      return
      }
    }

    this.AddressDetailsForm.patchValue(this.AddressList[this.AddressMapping(param)]);
    if(this.AddressList[this.AddressMapping(param)].addressflag==1){
      this.AddressDetailsForm.disable();
      this.addressflag=1;
    }
    else
    {
      if(this.AddressDetailShow!=true){
      this.AddressDetailsForm.enable();
      this.addressflag=0;
      }
      else
      {
        this.AddressDetailsForm.disable();
        this.addressflag=0;
      }
    }

    if(this.selectCountry!=null){
      this.AddressDetailsForm.disable();
    }
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


  AddeEmail = (param: number) => {
    this.EmailDetailsForm.patchValue(this.EmailList[this.EmailMapping(param)]);
  }

  AddePhone = (param: number) => {
    this.PhoneDetailsForm.patchValue(this.PhoneList[this.PhoneMapping(param)]);
  }

  AddeDocument = (param: number) => {
    this.DocDetailsForm.patchValue(this.DocumentList[this.DocumentMapping(param)]);
    this.ActiveDocumentIdentifier = this.DocumentList[this.DocumentMapping(param)].documentIdentifier;
    this.uploader.clearQueue();
  }

  changeDateFormat(param: string): string {
    return this.pipe.transform(new Date(param), 'yyyy-MM-dd');
  }

  DownloadFile() {
    this.usersService.downloadFiles(this.selectedDocumentId.toString())
      .subscribe(data => {saveAs(new Blob([data], { type: '' }), this.DocumentList[this.DocumentMapping(this.selectedDocumentId)].documentIdentifier)

      });
  }

  RemoveDoc = () => {
   this.ActiveDocumentIdentifier = null;
   this.selectCountry = null;
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
        if(data['result']) {      
          this.AddressPostCodeList = data['result']; 
        
        }
      },
      error => {

       
      });
       
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

  confirmbox = (form: string) => {

    this.dialogService.openConfirmDialog('FamilyMember')
    .afterClosed().subscribe(res =>{
     
      if(res==true){
            this.removeId(form);
           
       }
       else
       {
          this.resetForm(form);
       }
    });

  }

  removeId = (form: string) => {
       
    switch (form) {
      case 'PersonalDetailsForm':
        this.requiredId = this.memberId;  
        this.memberId = this.familyMap[0].individualId;
        break;

      case 'AddressDetailsForm':   
         this.requiredId = this.selectedAddressId.toString();
    
        break;
      case 'EmailDetailsForm':
         this.requiredId = this.selectedEmailId.toString();
       
        break;

      case 'PhoneDetailsForm':
         this.requiredId = this.selectedPhoneId.toString();
       
      //  this.ContactDetailsForm.disable();
        break;

        case 'DocDetailsForm':
          this.requiredId = this.selectedDocumentId.toString();
        
       //  this.ContactDetailsForm.disable();
         break;

      default:
        break;
    }

    this.usersService.removeId(form,this.requiredId)
      .pipe(first())
      .subscribe(
        data => {

           console.log('Response received from service when saving user data : '+ JSON.stringify(data));
            this.familyMapKeysLs = [];
           for (let k in this.familyMap) {
               delete this.familyMap[k];
           }
           // this.fetchUserInfo();
           this.fetchFamilyMembers();
           if(data=="1"){
            this.resetForm(form);
                     
         }
      
        if(data=="2"){
         this.selectedAddressId = -1;
        }

        if(data=="3"){
          this.selectedEmailId = -1;
        }

        if(data=="4"){
          this.selectedPhoneId = -1;
        }


        },
        error => {
          console.log('Error when saving the users info: ' + JSON.stringify(error));
          this.resetForm(form);
        }
      );
    
 
      if(form == 'AddressDetailsForm'){

     
             
              this.PostalListShow = false;
              this.AddressPostCodeList = [];
              this.butDisableAddrPostCode = false;
              this.selectPostCodeAddressId = null;
              this.AddressDetailShow = true;
              this.butDisable = false;
              
            //  this.panelClk(this.memberId,0,0,0,0);
            
           //   this.initAddressDetailsForm();
              this.adStatusMsg = "Address Detail removed successfully";
            
      }

      if(form == 'EmailDetailsForm'){
       
      
        this.EmailList = [];
     //   this.panelClk(this.memberId,0,0,0,0);
        this.EmailDetailsForm.disable();
     //   this.initEmailDetailsForm();
        this.EmailDetailShow = true;
        this.edStatusMsg = "Email Detail removed successfully";
      }


      if(form == 'PhoneDetailsForm'){
       
      
        this.PhoneList = [];
    //    this.panelClk(this.memberId,0,0,0,0);
        this.PhoneDetailsForm.disable();
    //    this.initPhoneDetailsForm();
        this.PhoneDetailShow = true;
        this.pdStatusMsg = "Phone Detail removed successfully";
      }
      
      
      if(form == 'PersonalDetailsForm'){
       // this.initPersonalDetailsForm();
        this.memberId = null;
        this.resetForm(form);
      
      }

      if(form === 'DocDetailsForm'){
        this.ActiveDocumentIdentifier = null;
        this.DocumentList = [];
        this.DocDetailsForm.disable();
        if( this.DocumentList.length != 0 ){

     //   this.panelClk(this.memberId,0,0,0,0);
        }
        
        this.initDocDetailsForm();
        this.butDisableDocument = false;
        this.DocumentDetailShow = true;
        this.doStatusMsg = "Document Detail removed successfully";
              
      }

      this.requiredId = null;
          
  }

  AddeSelectCountry = (param: string) => {
    this.AddressDetailsForm.controls.country.setValue(this.CountryList[param].country_name);
    //this.AddressList = [];
    this.selectedAddressId = null;
    this.PostalListShow = false;
    this.butDisable = false;
    this.ShowPostalBox = false;
    this.UniversalAddressList_temp = [];
    this.AddressList = this.AddressList_temp;
  

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

    this.AddressList = [];
     for (let i in this.UniversalAddressList_temp) {
      if(this.UniversalAddressList_temp[i].country==this.CountryList[param].country_name){
          this.AddressList.push(this.UniversalAddressList_temp[i]);
      }
    }

    
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
     
      this.initAddressDetailsForm();
      this.AddressDetailsForm.controls.country.setValue(this.CountryList[param].country_name);
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

}
