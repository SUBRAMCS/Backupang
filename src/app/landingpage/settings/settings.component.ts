import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { UsersService } from 'src/app/core/services/users.service';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { Router, NavigationStart, NavigationEnd } from "@angular/router";
import { AuthenticateService } from "src/app/core/services/authenticate.service";
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
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
			   {provide: DateAdapter,useClass: MomentDateAdapter,deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]},
			   {provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_Format}],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class SettingsComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({ isHTML5: true });
  pipe = new DatePipe('en-US');
  memberId: any;
  selectedAddressId: number;
  selectedEmailId: number;
  selectedPhoneId: number;
  
  selectPostCodeAddressId: number;
  msgType: string;
  
  minDate = new Date(new Date().getFullYear() - 100,new Date().getMonth(),new Date().getDate());
  maxDate = new Date(new Date().getFullYear() - 18,new Date().getMonth(),new Date().getDate());


  
  familyMap = {};
  TitleList = [];
  RelationshipListNominee = [];
  RelationshipListFamily = [];
  GenderList = [];
  CountryList=[];
  
  AddressPostCodeList = [];
  
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
  
  CompareString: string;
  postCode: string;
  
  AddressDetailShow: boolean;
  EmailDetailShow: boolean;
  PhoneDetailShow: boolean;
    
  PostalBoxShow: boolean;
  PostalListShow: boolean;
  loading: boolean; 
  
  pfStatusMsg: string;
  adStatusMsg: string;
  edStatusMsg: string;
  pdStatusMsg: string;
  doStatusMsg: string;
  aiStatusMsg: string;
  
  PersonalDetailsForm: FormGroup;
  AddressDetailsForm: FormGroup;
  EmailDetailsForm: FormGroup;
  PhoneDetailsForm: FormGroup;
  PostCodeForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private validatorService: ValidatorService,
    private usersService: UsersService,
    private dialogService: DialogService,
	private router: Router,
    private authenticationService: AuthenticateService,
  ) {

  }

  ngOnInit() {
   
    this.initForms();
	this.fetchUtilityMembers();
	this.fetchUserInfo();    
   
   	this.memberId = null;
	this.selectedAddressId = null;
	this.selectedEmailId = null;
	this.selectedPhoneId = null;
	this.CompareString = "";
	this.postCode = "";
	
	this.selectPostCodeAddressId = null;
	
	this.AddressDetailShow = true;
    this.EmailDetailShow = true;
	this.PhoneDetailShow = true;
		
	this.PostalBoxShow = false;
	this.PostalListShow = false;
	this.loading = false;	
	
	this.pfStatusMsg = null;
    this.adStatusMsg = null;
    this.edStatusMsg = null;
    this.pdStatusMsg = null;
    this.doStatusMsg = null;
    this.aiStatusMsg = null;
	
	this.msgType = "success";
	
   }

  initForms = () => {
    this.initPersonalDetailsForm();
    this.initEmailDetailsForm();
    this.initPhoneDetailsForm();
	this.initAddressDetailsForm();
	this.initPostCodeForm();
  }

  initPostCodeForm = () => {
	  this.PostCodeForm = this.formBuilder.group({
        postCode: ['', [Validators.required, Validators.pattern('^[a-zA-Z]{1}[a-zA-Z0-9]*\ {0,1}[a-zA-Z0-9]*[a-zA-Z]{1}$')]]
	  });
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
      country: ['UK', Validators.required]
    });

    this.AddressDetailsForm.disable();
  }

  initEmailDetailsForm = () => {
    this.EmailDetailsForm = this.formBuilder.group({
      emailAddress: [{ value: '', disabled: true }, [Validators.required, Validators.email, Validators.pattern('(^([\-\_\.a-zA-Z0-9]+)@([a-zA-Z0-9]+)\.([a-zA-Z]{2,5})$)|(^([\-\_\.a-zA-Z0-9]+)@([a-zA-Z0-9]+)\.([a-zA-Z]{2})\.([a-zA-Z]{2})$)'), Validators.maxLength(70)]]     
    });
  
    this.EmailDetailsForm.disable();
  }

  initPhoneDetailsForm = () => {
    this.PhoneDetailsForm = this.formBuilder.group({
      countryCode: [{ value: '+44', disabled: true }, [Validators.required]],
      phoneNumber: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[0][0-9]{10}$|^[1-9][0-9]{9}$')]]   
    });
    this.PhoneDetailsForm.disable();
  }

  fetchUserInfo = () => {
				this.usersService.fetchUserInfo_Acct_temp()
				  .pipe(first())
				  .subscribe(
					(data: any) => {
				//	  console.log(data);
					  if (data) {
						this.familyMap = data['familyMembers'];
					    this.panelClk();
					  }

					},
					(error: any) => {
					  console.log('Error when fetching the account profile data in component: ' + JSON.stringify(error));
					});
  }

  fetchUtilityMembers = () => {  
				this.usersService.fetchUtilityList()
				.pipe(first())
				.subscribe(
				data => {
					//		console.log(data);
  
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

  fetchAddressForPostCode = (postalCode : string) => {
	  this.AddressPostCodeList = [];	  
      this.loading = true;
	  this.usersService.fetchAddressForPostCode(postalCode)
	  .pipe(first())
      .subscribe(
       data => {
		this.AddressDetailsForm.enable();
		    if(data['result']) {      
					this.AddressPostCodeList = data['result'];         
			}
			this.PostalListShow = true;
			this.selectPostCodeAddressId = null;
			this.loading = false;	
			this.AddressDetailsForm.disable();		
       },
       error => {
		   this.AddressDetailsForm.enable();
		   this.loading = false;
		   this.PostCodeForm.controls.postCode.setErrors({'incorrect': true});
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

  toggleEditState = (form: string) => {
	   this.panelClk();
	   this.ResetMsgBox();
	   switch (form) {
								case 'PersonalDetailsForm':
											this.PersonalDetailsForm.enable();	
								break;	   
								case 'AddressDetailsForm':
											this.AddressDetailShow = false;
											this.PostalBoxShow = true;
								break;
								case 'EmailDetailsForm':
											this.EmailDetailShow = false;
											this.EmailDetailsForm.enable();
								break;
								case 'PhoneDetailsForm':
											this.PhoneDetailShow = false;
											this.PhoneDetailsForm.enable();									
								break;
	   }
	   this.captureString(form);
  }

  resetForm = (form: string) => {
	  		this.panelClk();
			switch (form) {
								case 'PersonalDetailsForm':
											this.PersonalDetailsForm.patchValue(this.familyMap['personalDetail']);
											this.PersonalDetailsForm.disable();
								break;
								case 'AddressDetailsForm':
											this.ResetAddressBox();
											this.AddressDetailsForm.patchValue(this.familyMap['addressDetail'].length!=0 ? this.familyMap['addressDetail'][0] : this.patchNull('AddressDetailsForm'));
											this.AddressDetailShow = true;
											this.AddressDetailsForm.disable();
								break;
								case 'EmailDetailsForm':
											this.EmailDetailsForm.patchValue(this.familyMap['emailDetail'].length!=0 ? this.familyMap['emailDetail'][0] : this.patchNull('AddressDetailsForm'));	  
											this.EmailDetailShow = true;
											this.EmailDetailsForm.disable();
								break;
								case 'PhoneDetailsForm':
											this.PhoneDetailShow = true;
											this.PhoneDetailsForm.disable();								
								break;
			}
  }

  onSubmit = (form: string) => {
	let payload = null;
	this.feedTrimer(form);	
	switch (form) {
				case 'PersonalDetailsForm':
						 this.PersonalDetailsForm.value.dateOfBirth = this.changeDateFormat(this.PersonalDetailsForm.value.dateOfBirth);
						 payload = this.PersonalDetailsForm.value;
						 payload.individualId = this.memberId;	
				break;
				case 'AddressDetailsForm':
						 	payload = this.AddressDetailsForm.value;
							payload.individualId = this.memberId;
							payload.addressId = this.selectedAddressId;
							payload.addressflag = this.AddressDetailsForm.status == 'DISABLED' ? 1 : 0;
				break;
				case 'EmailDetailsForm':
							payload = this.EmailDetailsForm.value;
						    payload.individualId = this.memberId;
						    payload.emailId = this.selectedEmailId;						 
				break;
				case 'PhoneDetailsForm':
					       this.PhoneDetailsForm.controls.phoneNumber.setValue(this.PhoneDetailsForm.controls.phoneNumber.value.substring(0,1)=='0' ? this.PhoneDetailsForm.controls.phoneNumber.value.substring(1) : this.PhoneDetailsForm.controls.phoneNumber.value);
						   this.PhoneDetailsForm.value.countryCode = "44";
						   payload = this.PhoneDetailsForm.value;
						   payload.individualId = this.memberId;
						   payload.phoneId = this.selectedPhoneId;
				break;
	}
	console.log(payload);
	this.usersService.saveUserInfo_temp(form, payload)
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
									this.AddressDetailsForm.disable();						
						break;
						case 'EmailDetailsForm':
										this.logout();     
									    return;
						break;
						case 'PhoneDetailsForm':
										this.logout();	        
										return;
						break;
					}
				this.fetchUserInfo();
           			
        },
        error => {
          console.log('Error when saving the users info: ' + JSON.stringify(error));
          this.resetForm(form);
        }
      );
      
  } 

  panelClk = () => {
      
	  this.memberId = this.familyMap['personalDetail'].individualId;
	  this.familyMap['personalDetail'].title == 'elocker' ? this.familyMap['personalDetail'].title = null : null;
	  this.PersonalDetailsForm.patchValue(this.familyMap['personalDetail']);
	  this.AddressDetailsForm.patchValue(this.familyMap['addressDetail'].length!=0 ? this.familyMap['addressDetail'][0] : this.patchNull('AddressDetailsForm'));
	  this.selectedAddressId = this.familyMap['addressDetail'].length!=0 ? this.familyMap['addressDetail'][0].addressId : null;
	  this.EmailDetailsForm.patchValue(this.familyMap['emailDetail'].length!=0 ? this.familyMap['emailDetail'][0] : this.patchNull('AddressDetailsForm'));	  
	  this.selectedEmailId = this.familyMap['emailDetail'].length!=0 ? this.familyMap['emailDetail'][0].emailId : null;
	  this.PhoneDetailsForm.patchValue(this.familyMap['phoneDetail'].length!=0 ? this.familyMap['phoneDetail'][0] : this.patchNull('PhoneDetailsForm'));
	  this.PhoneDetailsForm.controls.countryCode.setValue('+44');
	  this.selectedPhoneId =  this.familyMap['phoneDetail'].length!=0 ? this.familyMap['phoneDetail'][0].phoneId : null;
	  this.PersonalDetailsForm.disable();
	  this.AddressDetailShow = true;
	  this.EmailDetailShow = true;
	  this.EmailDetailsForm.disable();
	  this.ResetAddressBox();
  }
 
  changeDateFormat(param: string): string {
    return this.pipe.transform(new Date(param), 'yyyy-MM-dd');
  }

  changeCapture = (form: string) => {
		  switch (form) {
					case 'PersonalDetailsForm':
							return (this.CompareString == this.PersonalDetailsForm.controls.title.value+
					                              this.PersonalDetailsForm.controls.firstName.value+
                                                  this.PersonalDetailsForm.controls.middleName.value+
                                                  this.PersonalDetailsForm.controls.lastName.value+
                                                  this.PersonalDetailsForm.controls.gender.value+
                                                  this.changeDateFormat(this.PersonalDetailsForm.controls.dateOfBirth.value) ? true : false);					
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
							return (this.CompareString == this.EmailDetailsForm.controls.emailAddress.value ? true : false);	
					break;
					case 'PhoneDetailsForm':
							return (this.CompareString == (this.PhoneDetailsForm.controls.countryCode.value+"-"+
								        (this.PhoneDetailsForm.controls.phoneNumber.value.substring(0,1)=="0" ? this.PhoneDetailsForm.controls.phoneNumber.value.substring(1) : this.PhoneDetailsForm.controls.phoneNumber.value)) ? true : false);	
					break;
		   }	  
  }

  captureString = (form: string) => {
	   switch (form) {
				case 'PersonalDetailsForm':
						this.CompareString =  this.PersonalDetailsForm.controls.title.value+
					                           this.PersonalDetailsForm.controls.firstName.value+
                                               this.PersonalDetailsForm.controls.middleName.value+
                                               this.PersonalDetailsForm.controls.lastName.value+
                                               this.PersonalDetailsForm.controls.gender.value+
                                               this.PersonalDetailsForm.controls.dateOfBirth.value;
                          						 
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
						this.CompareString = this.EmailDetailsForm.controls.emailAddress.value;
				break;
				case 'PhoneDetailsForm':
					this.CompareString = this.PhoneDetailsForm.controls.countryCode.value+"-"+
										 (this.PhoneDetailsForm.controls.phoneNumber.value.substring(0,1)=='0' ? this.PhoneDetailsForm.controls.phoneNumber.value.substring(1) : this.PhoneDetailsForm.controls.phoneNumber.value);
						
				break;
	   }	  
  } 

  patchNull = (form: string) => {
	  switch (form) {
				case 'PersonalDetailsForm':
						return {"title":"","firstName":"","middleName":"","lastName":"","gender":"","dateOfBirth":"","relationship":"","primaryFlag":""};
				break;
				case 'AddressDetailsForm':
						return  {"addressLine1":"","addressLine2":"","addressLine3": "","addressLine4":"","countryState":"","country":"United Kingdom","postCode":""};
				break;
				case 'EmailDetailsForm':
						return  {"emailAddress":null};
				break;
				case 'PhoneDetailsForm':
						return  {"countryCode":"+44","phoneNumber":null};
				break;
				case 'DocDetailsForm':
						return {"documentType":"","countryOfIssue":"","documentNumber":"","issueingAuthority":"","issueDate":"","expiaryDate":"","additionalInformation":"","documentIdentifier":"","documentSize":""}
				break;
				case 'All':
						this.PersonalDetailsForm.patchValue({"title":"","firstName":"","middleName":"","lastName":"","gender":"","dateOfBirth":"","relationship":"","primaryFlag":""});
						this.AddressDetailsForm.patchValue({"addressLine1":"","addressLine2":"","addressLine3": "","addressLine4":"","countryState":"","country":"","postCode":""});
						this.EmailDetailsForm.patchValue({"emailAddress":null});
						this.PhoneDetailsForm.patchValue({"countryCode":"+44","phoneNumber":null})
				break;
	  }
  }

  AddAddressManually = () => {
	   this.ResetAddressBox();
	   this.AddressDetailsForm.patchValue(this.patchNull('AddressDetailsForm'));
	   this.AddressDetailsForm.enable(); 
  }

  ResetAddressBox = () => {
	   this.PostalBoxShow = false;
	   this.initPostCodeForm();
	   this.PostalListShow = false;		
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

  confirmbox = (form: string) => {
	let msg = "";
	switch (form) {
			case 'EmailDetailsForm':
					msg = "SelfEmailMsg";	
			break;
			case 'PhoneDetailsForm':
				    msg = "SelfPhoneMsg";	
			break;
			case 'SelfEmailMsg2':
					msg = "SelfEmailMsg2";	
			break;
			case 'SelfPhoneMsg2':
				    msg = "SelfPhoneMsg2";	
			break;
	}
if(form=='EmailDetailsForm' || form=='PhoneDetailsForm'){
    this.dialogService.openConfirmDialog(msg)
    .afterClosed().subscribe(res =>{
     
      if(res==true){
         this.toggleEditState(form);           
       }
       else
       {
         this.resetForm(form);
       }
	});
}
if(form=='SelfEmailMsg2'){
	this.dialogService.openConfirmDialog(msg)
    .afterClosed().subscribe(res =>{
     
      if(res==true){
         this.onSubmit('EmailDetailsForm')           
       }
       else
       {
         this.resetForm('EmailDetailsForm');
       }
	});
}
if(form=='SelfPhoneMsg2'){
	this.dialogService.openConfirmDialog(msg)
    .afterClosed().subscribe(res =>{
     
      if(res==true){
         this.onSubmit('PhoneDetailsForm')           
       }
       else
       {
         this.resetForm('PhoneDetailsForm');
       }
	});
}

  }

  logout = () => {
    console.log('User has logged out');
    this.authenticationService.logout().subscribe(
      data => {
        console.log('Status of user logout %s', data);
        if (data) {
          this.router.navigate(['/']);
        }
      },
      error => {
        console.log('Something went wrong while logging out');
      }
    )
  }
  
  feedTrimer = (form: string) => {
	switch (form) {
						case 'PersonalDetailsForm':
									this.PersonalDetailsForm.controls.firstName.value!=null ? this.PersonalDetailsForm.controls.firstName.setValue(this.PersonalDetailsForm.controls.firstName.value.trim()) : null;
									this.PersonalDetailsForm.controls.middleName.value!=null ? this.PersonalDetailsForm.controls.middleName.setValue(this.PersonalDetailsForm.controls.middleName.value.trim()) : null;
									this.PersonalDetailsForm.controls.lastName.value!=null ? this.PersonalDetailsForm.controls.lastName.setValue(this.PersonalDetailsForm.controls.lastName.value.trim()) : null;
									
						break;
						case 'AddressDetailsForm':
									this.AddressDetailsForm.controls.addressLine1.value!=null ? this.AddressDetailsForm.controls.addressLine1.setValue(this.AddressDetailsForm.controls.addressLine1.value.trim()) : null;
									this.AddressDetailsForm.controls.addressLine2.value!=null ? this.AddressDetailsForm.controls.addressLine2.setValue(this.AddressDetailsForm.controls.addressLine2.value.trim()) : null;
									this.AddressDetailsForm.controls.addressLine3.value!=null ? this.AddressDetailsForm.controls.addressLine3.setValue(this.AddressDetailsForm.controls.addressLine3.value.trim()) : null;
									this.AddressDetailsForm.controls.addressLine4.value!=null ? this.AddressDetailsForm.controls.addressLine4.setValue(this.AddressDetailsForm.controls.addressLine4.value.trim()) : null;
									this.AddressDetailsForm.controls.postCode.value!=null ? this.AddressDetailsForm.controls.postCode.setValue(this.AddressDetailsForm.controls.postCode.value.trim()) : null;
									this.AddressDetailsForm.controls.countryState.value!=null ? this.AddressDetailsForm.controls.countryState.setValue(this.AddressDetailsForm.controls.countryState.value.trim()) : null;

						break;
						case 'EmailDetailsForm':
									this.EmailDetailsForm.controls.emailAddress.value!=null ? this.EmailDetailsForm.controls.emailAddress.setValue(this.EmailDetailsForm.controls.emailAddress.value.trim()) : null;
						break;
						case 'PhoneDetailsForm':
									this.PhoneDetailsForm.controls.countryCode.value!=null ? this.PhoneDetailsForm.controls.countryCode.setValue(this.PhoneDetailsForm.controls.countryCode.value.trim()) : null;
									this.PhoneDetailsForm.controls.countryCode.value!=null ? this.PhoneDetailsForm.controls.phoneNumber.setValue(this.PhoneDetailsForm.controls.phoneNumber.value.trim()) : null;
						break;
	}
}

}
