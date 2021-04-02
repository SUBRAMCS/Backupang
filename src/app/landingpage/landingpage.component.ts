import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/core/services/users.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent implements OnInit {

  rou:string;
  active_class1:string;
  active_class2:string;
  active_class3:string;
  active_class4:string;
  active_class5:string;
  showLandingPage: boolean;
  tabSelected:string;

  constructor(private router: Router, private usersService: UsersService) { }

  ngOnInit() {
  this.fetchUserInfo();
  this.reset();
  this.showLandingPage = true;
    

  }

  fetchUserInfo = () => {
    this.usersService.fetchUserInfo_Acct_temp()
      .pipe(first())
      .subscribe(
      (data: any) => {
        
      },
      (error: any) => {
        this.router.navigate(['/']);
      });
}

  reset=()=>{
    this.active_class1="nav-link";
    this.active_class2="nav-link";
    this.active_class3="nav-link";
    this.active_class4="nav-link";
    this.active_class5="nav-link";
	this.showLandingPage = true;
	this.tabSelected="settings";
	
  }

  showSection(param:string){
    this.reset();
	this.tabSelected=param;
    switch(param){
      case 'settings':
        this.showLandingPage = false;
        this.active_class1="nav-link active";
		 this.router.navigate(['/home']);
		// this.ngOnInit();
          break;
      case 'family':
	    this.showLandingPage = false;
        this.active_class2="nav-link active";
		 this.router.navigate(['/home/family']);
          break;
      case 'nominee':
	   this.showLandingPage = false;
          this.active_class3="nav-link active";
          this.router.navigate(['/home/nominee']);
          break;
	   case 'items':
	    this.showLandingPage = false;
          this.active_class4="nav-link active";
          this.router.navigate(['/home/items']);
          break;
        case 'subitems':
	    this.showLandingPage = false;
          this.active_class4="nav-link active";
          this.router.navigate(['/home/subitems']);
          break;	 

    }
  }



}
