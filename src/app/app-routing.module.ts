import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './signin/login/login.component';
import { AuthGuard } from './core/interceptors/auth.guard';
import { OtpComponent } from './signin/otp/otp.component';
import { HomepageComponent } from './homepage/homepage.component';
import { SignupComponent } from './signin/signup/signup.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { UnderconstructionComponent } from './underconstruction/underconstruction.component';
import { ForgotPasswordComponent } from './signin/forgot-password/forgot-password.component';
import { ForgotUsernameComponent } from './signin/forgot-username/forgot-username.component';
import { ResetPasswordComponent } from './signin/reset-password/reset-password.component';
import { EmailConfirmComponent } from './signin/email-confirm/email-confirm.component';
import { MailpageComponent } from './signin/mailpage/mailpage.component';
import { SigninComponent } from './signin/signin.component';
import { SettingsComponent } from './landingpage/settings/settings.component';
import { AboutusComponent } from './aboutus/aboutus.component';
//import { ContactusComponent } from './contactus/contactus.component';
import { MyfamilyComponent } from './landingpage/myfamily/myfamily.component';
import { MynomineeComponent } from './landingpage/mynominee/mynominee.component';
import { DocumentpageComponent } from "./documentpage/documentpage.component";
import { AcctsettingComponent } from "./documentpage/acctsetting/acctsetting.component";
import { AcctmyfamilyComponent } from "./documentpage/acctmyfamily/acctmyfamily.component";
import { AcctNominationComponent } from "./documentpage/acct-nomination/acct-nomination.component";
import { ItemsComponent } from './landingpage/items/items.component';
import { SubItemsComponent } from './landingpage/subitems/subitems.component';



const routes: Routes = [
  { path: '', component: HomepageComponent},
  { path: 'aboutus', component: AboutusComponent},
 // {path: 'contactus', component: ContactusComponent},
  { path: 'signin', component: SigninComponent,
    children: [
      { path: '', component: LoginComponent},
      { path: 'otp', component: OtpComponent},
      { path: 'fpwd', component: ForgotPasswordComponent},
      { path: "funame", component: ForgotUsernameComponent },
      { path: "signup", component: SignupComponent },
      { path: "validateUser", component: EmailConfirmComponent },
      { path: "regnSuccess", component: MailpageComponent },
      { path: "resetpwd", component: ResetPasswordComponent},
      { path: "pwdResetMail", component: EmailConfirmComponent}
    ]
  },
  { path: "regnSuccess", redirectTo: "signin/regnSuccess" },
  { path: "validateUser", redirectTo: "signin/validateUser"},
  { path: "resetpwd", redirectTo: "signin/resetpwd" },
  { path: "pwdResetMail", redirectTo: "signin/pwdResetMail" },
  { path: "home", component: LandingpageComponent, 
    children: [
      {path: '', component: SettingsComponent},
      {path: "family", component: MyfamilyComponent},
      {path: "nominee", component: MynomineeComponent},
	  {path: "items", component: ItemsComponent},
	  {path: "subitems", component: SubItemsComponent}
    ]
  },
 { path: "user", component: DocumentpageComponent,
   children: [
		{path: '', component: AcctsettingComponent},
		{path: 'family', component: AcctmyfamilyComponent},
        {path: 'nominee', component: AcctNominationComponent}
        
   
   ]
 
 },
 { path: "under_construction", component: UnderconstructionComponent, canActivate: [AuthGuard] },

  //default
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }