import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { userData } from '../../../services/userData.service';
import { DomSanitizer } from '@angular/platform-browser';
import { officerPageList,memberPageList,noMemberPageList } from '../pages.list';
import { MongoService } from '../../../services/mongo.service';
import { WarcraftLogsService } from '../../../services/warcraftLogsApi.service';
import {Router} from '@angular/router';
import { zoneId } from '../../../../constants/config';
import { wowApiService } from '../../../services/wowApi.services';
import { utils } from '../../../services/functions';

@Component({
  selector: 'app-boss-roster-admin',
  templateUrl: './boss-roster-admin.component.html',
  styleUrls: ['./boss-roster-admin.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BossRosterAdminComponent implements OnInit {

  userLevelBool = true;
  bosses = [];
  loaded = false;
  htmlOut = "";

  constructor(private mongoService:MongoService, public sanitizer: DomSanitizer, public _userData:userData,private router: Router, private wlogs:WarcraftLogsService, private wowApi:wowApiService, private _utils:utils) { }

  ngOnInit() {
    this._userData.userLevel.subscribe(UL=>{
        const componentRoute = "bossRosterAdmin";
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

    this.wlogs.getBosses()
      .subscribe(bosses =>  {
        this.htmlOut = ""
        bosses.forEach(boss => {
          if(zoneId == boss.id) {
            this.bosses = boss["encounters"];
          }
        });
        this.bosses.forEach(boss => {
          let bossIcon = "";
          bossIcon = this._utils.getBossesIcons(boss.name);
          this.htmlOut = this.htmlOut+'<div class="guideComponentContainerBossRosterAdmin"><div class="guideComponentBossRosterAdmin" onclick="window.location=\'/#/specificBossRosterAdmin?boss='+boss.id+'\';"><img class="guideComponentImageBossRosterAdmin" src="'+bossIcon+'" width="30px" height="30px"><div class="guideComponentTitleBossRosterAdmin">'+boss.name+'</div></div></div>';
        });
        this.loaded = true;
      }
    )
  }
}
