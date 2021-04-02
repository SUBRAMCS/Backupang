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
import { DialogService } from 'src/app/core/services/dialog.service';
import {MatDialogModule} from '@angular/material';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


export const DD_MM_YYYY_Format = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};


@Component({
  selector: 'app-mynominee',
  templateUrl: './mynominee.component.html',
  styleUrls: ['./mynominee.component.css'],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
			   {provide: DateAdapter,useClass: MomentDateAdapter,deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]},
			   {provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_Format}],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class MynomineeComponent implements OnInit {

 public uploader: FileUploader = new FileUploader({ isHTML5: true });
  pipe = new DatePipe('en-US');
  memberId: any;
  nominee_member_id: number;
  showPanel: boolean;
  msgType: string;
  
   MsgList = {
		"PersonalDetailsForm_success" : "Success: Personal detail saved/updated successfully",
		"PersonalDetailsForm_duplicate" : "Error: Trying to insert duplicate personal detail record",
		"PersonalDetailsForm_removed" : "Success: Personal detail record successfully removed",
		
		"AddressDetailsForm_success" : "Success: Address detail saved/updated successfully",
		"AddressDetailsForm_duplicate" : "Error: Trying to insert duplicate address detail record",
		"AddressDetailsForm_removed" : "Success: Address detail record successfully removed",
		
		"EmailDetailsForm_success" : "Success: Email address saved/updated successfully",
		"EmailDetailsForm_duplicate" : "Error: Trying to insert duplicate email address record",
		"EmailDetailsForm_removed" : "Success: Email address successfully removed",
		
		"PhoneDetailsForm_success" : "Success: Contact detail saved/updated successfully",
		"PhoneDetailsForm_duplicate" : "Error: Trying to insert duplicate contact detail record",
		"PhoneDetailsForm_removed" : "Success: Contact detail record successfully removed",
		
		"DocDetailsForm_success" : "Success: Document detail saved/updated successfully",
		"DocDetailsForm_duplicate" : "Error: Trying to insert duplicate document detail record",
		"DocDetailsForm_removed" : "Success: Document detail record successfully removed",
		
		"AdditionalDetailForm_success" : "Success: Additional Information saved/updated successfully",
		"AdditionalDetailForm_duplicate" : "",
		"AdditionalDetailForm_removed" : "",
	};
  
  familyMapMaster = {};
  familyMap = {};
  nomineeMap = {};
  familyMapKeysLs = [];
  nomineeMapKeyLs = [];
  
  TitleList = [];
  RelationshipListNominee = [];
  RelationshipListFamily = [];
  GenderList = [];
  CountryList=[];
  AddressPostCodeList = [];
  
  AddressList = [];  
  EmailList = [];
  PhoneList = []; 
  DocumentList = [];
  
  selectedAddressId: number;
  selectedEmailId: number;
  selectedPhoneId: number;
  selectedDocumentId: number;
  selectedAddressId_temp: number;
  selectedEmailId_temp: number;
  selectedPhoneId_temp: number;
  selectedDocumentId_temp: number;
  selectCountry: number;
  selectPostCodeAddressId: number;
  
  AddressDetailShow: boolean;
  EmailDetailShow: boolean;
  PhoneDetailShow: boolean;
  DocumentDetailShow: boolean;
  RequirementDetailShow: boolean;
  PostalListShow: boolean;
  PostalBoxShow: boolean;
  
  butDisable: boolean;
  butDisableEmail: boolean;
  butDisablePhone: boolean;
  butDisableDocument: boolean;
  butDisableUniversalList: boolean;
  butDisabledSelectCountry: boolean;
  
  ActiveDocumentIdentifier: string;
  ActiveDocumentSize: string;
  
  pfStatusMsg: string;
  adStatusMsg: string;
  edStatusMsg: string;
  pdStatusMsg: string;
  doStatusMsg: string;
  aiStatusMsg: string;
  
  CompareString: string;
  postCode: string;
  requiredId: string;
  
  PersonalDetailsForm: FormGroup;
  AddressDetailsForm: FormGroup;
  EmailDetailsForm: FormGroup;
  PhoneDetailsForm: FormGroup;
  DocDetailsForm: FormGroup;
  AdditionalDetailForm: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private validatorService: ValidatorService,
    private usersService: UsersService,
    private dialogService: DialogService
  ) {

  }

  ngOnInit() {
    this.initForms();
    this.fetchUtilityMembers();
    this.fetchNomineeInfo();
    this.fetchFamilyMembersMaster();
	this.fetchFamilyMembers();
	
    this.showPanel = false;
	this.RequirementDetailShow = false;
	this.msgType = "success";
	this.postCode = "";

	this.memberId = null;
	this.selectedAddressId = null;
	this.selectedEmailId = null;
	this.selectedPhoneId = null;
	this.selectedDocumentId = null;
	this.selectedAddressId_temp = null;
	this.selectCountry = null;
	this.selectPostCodeAddressId = null;
	
	this.AddressDetailShow = true;
    this.EmailDetailShow = true;
    this.PhoneDetailShow = true;
    this.DocumentDetailShow = true;
    this.RequirementDetailShow = true;
	this.PostalBoxShow = false;
	this.PostalListShow = false;
	
	this.butDisable = false;
	this.butDisableEmail = false;
	this.butDisablePhone = false;
	this.butDisableDocument = false;
	this.butDisabledSelectCountry = false;
	
	this.ActiveDocumentIdentifier = null;
	this.ActiveDocumentSize = null;
	this.nominee_member_id = 0;
	this.requiredId = null;
	
	this.pfStatusMsg = null;
    this.adStatusMsg = null;
    this.edStatusMsg = null;
    this.pdStatusMsg = null;
    this.doStatusMsg = null;
    this.aiStatusMsg = null;
	
  }

  initForms = () => {
    this.initPersonalDetailsForm();
    this.initEmailDetailsForm();
    this.initPhoneDetailsForm();
    this.initAddressDetailsForm();
    this.initDocDetailsForm();
	this.initAdditionalDetailForm();
  }
 
  initPersonalDetailsForm = () => {
    this.PersonalDetailsForm = this.formBuilder.group({
      title: [''],
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z\'\-\.\ ]+$'), this.validatorService.nameValidation, Validators.maxLength(50), Validators.minLength(3)]],
      middleName: ['', [Validators.pattern('^[a-zA-Z]+$'), this.validatorService.nameValidation, Validators.maxLength(50), Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$'), this.validatorService.nameValidation, Validators.maxLength(50), Validators.minLength(3)]],
      gender: [''],
      dateOfBirth: ['', [Validators.required, this.validatorService.ageEligibility]],
      relationship: ['', [Validators.required]],
      primaryFlag:['N']
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
    emailAddress: [{ value: '', disabled: true }, [Validators.required, Validators.email, Validators.pattern('(^([\-\_\.a-zA-Z0-9]+)@([a-zA-Z0-9]+)\.([a-zA-Z]{2,5})$)|(^([\-\_\.a-zA-Z0-9]+)@([a-zA-Z0-9]+)\.([a-zA-Z]{2})\.([a-zA-Z]{2})$)'), Validators.maxLength(75)]],
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
      documentType: [{value: '', disabled: true}, [Validators.required]],
      countryOfIssue: [{value: '', disabled: true}],
      documentNumber: [{value: '', disabled: true}],
      issueingAuthority: [''],
      issueDate: [''],
      expiaryDate: [''],
      additionalInformation: [{value: '', disabled: true}],
      documentIdentifier: [''],
      documentSize: ['']
    });


    this.DocDetailsForm.disable();
  }

  initAdditionalDetailForm = () => {
	  this.AdditionalDetailForm = this.formBuilder.group({
		  additionalInformation: ['']		  
	  });
	  
	  this.AdditionalDetailForm.disable();
	  this.RequirementDetailShow = true;
	  
  }
 
  fetchUtilityMembers = () => {  
				this.usersService.fetchUtilityList()
				.pipe(first())
				.subscribe(
				data => {
						//	console.log(data);
  
							 for(let i in data['title']){
										this.TitleList.push(data['title'][i]);
							 }
					  
							 for(let i in data['gender']){
										this.GenderList.push(data['gender'][i]);
							 }
					  
							 for(let i in data['relationship']){
										if(data['relationship'][i].relationship_type=='Nominee'){
												this.RelationshipListNominee.push(data['relationship'][i]);
										}
										else
										{
												this.RelationshipListFamily.push(data['relationship'][i]);
										}
							}
							
							 for(let i in data['countrycode']){
							   this.CountryList.push(data['countrycode'][i]);
							 }
       
  
						});
  
   }

  fetchNomineeInfo = () => {
				this.usersService.fetchNominees()
				.pipe(first())
				.subscribe(
				(data: any) => {
								//	console.log(data);
									
									this.nomineeMapKeyLs = [];
									for (let k in this.nomineeMap) {
												delete this.nomineeMap[k];
									}	
									
									
          						    for (let i in data['familyMembers']) {
									  this.nomineeMap[i] = (data['familyMembers'][i]);
						  
									}
									for (let k in this.nomineeMap) {
									  this.nomineeMapKeyLs.push(k);  
									}
                                    this.panelClk(this.memberId)       
				},
				(error: any) => {
									console.log('Error when fetching the account profile data in component: ' + JSON.stringify(error));
				});
  }

  fetchFamilyMembersMaster = () => {
				this.usersService.fetchNomineesFamilyMember()
				.pipe(first())
				.subscribe(
				 data => {
								for(let i in this.familyMapMaster){
									delete this.familyMapMaster[i];
								}
					 
								for (let i in data['familyMembers']) {
										this.familyMapMaster[i] = (data['familyMembers'][i]);
								}
								this.fetchFamilyMembers();
				});
  }

  fetchFamilyMembers = () => {
	    
		let k=0;
	    this.familyMapKeysLs = [];
		for (let i in this.familyMap) {
				delete this.familyMap[i];
		}
	
		for(let i in this.familyMapMaster){
			if(this.familyMapMaster[i].personalDetail.nomineeMemberId==0){
				this.familyMap[k] = this.familyMapMaster[i];
				k=k+1;
			}
		}
		
		for(let i in this.familyMap){
			this.familyMapKeysLs.push(i);
		}
  }

  fetchAddressForPostCode = (postalCode : string) => {
	  this.AddressPostCodeList = [];
	  this.AddressDetailsForm.enable();
	  if(postalCode.trim().length == 0) {
		        this.AddressDetailsForm.disable();
				return ;
	  }	  
	  this.usersService.fetchAddressForPostCode(postalCode)
	  .pipe(first())
      .subscribe(
       data => {
		    if(data['result']) {      
					this.AddressPostCodeList = data['result']; 
					this.PostalListShow = true;
					this.selectPostCodeAddressId = null;
					this.AddressDetailsForm.disable();
			}					
       },
       error => {
				this.msgType = "danger";
				this.adStatusMsg = "Error: Please enter the correct post code to search.";
				this.AddressDetailsForm.disable();	
      });
  } 

  AddeClkPostCode = (param: string) => {
	       this.AddressDetailsForm.patchValue({'addressLine1': this.AddressPostCodeList[param].line_1}); 
		   this.AddressDetailsForm.patchValue({'addressLine2': this.AddressPostCodeList[param].line_2}); 
		   this.AddressDetailsForm.patchValue({'addressLine3': this.AddressPostCodeList[param].line_3}); 
		   this.AddressDetailsForm.patchValue({'addressLine4': this.AddressPostCodeList[param].post_town}); 
		   this.AddressDetailsForm.patchValue({'postCode': this.AddressPostCodeList[param].postcode}); 
		   this.AddressDetailsForm.patchValue({'countryState': this.AddressPostCodeList[param].county}); 
  }	
 
  resetForm = (form: string) => {
		if(this.memberId==null)
		{   
	        this.initPersonalDetailsForm();
			return;
		}

		this.ResetMsgBox();
	  
	    switch (form) {
				case 'PersonalDetailsForm':
						 this.PersonalDetailsForm.patchValue(this.nomineeMap[this.IndividualMapping(this.memberId)].personalDetail);
						 this.PersonalDetailsForm.disable();
     			break;	   
				case 'AddressDetailsForm':
						 this.ResetAddressBox();
						 this.selectCountry = null;
						 this.selectedAddressId = null;
						 this.AddressDetailsForm.patchValue(this.nomineeMap[this.IndividualMapping(this.memberId)].addressDetail.length!=0 ? this.nomineeMap[this.IndividualMapping(this.memberId)].addressDetail[this.selectedAddressId==null?0:this.AddressMapping(this.selectedAddressId)] : this.patchNull('AddressDetailsForm'));			
						 this.selectedAddressId = this.nomineeMap[this.IndividualMapping(this.memberId)].addressDetail.length!=0 ? this.nomineeMap[this.IndividualMapping(this.memberId)].addressDetail[this.selectedAddressId==null?0:this.AddressMapping(this.selectedAddressId)].addressId : null;
						 this.AddressDetailShow = true;
						 this.butDisable = false;
						 this.AddressDetailsForm.disable();
				break;
				case 'EmailDetailsForm':
						 this.selectedEmailId = null;
						 this.EmailDetailsForm.patchValue(this.nomineeMap[this.IndividualMapping(this.memberId)].emailDetail.length!=0 ? this.nomineeMap[this.IndividualMapping(this.memberId)].emailDetail[this.selectedEmailId==null?0:this.EmailMapping(this.selectedEmailId)] : this.patchNull('EmailDetailsForm'));
						 this.selectedEmailId = this.nomineeMap[this.IndividualMapping(this.memberId)].emailDetail.length!=0 ? this.nomineeMap[this.IndividualMapping(this.memberId)].emailDetail[this.selectedEmailId==null?0:this.EmailMapping(this.selectedEmailId)].emailId : null;
						 this.EmailDetailShow = true;
						 this.butDisableEmail = false;
						 this.EmailDetailsForm.disable();
				break;
				case 'PhoneDetailsForm':
						 this.selectedPhoneId = null;				
						 this.PhoneDetailsForm.patchValue(this.nomineeMap[this.IndividualMapping(this.memberId)].phoneDetail.length!=0 ? this.nomineeMap[this.IndividualMapping(this.memberId)].phoneDetail[this.selectedPhoneId==null?0:this.PhoneMapping(this.selectedPhoneId)] : this.patchNull('PhoneDetailsForm'));
						 this.selectedPhoneId = this.nomineeMap[this.IndividualMapping(this.memberId)].phoneDetail.length!=0 ? this.nomineeMap[this.IndividualMapping(this.memberId)].phoneDetail[this.selectedPhoneId==null?0:this.PhoneMapping(this.selectedPhoneId)].phoneId : null;
						 this.PhoneDetailShow = true;
						 this.butDisablePhone = false;
						 this.PhoneDetailsForm.disable();
				break;
				case 'DocDetailsForm':
						 this.selectedDocumentId = null;
						 this.DocDetailsForm.patchValue(this.nomineeMap[this.IndividualMapping(this.memberId)].documentDetail.length!=0 ? this.nomineeMap[this.IndividualMapping(this.memberId)].documentDetail[this.selectedDocumentId==null?0:this.DocumentMapping(this.selectedDocumentId)] : this.patchNull('DocDetailsForm'));
						 this.selectedDocumentId =  this.nomineeMap[this.IndividualMapping(this.memberId)].documentDetail.length!=0 ? this.nomineeMap[this.IndividualMapping(this.memberId)].documentDetail[this.selectedDocumentId==null?0:this.DocumentMapping(this.selectedDocumentId)].documentId : null;
						 this.ActiveDocumentIdentifier = this.nomineeMap[this.IndividualMapping(this.memberId)].documentDetail.length!=0 ? this.nomineeMap[this.IndividualMapping(this.memberId)].documentDetail[this.selectedDocumentId==null?0:this.DocumentMapping(this.selectedDocumentId)].documentIdentifier : null;
						 this.DocumentDetailShow = true;
						 this.butDisableDocument = false;
						 this.DocDetailsForm.disable();
				break;
				case 'AdditionalDetailForm':
						this.AdditionalDetailForm.controls.additionalInformation.setValue(this.nomineeMap[this.IndividualMapping(this.memberId)].personalDetail.additional_info);
						this.RequirementDetailShow = true;
						this.AdditionalDetailForm.disable();
				break;
	   }
   } 

  toggleEditState = (form: string) => {
	   this.ResetMsgBox();
	   switch (form) {
				case 'PersonalDetailsForm':
						this.IsFamilyMember(this.memberId) ? this.personalDetailFormReset('member') : this.PersonalDetailsForm.enable();				                  						 
				break;	   
				case 'AddressDetailsForm':
				        if(this.IsFamilyMember(this.memberId)){
							this.IsFamilyMember(this.memberId) ? (this.AddressList.length == 0 ? this.butDisable = false : this.butDisable = true) : this.AddressDetailsForm.enable();
						}
						else {
							this.butDisabledSelectCountry = true;						
						}
						
						this.AddressDetailShow = false;
				break;
				case 'EmailDetailsForm':
						this.IsFamilyMember(this.memberId) ? (this.EmailList.length == 0 ? this.butDisableEmail = false : this.butDisableEmail = true) : this.EmailDetailsForm.enable();
						this.EmailDetailShow = false;
				break;
				case 'PhoneDetailsForm':
						this.IsFamilyMember(this.memberId) ? (this.PhoneList.length == 0 ? this.butDisablePhone = false : this.butDisablePhone = true) : this.PhoneDetailsForm.enable();
						this.PhoneDetailShow = false;
				break;
				case 'DocDetailsForm':
						this.IsFamilyMember(this.memberId) ? (this.DocumentList.length ==0 ? this.butDisableDocument = false : this.butDisableDocument = true) : this.DocDetailsForm.enable();
						this.DocumentDetailShow = false
				break;
				case 'AdditionalDetailForm':
						this.RequirementDetailShow = false;
						this.AdditionalDetailForm.enable();
				break;
	   }
	   this.captureString(form);
  }
  
  panelClk = (param: string) => {
 	 if(this.memberId == null){
		 this.PersonalDetailsForm.disable();
		 this.showPanel = false;
		 this.ResetMsgBox();
		 this.nominee_member_id = 0;
		 return;
	 } 	 
							
	 this.PersonalDetailsForm.disable();
	 this.AddressDetailsForm.disable();
	 this.EmailDetailsForm.disable();
	 this.PhoneDetailsForm.disable();
	 this.DocDetailsForm.disable();
	 this.AdditionalDetailForm.disable();
	 
	 if(this.IsFamilyMember(this.memberId)){
				 this.AddressList = [];
				 this.EmailList = [];
				 this.PhoneList = [];
				 this.DocumentList = []; 
				 
				 for(let i in this.familyMapMaster[this.IndividualFamilyMemberMappingMaster(this.memberId)].addressDetail){
					this.AddressList.push(this.familyMapMaster[this.IndividualFamilyMemberMappingMaster(this.memberId)].addressDetail[i]);
				 }
				 for(let i in this.familyMapMaster[this.IndividualFamilyMemberMappingMaster(this.memberId)].emailDetail){
					this.EmailList.push(this.familyMapMaster[this.IndividualFamilyMemberMappingMaster(this.memberId)].emailDetail[i]);
				 }
				 for(let i in this.familyMapMaster[this.IndividualFamilyMemberMappingMaster(this.memberId)].phoneDetail){
					this.PhoneList.push(this.familyMapMaster[this.IndividualFamilyMemberMappingMaster(this.memberId)].phoneDetail[i]);
				 }	
				 for(let i in this.familyMapMaster[this.IndividualFamilyMemberMappingMaster(this.memberId)].documentDetail){
					this.DocumentList.push(this.familyMapMaster[this.IndividualFamilyMemberMappingMaster(this.memberId)].documentDetail[i]);
				 }

	 }		 
	 this.nominee_member_id = this.nomineeMap[this.IndividualMapping(this.memberId)].personalDetail.nomineeMemberId;
	 this.PersonalDetailsForm.patchValue(this.nomineeMap[this.IndividualMapping(this.memberId)].personalDetail);
     this.AdditionalDetailForm.controls.additionalInformation.setValue(this.nomineeMap[this.IndividualMapping(this.memberId)].personalDetail.additional_info);	 
	 
	 this.AddressDetailsForm.patchValue(this.nomineeMap[this.IndividualMapping(this.memberId)].addressDetail.length!=0 ? this.nomineeMap[this.IndividualMapping(this.memberId)].addressDetail[0] : this.patchNull('AddressDetailsForm'));
	 this.selectedAddressId = this.nomineeMap[this.IndividualMapping(this.memberId)].addressDetail.length!=0 ? this.nomineeMap[this.IndividualMapping(this.memberId)].addressDetail[0].addressId : null;
	// this.butDisable = this.nomineeMap[this.IndividualMapping(this.memberId)].addressDetail.length!=0 ? true : false;	 
	 
	 this.EmailDetailsForm.patchValue(this.nomineeMap[this.IndividualMapping(this.memberId)].emailDetail.length!=0 ? this.nomineeMap[this.IndividualMapping(this.memberId)].emailDetail[0] : this.patchNull('EmailDetailsForm'));
	 this.selectedEmailId = this.nomineeMap[this.IndividualMapping(this.memberId)].emailDetail.length!=0 ? this.nomineeMap[this.IndividualMapping(this.memberId)].emailDetail[0].emailId : null;
//	 this.butDisableEmail = this.nomineeMap[this.IndividualMapping(this.memberId)].emailDetail.length!=0 ? true : false;
	 	 
	 this.PhoneDetailsForm.patchValue(this.nomineeMap[this.IndividualMapping(this.memberId)].phoneDetail.length!=0 ? this.nomineeMap[this.IndividualMapping(this.memberId)].phoneDetail[0] : this.patchNull('PhoneDetailsForm'));
	 this.selectedPhoneId = this.nomineeMap[this.IndividualMapping(this.memberId)].phoneDetail.length!=0 ? this.nomineeMap[this.IndividualMapping(this.memberId)].phoneDetail[0].phoneId : null;
	// this.butDisablePhone = this.nomineeMap[this.IndividualMapping(this.memberId)].phoneDetail.length!=0 ? true : false;
	 	 
	 this.DocDetailsForm.patchValue(this.nomineeMap[this.IndividualMapping(this.memberId)].documentDetail.length!=0 ? this.nomineeMap[this.IndividualMapping(this.memberId)].documentDetail[0] : this.patchNull('DocDetailsForm'));
	 this.selectedDocumentId = this.nomineeMap[this.IndividualMapping(this.memberId)].documentDetail.length!=0 ? this.nomineeMap[this.IndividualMapping(this.memberId)].documentDetail[0].documentId : null;
	 this.ActiveDocumentIdentifier = this.nomineeMap[this.IndividualMapping(this.memberId)].documentDetail.length!=0 ? this.nomineeMap[this.IndividualMapping(this.memberId)].documentDetail[0].documentIdentifier : null;
	 this.ActiveDocumentSize = this.nomineeMap[this.IndividualMapping(this.memberId)].documentDetail.length!=0 ? this.nomineeMap[this.IndividualMapping(this.memberId)].documentDetail[0].documentSize : null;
	// this.butDisableDocument = this.nomineeMap[this.IndividualMapping(this.memberId)].documentDetail.length!=0 ? true : false;
	 	  
	 this.ResetAddressBox();
	 this.selectCountry = null;
	 this.showPanel = true;
	 this.AddressDetailShow = true;
	 this.EmailDetailShow = true;
	 this.PhoneDetailShow = true;
	 this.DocumentDetailShow = true;
	 this.RequirementDetailShow = true;
	 
	this.butDisable = false;
	this.butDisableEmail = false;
	this.butDisablePhone = false;
	this.butDisableDocument = false; 
	 
	 
	// this.selectedAddressId_temp = null;
	// this.selectedEmailId_temp = null;
	// this.selectedPhoneId_temp = null;
	// this.selectedDocumentId_temp = null;
	 this.uploader.clearQueue();
	 
	 
  }  

  listChange = (form: string, param: number) => {
  
		 switch (form) {
				case 'AddressDetailsForm':
				        this.AddressDetailsForm.patchValue(this.AddressList[this.AddressMapping(param)]);
				break;
				case 'EmailDetailsForm':
						this.EmailDetailsForm.patchValue(this.EmailList[this.EmailMapping(param)]);
				break;
				case 'PhoneDetailsForm':
						this.PhoneDetailsForm.patchValue(this.PhoneList[this.PhoneMapping(param)]);
				break;
				case 'DocDetailsForm':
						this.DocDetailsForm.patchValue(this.DocumentList[this.DocumentMapping(param)]);
						this.ActiveDocumentIdentifier = this.DocumentList[this.DocumentMapping(param)].documentIdentifier;
						this.ActiveDocumentSize = this.DocumentList[this.DocumentMapping(param)].documentSize;
						this.uploader.clearQueue();						
				break;
	     }
		// this.captureString(form);	
  }   
  
  onSubmit = (form: string) => {
		let payload = null;
		this.feedTrimer(form);
		switch (form) {
					case 'PersonalDetailsForm':
							//this.PersonalDetailsForm.value.dateOfBirth = this.changeDateFormat(this.PersonalDetailsForm.value.dateOfBirth);
							this.PersonalDetailsForm.enable();
							payload = this.PersonalDetailsForm.value;
							payload.individualId = this.memberId;
							payload.nomineeMemberId = this.memberId == null ? 0 : this.nominee_member_id;
					break;
					case 'AddressDetailsForm':
							payload = this.AddressDetailsForm.value;
							payload.individualId = this.memberId;
							payload.addressId = this.selectedAddressId;
					break;
					case 'EmailDetailsForm':
						    payload = this.EmailDetailsForm.value;
						    payload.individualId = this.memberId;
						    payload.emailId = this.selectedEmailId;						   
					break;
					case 'PhoneDetailsForm':
						    payload = this.PhoneDetailsForm.value;
						    payload.individualId = this.memberId;
						    payload.phoneId = this.selectedPhoneId;						  
					break;
					case 'AdditionalDetailForm':
						    payload = this.AdditionalDetailForm.value;
						    payload.individualId = this.memberId;
					break;
					
		}
		console.log(payload);
		this.usersService.saveUserInfoMyNominee_temp(form, payload)
		.pipe(first())
		.subscribe(
			data => {
								switch (form) {
											case 'PersonalDetailsForm':
														this.memberId = data;
														this.pfStatusMsg = this.MsgList.PersonalDetailsForm_success;
											break;
											case 'AddressDetailsForm':
														this.selectedAddressId = Number(data);
														this.adStatusMsg = this.MsgList.AddressDetailsForm_success;
											break;
											case 'EmailDetailsForm':
														this.edStatusMsg = this.MsgList.EmailDetailsForm_success;
											break;
											case 'PhoneDetailsForm':
														this.pdStatusMsg = this.MsgList.PhoneDetailsForm_success;
											break;
											case 'AdditionalDetailForm':
														this.aiStatusMsg = this.MsgList.AdditionalDetailForm_success;
											break;
								}
								this.fetchNomineeInfo();
								this.fetchFamilyMembersMaster();
								
					},
		error => {
			console.log('Error when saving the users info: ' + JSON.stringify(error));
			this.resetForm(form);
		});
  }

  onSubmitDoc = () => {
	  this.feedTrimer('DocDetailsForm');
	  let payload = this.DocDetailsForm.value;
	  payload.individualId = this.memberId;
      payload.documentId = this.selectedDocumentId;
	  
	  let formData: any = new FormData();
	  for (let i = 0; i < this.uploader.queue.length; i++) {
				let fileItem = this.uploader.queue[i]._file;
				formData.append("file", fileItem);
      }
	  
	  formData.append('payload', JSON.stringify(payload));
      console.log(Array.from(formData));
	  
	   this.usersService.saveDocumentsNominee(formData)
      .pipe(first())
      .subscribe(
        data => {

						  this.selectedDocumentId = Number(data);
						  this.selectedDocumentId_temp = this.selectedDocumentId
						  this.doStatusMsg = this.MsgList.DocDetailsForm_success;
						  this.fetchNomineeInfo();
						  this.fetchFamilyMembersMaster();
        },
        error => {
          console.log('Error when saving the users info: ' + JSON.stringify(error));
        }
      );
  }	

  DownloadFile() {
    this.usersService.downloadFiles(this.selectedDocumentId.toString())
      .subscribe(data => {
        saveAs(new Blob([data], { type: '' }), this.DocumentList[this.DocumentMapping(this.selectedDocumentId)].documentIdentifier)


      });
  }
  
  AddNewFamilyMember = (param: string) => {
	  
	this.showPanel = true;
	
	this.ActiveDocumentIdentifier = null;
	
	this.memberId = null;
	this.selectedAddressId = null;
	this.selectedEmailId = null;
	this.selectedPhoneId = null;
	this.selectedDocumentId = null;
	
	this.AddressDetailShow = true;
    this.EmailDetailShow = true;
    this.PhoneDetailShow = true;
    this.DocumentDetailShow = true;
    this.RequirementDetailShow = true;
	
	this.butDisable = false;
	this.butDisableEmail = false;
	this.butDisablePhone = false;
	this.butDisableDocument = false;
	
	this.AddressList = [];
	this.EmailList = [];
	this.PhoneList = [];
	this.DocumentList = [];	
	
	param == "members" ? this.AddeNomineeconfirmbox() : this.personalDetailFormReset('New');
	
  }
  
  AddeNomineeconfirmbox = () => {
				
				this.dialogService.openNomineeList('NomineeMember',this.familyMap,this.familyMapKeysLs)
				.afterClosed().subscribe(res =>{
						if(res!=null){
											this.memberId = res;
											this.PersonalDetailsForm.disable();
											this.PersonalDetailsForm.patchValue(this.familyMap[this.IndividualFamilyMemberMapping(res)].personalDetail);
											this.personalDetailFormReset('member');
											this.nominee_member_id = 0;		
						}
						else
						{
											this.showPanel = false;
											this.memberId = null;
											this.nominee_member_id = 0;									
						}					
				});
 }
  
  IndividualFamilyMemberMapping = (param: number) => {
    for (let i in this.familyMap) {
      if (this.familyMap[i].personalDetail.individualId == param) {
        return i;
      }
    }
  }
  
  IndividualFamilyMemberMappingMaster = (param: number) => {
    for (let i in this.familyMapMaster) {
      if (this.familyMapMaster[i].personalDetail.individualId == param) {
        return i;
      }
    }	  
  }
  
  IndividualMapping = (param: number) => {
    for (let i in this.nomineeMap) {
      if (this.nomineeMap[i].personalDetail.individualId == param) {
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
    return null;
  }

  AddressMapping(param: number) {
    for (let i in this.AddressList) {
      if (this.AddressList[i].addressId == param) {
        return i;
      }
    }
    return null;
  }

  EmailMapping(param: number) {
    for (let i in this.EmailList) {
      if (this.EmailList[i].emailId == param) {
        return i;
      }
    }
    return null;
  }

  PhoneMapping(param: number) {
    for (let i in this.PhoneList) {
      if (this.PhoneList[i].phoneId == param) {
        return i;
      }
    }
    return null;
  }
  
  personalDetailFormReset = (param: string) => {
		if(param == 'member'){
			       	this.PersonalDetailsForm.controls.title.disable();
					this.PersonalDetailsForm.controls.firstName.disable();
					this.PersonalDetailsForm.controls.lastName.disable();
					this.PersonalDetailsForm.controls.middleName.disable();
					this.PersonalDetailsForm.controls.gender.disable();
					this.PersonalDetailsForm.controls.dateOfBirth.disable();
					this.PersonalDetailsForm.controls.relationship.disable();
					this.PersonalDetailsForm.controls.primaryFlag.enable();
		}
		else {
					this.PersonalDetailsForm.disable();
					this.PersonalDetailsForm.patchValue(this.patchNull('PersonalDetailsForm'));
					this.PersonalDetailsForm.enable();
		}
		this.PersonalDetailsForm.controls.primaryFlag.setValue(this.nomineeMapKeyLs.length==0 ? "Y" : "N");	
	
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
  
  patchNull = (form: string) => {
	  switch (form) {
				case 'PersonalDetailsForm':
						return {"title":"","firstName":"","middleName":"","lastName":"","gender":"","dateOfBirth":"","relationship":"","primaryFlag":""};
				break;
				case 'AddressDetailsForm':
						return  {"addressLine1":"","addressLine2":"","addressLine3": "","addressLine4":"","countryState":"","country":"","postCode":""};
				break;
				case 'EmailDetailsForm':
						return  {"emailAddress":null};
				break;
				case 'PhoneDetailsForm':
						return  {"countryCode":"044","phoneNumber":""};
				break;
				case 'DocDetailsForm':
						return {"documentType":"","countryOfIssue":"","documentNumber":"","issueingAuthority":"","issueDate":"","expiaryDate":"","additionalInformation":"","documentIdentifier":"","documentSize":""}
				break;
				case 'All':
						this.PersonalDetailsForm.patchValue({"title":"","firstName":"","middleName":"","lastName":"","gender":"","dateOfBirth":"","relationship":"","primaryFlag":""});
						this.AddressDetailsForm.patchValue({"addressLine1":"","addressLine2":"","addressLine3": "","addressLine4":"","countryState":"","country":"","postCode":""});
						this.EmailDetailsForm.patchValue({"emailAddress":null});
				break;
	  }
  }
  
  changeDateFormat = (param: string) => {
	     return this.pipe.transform(new Date(param), 'yyyy-MM-dd');
  }

  captureString = (form: string) => {
	   switch (form) {
				case 'PersonalDetailsForm':
						this.CompareString =  this.PersonalDetailsForm.controls.title.value+
						                      this.PersonalDetailsForm.controls.firstName.value+
                                               this.PersonalDetailsForm.controls.middleName.value+
                                               this.PersonalDetailsForm.controls.lastName.value+
                                               this.PersonalDetailsForm.controls.gender.value+
                                               this.PersonalDetailsForm.controls.dateOfBirth.value+
                                               this.PersonalDetailsForm.controls.relationship.value+
											   this.PersonalDetailsForm.controls.primaryFlag.value;
                          						 
				break;	   
				case 'AddressDetailsForm':
						this.CompareString = this.AddressDetailsForm.controls.addressLine1.value+
											 this.AddressDetailsForm.controls.addressLine2.value+
											 this.AddressDetailsForm.controls.addressLine3.value+
											 this.AddressDetailsForm.controls.addressLine4.value+
											 this.AddressDetailsForm.controls.postCode.value+
											 this.AddressDetailsForm.controls.countryState.value+
											 this.AddressDetailsForm.controls.country.value;
				break;
				case 'EmailDetailsForm':
						this.CompareString = this.EmailDetailsForm.controls.emailAddress.value+
											 this.EmailDetailsForm.controls.primaryFlag.value;
				break;
				case 'PhoneDetailsForm':
						this.CompareString = this.PhoneDetailsForm.controls.countryCode.value+
										     this.PhoneDetailsForm.controls.phoneNumber.value+
											 this.PhoneDetailsForm.controls.primaryFlag.value;
						
				break;
				case 'DocDetailsForm':
						this.CompareString = this.DocDetailsForm.controls.documentType.value+
											 this.DocDetailsForm.controls.countryOfIssue.value+
											 this.DocDetailsForm.controls.documentNumber.value+
											 this.DocDetailsForm.controls.issueingAuthority.value+
											 this.DocDetailsForm.controls.issueDate.value+
											 this.DocDetailsForm.controls.expiaryDate.value+
											 this.DocDetailsForm.controls.additionalInformation.value+
											 this.DocDetailsForm.controls.documentIdentifier.value+
											 this.DocDetailsForm.controls.documentSize.value;
				break;
				case 'AdditionalDetailForm':
						this.CompareString = this.AdditionalDetailForm.controls.additionalInformation.value;
				break;
	   }	  
  }

  changeCapture = (form: string) => {
		  switch (form) {
					case 'PersonalDetailsForm':
							return (this.CompareString == this.PersonalDetailsForm.controls.title.value+
					                              this.PersonalDetailsForm.controls.firstName.value+
                                                  this.PersonalDetailsForm.controls.middleName.value+
                                                  this.PersonalDetailsForm.controls.lastName.value+
                                                  this.PersonalDetailsForm.controls.gender.value+
                                                  this.changeDateFormat(this.PersonalDetailsForm.controls.dateOfBirth.value)+
                                                  this.PersonalDetailsForm.controls.relationship.value+
									              this.PersonalDetailsForm.controls.primaryFlag.value ? true : false);					
					break;
					case 'AddressDetailsForm':
							return (this.CompareString == this.AddressDetailsForm.controls.addressLine1.value+
												  this.AddressDetailsForm.controls.addressLine2.value+
												  this.AddressDetailsForm.controls.addressLine3.value+
												  this.AddressDetailsForm.controls.addressLine4.value+
												  this.AddressDetailsForm.controls.postCode.value+
												  this.AddressDetailsForm.controls.countryState.value+
												  this.AddressDetailsForm.controls.country.value ? true : false);	
					break;
					case 'EmailDetailsForm':
								return (this.CompareString == this.EmailDetailsForm.controls.emailAddress.value+
														     this.EmailDetailsForm.controls.primaryFlag.value ? true : false);	
					break;
					case 'PhoneDetailsForm':
								return (this.CompareString == this.PhoneDetailsForm.controls.countryCode.value+
															 this.PhoneDetailsForm.controls.phoneNumber.value+
					                                         this.PhoneDetailsForm.controls.primaryFlag.value ? true : false);	
					break;
					case 'DocDetailsForm':
								return (this.CompareString == this.DocDetailsForm.controls.documentType.value+
															  this.DocDetailsForm.controls.countryOfIssue.value+
															  this.DocDetailsForm.controls.documentNumber.value+
															  this.DocDetailsForm.controls.issueingAuthority.value+
															  this.DocDetailsForm.controls.issueDate.value+
															  this.DocDetailsForm.controls.expiaryDate.value+
															  this.DocDetailsForm.controls.additionalInformation.value+
															  this.DocDetailsForm.controls.documentIdentifier.value+
															  this.DocDetailsForm.controls.documentSize.value ? true : false);
     				break;
					case 'AdditionalDetailForm':
						return (this.CompareString == this.AdditionalDetailForm.controls.additionalInformation.value ? true : false);
					break;
		   }	  
  }
  
  ResetMsgBox = () => {
		this.pfStatusMsg = null;
		this.adStatusMsg = null;
		this.edStatusMsg = null;
		this.pdStatusMsg = null;
		this.doStatusMsg = null;
		this.aiStatusMsg = null;
		this.msgType = "success";
  }	

  ResetAddressBox = () => {
	  // this.selectCountry = null;
	   this.butDisabledSelectCountry = false;
	   this.PostalBoxShow = false;
	   this.butDisableUniversalList = false;
	   this.postCode = "";
	   this.PostalListShow = false;		
  }

  IsFamilyMember = (param : any)=>{
	  for( let i in this.familyMapMaster){
				if(this.familyMapMaster[i].personalDetail.individualId == param){
				return true;
				
			  }
	  }
	  return false;
  }
  
  AddeSelectCountry = (param: string) => {
	  this.ResetAddressBox();
	  this.CountryList[param].search_flag=='N' ? this.AddressDetailsForm.patchValue(this.patchNull('AddressDetailsForm')):this.PostalBoxShow=true;
	  this.CountryList[param].search_flag=='N' ? this.AddressDetailsForm.enable() : this.AddressDetailsForm.disable();
	  this.AddressDetailsForm.controls.country.setValue(this.CountryList[param].country_name);	 
	  
  }

  AddAddressManually = () => {
	   this.ResetAddressBox();
	   this.AddressDetailsForm.patchValue(this.patchNull('AddressDetailsForm'));
	   this.AddressDetailsForm.controls.country.setValue(this.CountryList[this.selectCountry].country_name);
	   this.AddressDetailsForm.enable(); 
  }

  removeId = (form: string) => {
	   switch (form) {
				case 'PersonalDetailsForm':
							this.requiredId = this.memberId;							
				break;
				case 'AddressDetailsForm':
							this.requiredId = this.selectedAddressId.toString();;
				break;
				case 'EmailDetailsForm':
							this.requiredId = this.selectedEmailId.toString();;
				break;
				case 'PhoneDetailsForm':
							this.requiredId = this.selectedPhoneId.toString();;
				break;
				case 'DocDetailsForm':
							this.requiredId = this.selectedDocumentId.toString();;
				break;
	   }
	   this.usersService.removeId(form+"Nominee",this.requiredId)
	   .pipe(first())
       .subscribe(
        data => {
					switch (form) {
						case 'PersonalDetailsForm':
						            this.memberId = null;
						break;
						case 'AddressDetailsForm':
									this.selectedAddressId = null;
									this.selectedAddressId_temp = this.selectedAddressId;
									this.msgType = "success";
									this.adStatusMsg = this.MsgList.AddressDetailsForm_removed;
						break;
						case 'EmailDetailsForm':
									this.selectedEmailId = null;
									this.selectedEmailId_temp = this.selectedEmailId;
									this.msgType = "success";
									this.edStatusMsg = this.MsgList.EmailDetailsForm_removed;
						break;
						case 'PhoneDetailsForm':
								    this.selectedPhoneId = null;
									this.selectedPhoneId_temp = this.selectedPhoneId;
									this.msgType = "success";
									this.pdStatusMsg = this.MsgList.PhoneDetailsForm_removed;
						break;
						case 'DocDetailsForm':
									this.selectedDocumentId = null;
									this.selectedDocumentId_temp = this.selectedDocumentId;
									this.ActiveDocumentIdentifier = null;
									this.msgType = "success";
									this.doStatusMsg = this.MsgList.DocDetailsForm_removed;
						break;
						case 'AdditionalDetailForm':
									this.msgType = "success";
									this.aiStatusMsg = this.MsgList.AdditionalDetailForm_removed;
						break;
					}
					this.fetchNomineeInfo();
					this.fetchFamilyMembersMaster();
			
		});
		this.requiredId = null;	   
   }

  RemoveDoc = () => {
			   this.ActiveDocumentIdentifier = null;
  }	  

  feedTrimer = (form: string) => {
			switch (form) {
								case 'PersonalDetailsForm':
											this.PersonalDetailsForm.controls.firstName.setValue(this.PersonalDetailsForm.controls.firstName.value.trim());
											this.PersonalDetailsForm.controls.middleName.setValue(this.PersonalDetailsForm.controls.middleName.value.trim());
											this.PersonalDetailsForm.controls.lastName.setValue(this.PersonalDetailsForm.controls.lastName.value.trim());
											
								break;
								case 'AddressDetailsForm':
											this.AddressDetailsForm.controls.addressLine1.setValue(this.AddressDetailsForm.controls.addressLine1.value.trim());
											this.AddressDetailsForm.controls.addressLine2.setValue(this.AddressDetailsForm.controls.addressLine2.value.trim());
											this.AddressDetailsForm.controls.addressLine3.setValue(this.AddressDetailsForm.controls.addressLine3.value.trim());
											this.AddressDetailsForm.controls.addressLine4.setValue(this.AddressDetailsForm.controls.addressLine4.value.trim());
											this.AddressDetailsForm.controls.postCode.setValue(this.AddressDetailsForm.controls.postCode.value.trim());
											this.AddressDetailsForm.controls.countryState.setValue(this.AddressDetailsForm.controls.countryState.value.trim());

								break;
								case 'EmailDetailsForm':
											this.EmailDetailsForm.controls.emailAddress.setValue(this.EmailDetailsForm.controls.emailAddress.value.trim());
								break;
								case 'PhoneDetailsForm':
											this.PhoneDetailsForm.controls.countryCode.setValue(this.PhoneDetailsForm.controls.countryCode.value.trim());
											this.PhoneDetailsForm.controls.phoneNumber.setValue(this.PhoneDetailsForm.controls.phoneNumber.value.trim());
								break;
								case 'DocDetailsForm':
											this.DocDetailsForm.controls.documentType.setValue(this.DocDetailsForm.controls.documentType.value.trim());
											this.DocDetailsForm.controls.countryOfIssue.setValue(this.DocDetailsForm.controls.countryOfIssue.value.trim());
											this.DocDetailsForm.controls.documentNumber.setValue(this.DocDetailsForm.controls.documentNumber.value.trim());
											this.DocDetailsForm.controls.issueingAuthority.setValue(this.DocDetailsForm.controls.issueingAuthority.value.trim());
								break;
			}
  }  

}