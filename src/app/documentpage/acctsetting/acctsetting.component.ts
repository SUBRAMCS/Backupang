import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsersService } from 'src/app/core/services/users.service';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { ValidatorService } from 'src/app/core/validators/validator.service';
import { first } from 'rxjs/operators';
import { Account } from 'src/app/core/models/account';
import { AlertComponent } from 'src/app/shared/alert/alert.component';

@Component({
  selector: 'app-acctsetting',
  templateUrl: './acctsetting.component.html',
  styleUrls: ['./acctsetting.component.css']
})
export class AcctsettingComponent implements OnInit {

  userInfo: any | Account = {};
  personalDetailsForm: FormGroup;
  addressDetailsForm: FormGroup;
  contactDetailsForm: FormGroup;
  showAddressForm: boolean = false;
  showPCAddressForm: boolean = false;
  addressList = [];
  pfStatusMsgHide: boolean = true;
  afStatusMsgHide: boolean = true;
  cfStatusMsgHide: boolean = true;

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
  }

  ngOnInit() {

    //Initialize personal details form
    this.initPersonalDetailsForm();

    //Initialize address details form
    this.initAddressDetailsForm();

    //Initialize contact details form
    this.initContactDetailsForm();
	
	 //Populate the form for logged-in user
    this.fetchUserInfo();
	


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

    //Fetch the details of the logged-in user
    fetchUserInfo = () => {
      this.usersService.fetchUserInfo()
      .pipe(first())
          .subscribe(
            data => {
              console.log('Account profile data in component is : '+ JSON.stringify(data));
              if(data) {
                this.userInfo = data[0];
               
				
				
				
         this.personalDetailsForm.patchValue({
          title:  this.userInfo.Title,
          firstName: this.userInfo.First_Name,
          middelName: this.userInfo.Middle_Name,
          lastName: this.userInfo.Last_Name,
          dateOfBirth: this.userInfo.DOB,
          gender: this.userInfo.Gender
})
         



         
         
         
        
              }
            },
            error => {
              console.log('Error when fetching the account profile data in component: '+JSON.stringify(error));
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
      dateOfBirth: ['', [Validators.required,this.validatorService.ageEligibility]]
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
      primaryEmailAddress: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      primaryCountryCode: [{value: '044', disabled: true},[Validators.required,Validators.pattern('[0-9]+'), Validators.maxLength(5)]],
      primaryPhoneNumber: [{value: '', disabled: true}, [Validators.required, Validators.pattern('^(0-)*[0-9]{10}')]],
      secondaryEmailAddress: ['', [Validators.email]],
      secondaryCountryCode: [{value: '044', disabled: true},[Validators.required,Validators.pattern('[0-9]+'), Validators.maxLength(5)]],
      secondaryPhoneNumber: ['', [Validators.pattern('^(0-)*[0-9]{10}')]],
    });
    this.contactDetailsForm.disable();
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
          this.personalDetailsForm.controls.firstName.enable();
          this.personalDetailsForm.controls.lastName.enable();
          this.personalDetailsForm.controls.dateOfBirth.enable();
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
          this.contactDetailsForm.controls.primaryEmailAddress.disable();
          this.contactDetailsForm.controls.primaryCountryCode.disable();
          this.contactDetailsForm.controls.primaryPhoneNumber.disable();
          this.contactDetailsForm.controls.secondaryCountryCode.disable();
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

      default:
        break;
    }
    this.hideFormStatusMsg();
    this.toggleEditState(form);
  }


  //Created by Vaibhav
  
  load_form(){
  console.log(this.userInfo.personalDetail.firstName);
   }
  








  //Save the changes made to the forms
  onSubmit = (form: string) => {
    let payload = null;
    switch (form) {
      case 'personalDetailsForm':
        payload = this.personalDetailsForm.value;
        break;
      case 'addressDetailsForm':
        payload = this.addressDetailsForm.value;
        break;
      case 'contactDetailsForm':
        payload = this.contactDetailsForm.value;
        break;
      default:
        break;
    }

    this.usersService.saveUserInfo(form, payload)
        .pipe(first())
        .subscribe(
          data => {
            console.log('Response received from service when saving user data : '+ JSON.stringify(data));
            this.hideFormStatusMsg();
            this.alertService.success(data);
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
              default:
                break;
            }
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
  }


}
