import { Component, OnInit,Input } from '@angular/core';
import {CookieService} from 'angular2-cookie/core';
import {Router,NavigationEnd} from '@angular/router';
import { userData } from '../../services/userData.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  loginInfo = 1;
  loginKeyInput = false;
  loginKeyInputValue="";
  
  constructor(private _cookieService:CookieService,private router: Router, public _userData:userData) {
  }

  ngOnInit() {
    this._userData.userLevel.subscribe(userLevel=>{
        this.loginInfo=userLevel
      }
    )
  }

  getCookie(key){
    return this._cookieService.get(key);
  }

  submitKey() {
    this.loginKeyInput = false;
    if(this.loginKeyInputValue == "WW9Tb1lFbEdtRGVVblRhTWVEckVjSGVUb0FsUmVUb1EhMSE=")  {//OFFICER ROLE
      this.loginInfo = 3;
      this._cookieService.put('bG9nZ2luZyBpbiBzdGF0dXM', 'Z3VpbGRtYXN0ZXJhbHRvcXVl');
    } else if(this.loginKeyInputValue == "Tm9Tb1lUYU5wRW9MYUNvTW9FbEdtUGVSb0lnVWFMZVN0T3lFblVuVGFNZURSZVR1UlJvIXJrZXFvag==")  {//MEMBER ROLE
      this.loginInfo = 2;
      this._cookieService.put('bG9nZ2luZyBpbiBzdGF0dXM', 'Z3VpbGRtZW1iZXJyZXR1cnJv');
    } else  {
      this.loginInfo = 1;
      this._cookieService.put('bG9nZ2luZyBpbiBzdGF0dXM', 'bm9lc2RlbGd1aWxkZWxnYXRvZXN0ZQ==');
    }
    this.loginKeyInputValue="";
    this._userData.setValue(this.loginInfo);
  }

  onChangeLoginInput($event) {
    this.loginKeyInputValue = $event.target.value;
  }

  logoutRole()  {
    this._cookieService.put('bG9nZ2luZyBpbiBzdGF0dXM', 'bm9lc2RlbGd1aWxkZWxnYXRvZXN0ZQ==');
    this.loginInfo = 1;
    this._userData.setValue(this.loginInfo);
  }

  refresh(){
    window.location.reload();
  }
  
}
