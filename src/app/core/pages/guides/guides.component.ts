import { Component, OnInit } from '@angular/core';
import { userData } from '../../../services/userData.service';
import {Router} from '@angular/router';
import { officerPageList,memberPageList,noMemberPageList } from '../pages.list';

@Component({
  selector: 'app-guides',
  templateUrl: './guides.component.html',
  styleUrls: ['./guides.component.scss']
})
export class GuidesComponent implements OnInit {
  userLevelBool;
  constructor(public _userData:userData,private router: Router) { }

  ngOnInit() {
    this._userData.userLevel.subscribe(UL=>{
      const componentRoute = "guides";
      this.userLevelBool=false;
      if(UL==3) {
        officerPageList.forEach(element => {
          if(element.route==componentRoute) {
            this.userLevelBool=true;
          }
        });
      } else if(UL==2)  {
        memberPageList.forEach(element => {
          if(element.route==componentRoute) {
            this.userLevelBool=true;
          }
        });
      } else {
        noMemberPageList.forEach(element => {
          if(element.route==componentRoute) {
            this.userLevelBool=true;
          }
        });
      }
      if(!this.userLevelBool)  {
        this.router.navigate(["/unauthorized"]);
      }
    }
  )


  }

}
