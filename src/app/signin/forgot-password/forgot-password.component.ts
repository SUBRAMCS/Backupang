import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticateService } from 'src/app/core/services/authenticate.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  fpwdForm: FormGroup;
  loading = false;
  submitted = false;
  showErrFlg=true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticateService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.fpwdForm = this.formBuilder.group({
      email: ["", [Validators.required,Validators.email,Validators.pattern('.+.com'), Validators.maxLength(75)]]
    });
  }

  get f() {
    return this.fpwdForm.controls;
  }

  hideErrMsg(){
    this.showErrFlg=false;
  }

  onSubmit() {
    console.log("Forgot password form submitted");

    this.submitted = true;
    this.showErrFlg=true;
    
    // stop here if form is invalid
    if (this.fpwdForm.invalid) {
        return;
    }

    this.loading = true;

    this.authenticationService.resetPwd(this.f.email.value)
        .pipe(first())
        .subscribe(
            data => {
                console.log('Data received from authentication service on reset password: '+JSON.stringify(data));
                this.alertService.success('Password reset mail sent on registered mail id', true);
                this.router.navigate(['/pwdResetMail']);
            },
            error => {
                this.alertService.error(error.error);
                this.loading = false;
            });
    
  }

}
