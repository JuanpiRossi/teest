import { Component, OnInit } from '@angular/core';
import { userData } from '../../../services/userData.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent implements OnInit {

  constructor(public _userData:userData,private router: Router) { }
  userLevel;
  ngOnInit() {
    this._userData.userLevel.subscribe(UL=>{
        if(this.userLevel==undefined) {
          this.userLevel = UL;
        } else  {
          if(this.userLevel!=UL)  {
            this.router.navigate(["/home"]);
          }
        }
      }
    )
  }

}
