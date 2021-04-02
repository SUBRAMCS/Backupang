import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, first } from 'rxjs/operators';
import { User } from '../../core/models/user';
import { FormGroup, FormBuilder, Validators,AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../core/services/alert.service';
import { RegistrationService } from "../../core/services/registration.service";
import { ValidatorService } from '../../core/validators/validator.service';
import { CrossFieldMatcher } from '../../core/validators/cross-field-matcher';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})



export class SignupComponent implements OnInit {
  
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  password: string;
  dateOfBirth: string;
  question:string;
  questionAnswer:string;
  registrationForm: FormGroup;
  gender: string;
  loading = false;
  submitted = false;
  errorMatcher: CrossFieldMatcher;
  showPwd: boolean = false;
  showCPwd: boolean = false;
  emailLs=null;
  maxDate:Date = null;
  minDate:Date=null;

  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private registrataionService: RegistrationService,
    private validatorService: ValidatorService
  ) { 
    this.errorMatcher = new CrossFieldMatcher();
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
    

    this.registrataionService.fetchEmailIds()
    .subscribe(
      data => {
        this.emailLs=data;
         //console.log('Response received from service for all emails: '+JSON.stringify(data));
        //if(data['result']) {
          //this.togglePCAddressForm();
         // this.allEmailIds = data['result'];          
        //}
      },
      error => {
         console.log('Something went wrong while fetching the list of emails: '+JSON.stringify(error));
        // this.addressList = [{'postcode': 'PO9 1NG','post_town': 'HAVANT','line_1': '1 Cross Way','line_2': '','line_3': '','county': 'Hampshire','postal_county': 'Hampshire'},{'postcode': 'PO9 1NG','post_town': 'HAVANT','line_1': '2 Cross Way','line_2': '','line_3': '','county': 'Hampshire','postal_county': 'Hampshire'},{'postcode': 'PO9 1NG','post_town': 'HAVANT','line_1': '3 Cross Way','line_2': '','line_3': '','county': 'Hampshire','postal_county': 'Hampshire'}];
      });
    this.registrationForm = this.formBuilder.group({
      firstName: ["", [Validators.required, Validators.pattern('^([A-Za-z\'-.À-ÿ]+ )+[A-Za-z\'-.À-ÿ]+$|^[A-Za-z\'-.À-ÿ][^!"#%&()*,:;<=>?@[\\]^_{|}~]+$'),this.validatorService.nameValidation,Validators.maxLength(50)]],
      lastName: ["", [Validators.required, Validators.pattern('^([A-Za-z\'-.À-ÿ]+ )+[A-Za-z\'-.À-ÿ]+$|^[A-Za-z\'-.À-ÿ][^!"#%&()*,:;<=>?@[\\]^_{|}~]+$'),this.validatorService.nameValidation,Validators.maxLength(50)]],
      email: ["", [this.forbiddenEmailValidator.bind(this),Validators.required,Validators.email,Validators.pattern('.+.com'), Validators.maxLength(75)]],
      phoneNo: ["44-", [Validators.required]],
      password: ["", [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')]],
      cnfrmPassword: ["", Validators.required],
      dateOfBirth: ["", [Validators.required]],
      motherMaidenName: ["", [Validators.required,Validators.pattern('^([A-Za-z\'-.À-ÿ]+ )+[A-Za-z\'-.À-ÿ]+$|^[A-Za-z\'-.À-ÿ][^!"#%&()*,:;<=>?@[\\]^_{|}~]+$'),this.validatorService.nameValidation,Validators.maxLength(20),Validators.minLength(3)]],
      tnc: ["", Validators.required]
    },{
      validators: this.validatorService.matchValue
    });
  }

  /*forbiddenEmailValidator(emailLs:any){
    return (control:AbstractControl):{[key: string]: any} | null=>{
   // console.log(this.emailLs)
    const forbidden=emailLs.indexOf(control.value)>-1;
    return forbidden?{'forbiddenMail':{value:control.value}}:null;
  }
}*/

forbiddenEmailValidator(control:AbstractControl):{[key: string]: any} | null{
  let forbidden=false;
  if(null==this.emailLs || null==control.value || control.value.length===0)
  forbidden= false;
  else{
    for(let email in this.emailLs){
      if(this.emailLs[email].toUpperCase()===control.value.toUpperCase()){
      forbidden=true;
      break;
      }
    }
  }
  return forbidden?{'forbiddenMail':{value:control.value}}:null;
}

  // convenience getter for easy access to form fields
  get f() {
    return this.registrationForm.controls;
  }



  onSubmit() {
    console.log("Registration form submitted");
    
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.registrationForm.invalid) {
        return;
    }

    this.loading = true;

    //manipulate the date field to handle timezone offset happening from date-picker
    const formDoB = new Date(this.registrationForm.get('dateOfBirth').value);
    const utcDoB = Date.UTC(formDoB.getFullYear(), formDoB.getMonth(), formDoB.getDate());
    this.registrationForm.value.dateOfBirth = new Date(utcDoB).toISOString();

    //manipuate the phone number
    let phoneNo = this.registrationForm.get('phoneNo').value;
    if(phoneNo.indexOf('-') != -1){
      phoneNo = phoneNo.substring(phoneNo.indexOf('-')+1);
    }
    if(phoneNo.length == 10){
      this.registrationForm.patchValue({'phoneNo': phoneNo});
    }


    this.registrataionService.register(this.registrationForm.value)
        .pipe(first())
        .subscribe(
            data => {
                console.log('Data received from registration service : '+JSON.stringify(data));
                this.loading = false;
                // this.alertService.success('Registration successful. An email has been sent to your registered email-id.');
                this.router.navigate(['/regnSuccess']);
            },
            error => {
                this.alertService.error(error.error);
                this.loading = false;
            });

  }


  togglePwdHints = () => {
    this.registrataionService.togglePwdHints();
  }

  
}