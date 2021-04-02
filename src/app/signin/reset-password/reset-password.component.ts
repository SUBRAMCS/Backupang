import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, Validator } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticateService } from 'src/app/core/services/authenticate.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { first } from 'rxjs/operators';
import { ValidatorService } from 'src/app/core/validators/validator.service';
import { CrossFieldMatcher } from 'src/app/core/validators/cross-field-matcher';
import { RegistrationService } from 'src/app/core/services/registration.service';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  token: string;
  message: string;
  rpwdForm: FormGroup;
  loading = false;
  submitted = false;
  errorMatcher: CrossFieldMatcher;
  showPwd: boolean = false;
  showCPwd: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticateService,
    private alertService: AlertService,
    private registrataionService: RegistrationService,
    private validatorService: ValidatorService
  ) {
    this.errorMatcher = new CrossFieldMatcher();
   }

  ngOnInit() {
    this.rpwdForm = this.formBuilder.group({
      rpwd: ["", [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')]],
      cpwd: ["", Validators.required]
    },
    {validator: this.validatorService.matchValue});

    const url = this.router.url;
    this.token = url.substring(url.indexOf("?")).split('=')[1];

  }

  get f() {
    return this.rpwdForm.controls;
  }

  onSubmit() {
    console.log("Reset password form submitted");

    this.submitted = true;
    
    // stop here if form is invalid
    if (this.rpwdForm.invalid) {
        return;
    }

    this.loading = true;

    this.authenticationService.changePwd(this.f.rpwd.value, this.f.cpwd.value, this.token)
        .pipe(first())
        .subscribe(
            data => {
                console.log('Data received from authentication service on resetting password: '+JSON.stringify(data));
                this.router.navigate(['/']);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    
  }

  togglePwdHints = () => {
    this.registrataionService.togglePwdHints();
  }

  

}
