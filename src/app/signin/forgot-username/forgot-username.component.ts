import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticateService } from 'src/app/core/services/authenticate.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { first } from 'rxjs/operators';
import { ValidatorService } from '../../core/validators/validator.service';

@Component({
  selector: 'forgot-username',
  templateUrl: './forgot-username.component.html',
  styleUrls: ['./forgot-username.component.css']
})
export class ForgotUsernameComponent implements OnInit {

  funameForm: FormGroup;
  loading = false;
  submitted = false;
  maxDate:Date = null;
  minDate:Date=null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticateService,
    private alertService: AlertService,
    private validatorService: ValidatorService
  ) { }

  ngOnInit() {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear()-18);
    this.maxDate.setMonth(this.maxDate.getMonth());
    this.maxDate.setDate(this.maxDate.getDate());
    //Min Date Initialization
    this.minDate = new Date();
    this.minDate.setFullYear(this.minDate.getFullYear()-100);
    this.minDate.setMonth(this.minDate.getMonth());
    this.minDate.setDate(this.minDate.getDate()+1);

    this.funameForm = this.formBuilder.group({
      dateOfBirth: ["", [Validators.required]],
      lastName: ["", [Validators.required, Validators.pattern('^([A-Za-z\'-.À-ÿ]+ )+[A-Za-z\'-.À-ÿ]+$|^[A-Za-z\'-.À-ÿ][^!"#%&()*,:;<=>?@[\\]^_{|}~]+$'),this.validatorService.nameValidation,Validators.maxLength(50)]],
      motherMaidenName: ["", [Validators.required,Validators.pattern('^([A-Za-z\'-.À-ÿ]+ )+[A-Za-z\'-.À-ÿ]+$|^[A-Za-z\'-.À-ÿ][^!"#%&()*,:;<=>?@[\\]^_{|}~]+$'),this.validatorService.nameValidation,Validators.maxLength(20),Validators.minLength(3)]]
    });
  }

  get f() {
    return this.funameForm.controls
  }

  onSubmit() {
    console.log("Reset username form submitted");

    this.submitted = true;

    // stop here if form is invalid
    if (this.funameForm.invalid) {
        return;
    }

    this.loading = true;
     //manipulate the date field to handle timezone offset happening from date-picker
     const formDoB = new Date(this.funameForm.get('dateOfBirth').value);
     const utcDoB = Date.UTC(formDoB.getFullYear(), formDoB.getMonth(), formDoB.getDate());
     this.funameForm.value.dateOfBirth = new Date(utcDoB);
    console.log("Submitted form" +JSON.stringify(this.funameForm.value));

    this.authenticationService.getUname(this.funameForm.value)
        .pipe(first())
        .subscribe(
            data => {
                console.log('Data received from authentication service on recovering username: '+JSON.stringify(data));
                // this.router.navigate(['/']);
                this.alertService.success(data);
                this.loading = false;
            },
            error => {
                this.alertService.error(error.error);
                this.loading = false;
            });
  }

}
