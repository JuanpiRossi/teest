import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { officerPageList,memberPageList,noMemberPageList } from '../pages.list';
import { DomSanitizer } from '@angular/platform-browser';
import {CookieService} from 'angular2-cookie/core';
import { userData } from '../../../services/userData.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  htmlOut="";
  pageList;
  constructor(public sanitizer: DomSanitizer,private _cookieService:CookieService, public _userData:userData) {
  }

  ngOnInit() {
    this._userData.userLevel.subscribe(userLevel=>{
        this.htmlOut = "";
        if(userLevel == 3)  {
          this.pageList = officerPageList;
        } else if(userLevel == 2) {
          this.pageList = memberPageList;
        } else  {
          this.pageList = noMemberPageList;
        }
        this.pageList.forEach(element => {
          this.htmlOut = this.htmlOut+'<div class="menuComponentContainer"><div class="menuComponent" onclick="window.location=\'/#/'+element.route+'\';"><div class="componentTitle">'+element.title+'</div><div class="componentDescription">'+element.description+'</div></div></div>'
        });
      }
    )
  }

  getCookie(key){
    return this._cookieService.get(key);
  }

}
