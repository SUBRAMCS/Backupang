import { Component, OnInit } from "@angular/core";
import { Router, NavigationStart, NavigationEnd } from "@angular/router";
import { AuthenticateService } from "../core/services/authenticate.service";
import { ConstantsService } from '../core/services/constants.service';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  showLogin: boolean = false;
  showRegistration: boolean = false;
  constructor(
    private router: Router,
    private authenticationService: AuthenticateService,
    private constantsService: ConstantsService
  ) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart || event instanceof NavigationEnd) {
        this.handleSessionControls(event);
      }
    });
    
  }
  
  handleSessionControls = (event: NavigationStart | NavigationEnd) => {
    //#1: OTP or Forgot uname or Forgot pwd screen
    if(event.url.match('^[\/]?(signin)?(\/otp)?(\/funame)?(\/fpwd)?(\/validateUser(.)*)?(\/regnSuccess)?(\/pwdResetMail)?$')){
      this.showRegistration = true;
      this.showLogin = true;
    }
    
    //#2: Registration screen
    if(event.url.match('^(\/signin\/signup){1}$')){
      this.showRegistration = false;
      this.showLogin = true;
    }
  
    //#3: Other than the above two scenarios
    if(!event.url.match('^[\/]?(signin)?(\/signup)?(\/otp)?(\/funame)?(\/fpwd)?(\/validateUser(.)*)?(\/regnSuccess)?(\/pwdResetMail)?$')){
      this.showLogin = false;
      this.showRegistration = false;
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
}
