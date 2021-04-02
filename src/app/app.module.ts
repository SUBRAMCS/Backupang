import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";


import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { SigninComponent } from "./signin/signin.component";
import { LoginComponent } from "./signin/login/login.component";
import { OtpComponent } from "./signin/otp/otp.component";
import { SignupComponent } from "./signin/signup/signup.component";
import { UnderconstructionComponent } from "./underconstruction/underconstruction.component";
import { DocumentpageComponent } from "./documentpage/documentpage.component";
import { Routes, RouterModule } from "@angular/router";
import { LandingpageComponent } from "./landingpage/landingpage.component";
import { AccountsettingsComponent } from "./accountsettings/accountsettings.component";
import { ConstantsService } from "./core/services/constants.service";
import { JwtInterceptor } from "./core/interceptors/jwt-interceptor.service";
// import { fakeBackendProvider } from './core/interceptors/fake-backend.service';
import { MailpageComponent } from "./signin/mailpage/mailpage.component";
import { EmailConfirmComponent } from "./signin/email-confirm/email-confirm.component";
import { AlertComponent } from "./shared/alert/alert.component";
import { ForgotUsernameComponent } from "./signin/forgot-username/forgot-username.component";
import { ForgotPasswordComponent } from "./signin/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./signin/reset-password/reset-password.component";
import { AngularMatModule } from "./angular-mat.module";
import { SettingsComponent } from './landingpage/settings/settings.component';
import { AboutusComponent } from './aboutus/aboutus.component';
//import { ContactusComponent } from './contactus/contactus.component';
import { MyfamilyComponent } from './landingpage/myfamily/myfamily.component';
import { MynomineeComponent } from './landingpage/mynominee/mynominee.component';
import { AcctsettingComponent } from "./documentpage/acctsetting/acctsetting.component";
import { AcctmyfamilyComponent } from "./documentpage/acctmyfamily/acctmyfamily.component";
import { AcctNominationComponent } from "./documentpage/acct-nomination/acct-nomination.component";
import { ItemsComponent } from './landingpage/items/items.component';
import { SubItemsComponent } from './landingpage/subitems/subitems.component';
import { FileUploadModule } from 'ng2-file-upload';
import { MatConfirmDialogComponent } from './mat-confirm-dialog/mat-confirm-dialog.component';
import {MatDialogModule} from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {Ng2TelInputModule} from 'ng2-tel-input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatInputModule} from '@angular/material'; 

import { NumberDirective } from './numbers-only.directive';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';

export const DateFormats = {
  parse: {
      dateInput: ['YYYY-MM-DD']
  },
  display: {
      dateInput: 'YYYY-MM-DD',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
  },
};
const appRoutes: Routes = [
  { path: "", component: HomepageComponent },
  { path: "login", component: LoginComponent },
  { path: "otp", component: OtpComponent },
  { path: "signup", component: SignupComponent },
  { path: "home", component: LandingpageComponent },
  { path: "user", component: DocumentpageComponent },
  { path: "mailpage", component: MailpageComponent },
  { path: "email-confirm", component: EmailConfirmComponent },
  { path: "under_construction", component: UnderconstructionComponent },
  {path: "items", component: ItemsComponent},
  {path: "subitems", component: SubItemsComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomepageComponent,
    SigninComponent,
    LoginComponent,
    OtpComponent,
    SignupComponent,
    UnderconstructionComponent,
    DocumentpageComponent,
    LandingpageComponent,
    AccountsettingsComponent,
    MailpageComponent,
    EmailConfirmComponent,
    AlertComponent,
    ForgotUsernameComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SettingsComponent,
    AboutusComponent,
	//ContactusComponent,
    MyfamilyComponent,
    MynomineeComponent,
	AcctsettingComponent,
	AcctmyfamilyComponent,
	AcctNominationComponent,	
	ItemsComponent,
	SubItemsComponent,
	MatConfirmDialogComponent,
	NumberDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AngularMatModule,
    MatDialogModule,
    FileUploadModule ,
    Ng2TelInputModule ,
    NgbModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatInputModule
    ],
    
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DateFormats }//,fakeBackendProvider
  ],
 
  
  bootstrap: [AppComponent],
  entryComponents: [MatConfirmDialogComponent]
})
export class AppModule {}
