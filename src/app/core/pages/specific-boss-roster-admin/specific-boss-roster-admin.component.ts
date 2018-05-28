import { Component, OnInit, Input } from '@angular/core';
import { userData } from '../../../services/userData.service';
import { officerPageList,memberPageList,noMemberPageList } from '../pages.list';
import { MongoService } from '../../../services/mongo.service';
import { WarcraftLogsService } from '../../../services/warcraftLogsApi.service';
import {Router} from '@angular/router';
import { wowApiService } from '../../../services/wowApi.services';
import { zoneId } from '../../../../constants/config';
import { NotificationsService } from 'angular2-notifications';
import { utils } from '../../../services/functions';
import { specList } from '../../../../constants/class.specs';

@Component({
  selector: 'app-specific-boss-roster-admin',
  templateUrl: './specific-boss-roster-admin.component.html',
  styleUrls: ['./specific-boss-roster-admin.component.scss']
})
export class SpecificBossRosterAdminComponent implements OnInit {

  userLevelBool = true;
  mongoData = {};
  @Input() mainRoster = [];
  @Input() benchRoster = [];
  options = {position: ["top", "right"]}
  loaded = false;
  editingRoster = {};
  editingTrials = {};
  specsRoster = []
  specsTrials = []
  
  dataModeRoster = this.mainRoster;
  renderTable = true;

  constructor(private mongoService:MongoService, public _userData:userData,private router: Router, private wlogs:WarcraftLogsService, private wowApi:wowApiService,private _service: NotificationsService, private _utils:utils) { }

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
    
    var queryStrings = this.router.url.split("?")[1].substr(5);
    this.mongoService.getBossRoster({'id':queryStrings})
      .subscribe(response =>  {
        if(response["data"]==null)  {
          this.wlogs.getBosses()
            .subscribe(bosses =>  {
              bosses.forEach(boss => {
                if(zoneId == boss["id"]) {
                  boss["encounters"].forEach(element => {
                    if(element.id==queryStrings)  {
                      this.mongoData["id"] = queryStrings;
                      this.mongoData["name"] = element.name;
                      this.mongoData["Roster"] = [];
                      this.mongoData["bossIcon"] = this._utils.getBossesIcons(element.name);
                      this.mongoService.saveBossRoster(this.mongoData)
                        .subscribe(responseSave =>  {
                          console.log(responseSave);
                        }
                      )
                    }
                  });
                }
              });
              this.generateTables()
            }
          )
        } else  {
          delete response["data"]["_id"];
          this.mongoData = response["data"];
          this.generateTables()
        }
      },error =>  {
        this._service.error("Servers are down");
      }
    )
  }

  generateTables()  {
    var tmpUniqueNames = [];
    var tmpPlayerExists = [];
    this.mainRoster = [];
    this.benchRoster = [];
    this.mainRoster = this.mongoData["Roster"];
    this.mainRoster.forEach(player => {
      tmpUniqueNames.push(player["name"]);
    });
    this.mainRoster = [...this.mainRoster];
    this.mongoService.getGuild({"guildName":"Untamed"})
      .subscribe(guildData => {
        var tmp = {name:"",rank:"",class:"",spec:"",role:""}
        guildData["data"]["Roster"].forEach(player => {
          if(!tmpUniqueNames.includes(player["name"]))  {
            tmp = {name:player["name"],rank:"Main raider",class:player["class"],spec:player["spec"],role:"assets/"+player["role"]+"Icon.png"};
            this.benchRoster.push(tmp);
          }
          tmpPlayerExists.push(player["name"]);
        });
        guildData["data"]["Trials"].forEach(player => {
          if(!tmpUniqueNames.includes(player["name"]))  {
            tmp = {name:player["name"],rank:"Trial",class:player["class"],spec:player["spec"],role:"assets/"+player["role"]+"Icon.png"};
            this.benchRoster.push(tmp);
          }
          tmpPlayerExists.push(player["name"]);
        });
        this.mainRoster.forEach(player => {
          if(!tmpPlayerExists.includes(player["name"])) {
            player["noExist"] = true;
          } else  {
            player["noExist"] = false;
          }
        });
        this.updateExtras();
        this.loaded = true;
      }
    )
  }

  getRowClass(row) {
    return  {
      'row-class-deathKnight': row.class === "Death Knight",
      'row-class-demonHunter': row.class === "Demon Hunter",
      'row-class-druid': row.class === "Druid",
      'row-class-hunter': row.class === "Hunter",
      'row-class-mage': row.class === "Mage",
      'row-class-monk': row.class === "Monk",
      'row-class-paladin': row.class === "Paladin",
      'row-class-priest': row.class === "Priest",
      'row-class-rogue': row.class === "Rogue",
      'row-class-shaman': row.class === "Shaman",
      'row-class-warlock': row.class === "Warlock",
      'row-class-warrior': row.class === "Warrior"
    }
  }

  benchPlayer(rowIndex) {
    let tmp;
    tmp = this.mainRoster.splice(rowIndex,1)[0];
    this.benchRoster.push(tmp);
    this.mongoData["Roster"] = this.mainRoster;
    this.updateExtras();
    this.editingRoster = {};
    this.editingTrials = {};
    this.mainRoster = [...this.mainRoster];
    this.benchRoster = [...this.benchRoster]
  }

  upgradePlayer(rowIndex) {
    let tmp;
    tmp = this.benchRoster.splice(rowIndex,1)[0];
    this.mainRoster.push(tmp);
    this.mongoData["Roster"] = this.mainRoster;
    this.updateExtras();
    this.editingRoster = {};
    this.editingTrials = {};
    this.mainRoster = [...this.mainRoster];
    this.benchRoster = [...this.benchRoster]
  }
  
  onDrop(event){
    let listData = event.split("\n");
    var newData = [];
    for(var i=0;i<(listData.length/5)-1;i++) {
      var saveData = {name: listData[i*5], server: listData[i*5+1], class: listData[i*5+2], spec: listData[i*5+3]};
      newData.push(saveData);
    }
    this.mongoData["Roster"] = newData;
  }

  updateValue(event, cell, rowIndex,dbDict){
    if(event.target.value != "")  {
      if(dbDict=="Roster")  {
        this.editingRoster[rowIndex + '-' + cell] = false;
        this.mainRoster[rowIndex][cell] = event.target.value;
        this.mainRoster = [...this.mainRoster];
        this.updateExtras();
        if(cell=="class") {
          this.mainRoster[rowIndex].spec = this.specsRoster[rowIndex][0].name;
        }
        this.mongoData["Roster"] = this.mainRoster
      }
      if(dbDict=="Trials")  {
        this.editingTrials[rowIndex + '-' + cell] = false;
        this.benchRoster[rowIndex][cell] = event.target.value;
        this.benchRoster = [...this.benchRoster];
        this.updateExtras();
        if(cell=="class") {
          this.benchRoster[rowIndex].spec = this.specsTrials[rowIndex][0].name;
        }
      }
    }    
  }

  updateExtras(){
    this.specsRoster = [];
    this.specsTrials = [];
    let i=0;
    this.mainRoster.forEach(element => {
      this.specsRoster.push(specList[element.class])
    });
    this.benchRoster.forEach(element => {
      this.specsTrials.push(specList[element.class])
    });
  }

  saveRoster($event)  {
    console.log(this.mongoData["id"])
    console.log(this.mongoData)
    this.mongoService.updateBossRoster({query:{"id":this.mongoData["id"]},update:this.mongoData})
      .subscribe(Response =>  {
        console.log(Response)
      },error =>  {
        this._service.error("Error saving, servers are down");
      }
    )
  }

  deletePlayer(rowIndex){
    this.mainRoster.splice(rowIndex,1)
    this.mongoData["Roster"] = this.mainRoster
    this.mainRoster = [...this.mainRoster];
  }
}