import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { officerPageList,memberPageList,noMemberPageList } from '../pages/pages.list';
import { DomSanitizer } from '@angular/platform-browser';
import {Router} from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
import { userData } from '../../services/userData.service';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LeftPanelComponent implements OnInit {
  htmlOut="";
  pageList;
  
  constructor(public sanitizer: DomSanitizer,private router: Router,private _cookieService:CookieService, public _userData:userData) {}

  ngOnInit() {
    this._userData.userLevel.subscribe(userLevel=>{
        this.htmlOut = ""
        if(userLevel==3)  {//guildmasteraltoque
          this.pageList = officerPageList;
        } else if(userLevel==2)  {//guildmemberreturro
          this.pageList = memberPageList;
        } else {//noesdelguildelgatoeste
          this.pageList = noMemberPageList;
        }
        this.pageList.forEach(element => {
          if("/"+element.route != this.router.url){
            this.htmlOut = this.htmlOut + '<div class="menuPanelComponent" onmousedown="window.location=\'/#/'+element.route+'\';"><div class="componentPanelTitle">'+element.title+'</div><div class="componentPanelDescription">'+element.description+'</div></div>'
          }
        });
        this.router.events.subscribe((val) => {
          this.htmlOut = "";
          this.pageList.forEach(element => {
            if("/"+element.route != this.router.url){
              this.htmlOut = this.htmlOut + '<div class="menuPanelComponent" onmousedown="window.location=\'/#/'+element.route+'\';"><div class="componentPanelTitle">'+element.title+'</div><div class="componentPanelDescription">'+element.description+'</div></div>'
            }
          });
        });
      }
    )
  }

  getCookie(key){
    return this._cookieService.get(key);
  }

}
