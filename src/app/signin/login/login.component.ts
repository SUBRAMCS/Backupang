import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticateService } from 'src/app/core/services/authenticate.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { first } from 'rxjs/operators';
import { ConstantsService } from 'src/app/core/services/constants.service';
declare var grecaptcha: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  captchaError: boolean = false;
  showErrFlg=true;

  @ViewChild('recaptcha', {static: true }) recaptchaElement: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticateService,
    private alertService: AlertService,
    private constantsService: ConstantsService
  ) {
    
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required, Validators.email,Validators.pattern('.+.com'), Validators.maxLength(75)]],
      password: ["", Validators.required]
    });

    this.addRecaptchaScript();
  }

  hideErrMsg(){
    this.showErrFlg=false;
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  renderReCaptch() {
    window['grecaptcha'].render(this.recaptchaElement.nativeElement, {
      'sitekey' : this.constantsService.getReCaptchaKey(),
      'callback': (response) => {
          console.log('Captcha key received: '+(response != null));
      }
    });
  }
 
  addRecaptchaScript() {
 
    window['grecaptchaCallback'] = () => {
      this.renderReCaptch();
    }
 
    (function(d, s, id, obj){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { obj.renderReCaptch(); return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&amp&render=explicit";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'recaptcha-jssdk', this));
 
  }
 
  onSubmit() {
    console.log("Login form submitted");

    this.submitted = true;
    this.showErrFlg=true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }
    const response = grecaptcha.getResponse();
  
      /*if (response.length === 0) {
       this.captchaError = true;
       return;
     } */


    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value, response)
        .pipe(first())
        .subscribe(
            data => {
                console.log('Data received from authentication service on login: '+JSON.stringify(data));
                this.router.navigate(['/signin/otp']);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });

  }
}
