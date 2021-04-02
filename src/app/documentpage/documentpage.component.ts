import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-documentpage',
  templateUrl: './documentpage.component.html',
  styleUrls: ['./documentpage.component.css']
})
export class DocumentpageComponent implements OnInit {

constructor(private router: Router) { }

  ngOnInit() {
  }

  showSection(param:string){
    switch(param){
      case 'settings':
          this.router.navigate(['/user']);
          break;
      case 'family':
          this.router.navigate(['/user/family']);
          break;
      case 'nominee':
          this.router.navigate(['/user/nominee']);
          break;
      default:
          this.router.navigate(['/user']);
          break;

    }
  }

  showSettings(){
    this.router.navigate(['/user']);
  }
  showFamily(){
    this.router.navigate(['/user/family']);
  }



}
