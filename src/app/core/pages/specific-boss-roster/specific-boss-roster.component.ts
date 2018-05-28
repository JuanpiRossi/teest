import { Component, OnInit } from '@angular/core';
import { userData } from '../../../services/userData.service';
import { officerPageList,memberPageList,noMemberPageList } from '../pages.list';
import { MongoService } from '../../../services/mongo.service';
import { WarcraftLogsService } from '../../../services/warcraftLogsApi.service';
import {Router} from '@angular/router';
import { wowApiService } from '../../../services/wowApi.services';

@Component({
  selector: 'app-specific-boss-roster',
  templateUrl: './specific-boss-roster.component.html',
  styleUrls: ['./specific-boss-roster.component.scss']
})
export class SpecificBossRosterComponent implements OnInit {

  userLevelBool = true;

  constructor(private mongoService:MongoService, public _userData:userData,private router: Router, private wlogs:WarcraftLogsService, private wowApi:wowApiService) { }

  ngOnInit() {
    this._userData.userLevel.subscribe(UL=>{
        const componentRoute = "bossRoster";
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
