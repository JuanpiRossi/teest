import { Component, OnInit } from '@angular/core';
import {CookieService} from 'angular2-cookie/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  loginInfo;
  loginKeyInput = false;
  loginKeyInputValue="";
  constructor(private _cookieService:CookieService) {
    if(this.getCookie('bG9nZ2luZyBpbiBzdGF0dXM')=='Z3VpbGRtYXN0ZXJhbHRvcXVl')  {//guildmasteraltoque
      this.loginInfo = 3;
    } else if(this.getCookie('bG9nZ2luZyBpbiBzdGF0dXM')=='Z3VpbGRtZW1iZXJyZXR1cnJv')  {//guildmemberreturro
      this.loginInfo = 2;
    } else if(this.getCookie('bG9nZ2luZyBpbiBzdGF0dXM')=='bm9lc2RlbGd1aWxkZWxnYXRvZXN0ZQ==')  {//noesdelguildelgatoeste
      this.loginInfo = 1;
    } else  {
      this._cookieService.put('bG9nZ2luZyBpbiBzdGF0dXM', 'bm9lc2RlbGd1aWxkZWxnYXRvZXN0ZQ==');
      this.loginInfo = 1;
    }
  }

  ngOnInit() {}

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
    } else  {//OFFICER ROLE
    this.loginInfo = 1;
    this._cookieService.put('bG9nZ2luZyBpbiBzdGF0dXM', 'bm9lc2RlbGd1aWxkZWxnYXRvZXN0ZQ==');
  }
  }

  onChangeLoginInput($event) {
    this.loginKeyInputValue = $event.target.value;
  }
}
