import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../../core/services/authenticate.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-email-confirm',
  templateUrl: './email-confirm.component.html',
  styleUrls: ['./email-confirm.component.css']
})
export class EmailConfirmComponent implements OnInit {

  message: string;

  constructor(
    private authenticateService: AuthenticateService,
    private router: Router,
    private alertService: AlertService
  ) {  }

  ngOnInit() {

    /**
     * This method is for intercepting any URLs coming
     * shared wiht users via mail:
     * CASE: User registration confirmation URL 
     * example: http://localhost:4599/validateUser?token=dd67c90c-c9e5-4301-8c76-0397cb6b9dff
     */

    const url = this.router.url;
    console.log("Application URL accessed: "+url);
    if(url.indexOf('validateUser') != -1 && url.indexOf("token") != -1){
      const token = url.substring(url.indexOf("?")).split('=')[1];
      this.authenticateService.validateToken(token)
      .subscribe(
        data => {
        console.log("Response recieved from authenticatino service after token validation : "+data);
        this.alertService.success(data);
      },
      error => {
        console.log('Error during token validation: '+JSON.stringify(error));
        this.alertService.error(error.error);
        ;
      });
    }

    
  }

}
