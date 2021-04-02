import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/core/services/users.service';
import { first } from 'rxjs/operators';
import { from } from 'rxjs';
@Component({
  selector: 'app-accountsettings',
  templateUrl: './accountsettings.component.html',
  styleUrls: ['./accountsettings.component.css']
})


export class AccountsettingsComponent implements OnInit {




	
constructor(private usersService: UsersService) { }

  ngOnInit() {
	
    this.fetchUserInfo();
	
  }

 //Fetch the details of the logged-in user
    fetchUserInfo = () => {
      this.usersService.fetchUserInfo()
	  .subscribe(
            data => { 
              console.log('Account profile data in component is : '+ JSON.stringify(data));
				
			  
			  
			  
			  
			  
				
			 }
			
			  
			,
            error => {
              console.log('Error when fetching the account profile data in component: '+JSON.stringify(error));
            }
          );
    }
}
