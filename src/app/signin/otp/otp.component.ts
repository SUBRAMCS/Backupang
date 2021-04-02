import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticateService } from 'src/app/core/services/authenticate.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {

  otpForm: FormGroup;
  otp : string;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticateService,
    private alertService: AlertService
  ) {
    
  }

  ngOnInit() {
    this.otpForm = this.formBuilder.group({
      otp: ["", [Validators.required, Validators.pattern('\\d{6}')]]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.otpForm.controls;
  }

  resendOTP = () => {
    this.authenticationService.resendOTP()
        .pipe(first())
        .subscribe(
          data => {
            console.log('Response received from service on OTP resend: '+data);
            this.alertService.success("An email has been sent to your registered mail id containing OTP for login");
          }, 
          error => {
            console.log('Something went wrong : '+JSON.stringify(error));
            this.alertService.error(error.error);
          }
        )
  }

  onSubmit() {
    console.log("OTP form submitted");

    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.otpForm.invalid) {
        return;
    }

    this.loading = true;
    
    this.authenticationService.validateOTP(this.f.otp.value)
        .pipe(first())
        .subscribe(
            data => {
                console.log('Data received from authentication service on otp validation: '+JSON.stringify(data));
                this.router.navigate(['/home']);
            },
            error => {
              const {message} = error.error;
                this.alertService.error(message);
                this.loading = false;
            });

  }

}
