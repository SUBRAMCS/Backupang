import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../core/services/registration.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  showPwdHints: boolean;

  constructor(
    private registartionService: RegistrationService
  ) { 
    this.registartionService.showPwdHints$.subscribe(
      data => {
        this.showPwdHints = data;
      }
    )
  }

  ngOnInit() {
  }

}
