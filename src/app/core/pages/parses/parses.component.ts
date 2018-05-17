import { Component, OnInit, ViewChild,  Input } from '@angular/core';
import { MongoService } from '../../../services/mongo.service';
import { WarcraftLogsService } from '../../../services/warcraftLogsApi.service';
import { roleCheck } from '../../../../constants/specs.roles';
import { specList } from '../../../../constants/class.specs';
import { userData } from '../../../services/userData.service';
import { officerPageList,memberPageList,noMemberPageList } from '../pages.list';
import {Router} from '@angular/router';

@Component({
  selector: 'app-parses',
  templateUrl: './parses.component.html',
  styleUrls: ['./parses.component.scss']
})
export class ParsesComponent implements OnInit {

  @Input() rows = [];
  @Input() detailedRows = [];
  detailsHeight;
  editing = {};
  specs = []
  mongoData;
  expanded: any = {};
  timeout: any;
  bosses;
  zoneId = 17;
  loadedCounter = 0;
  totalToLoad=0;
  loadSpec = [];
  loaded = false;
  userLevelBool;

  @ViewChild('myTable') table: any;

  constructor(private mongoService:MongoService, private warcraftService:WarcraftLogsService, public _userData:userData,private router: Router) { }

  ngOnInit() {
    this._userData.userLevel.subscribe(UL=>{
      const componentRoute = "parses";
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

  if(this.userLevelBool)  {
    this.mongoService.getGuild({"guildName":"Untamed"})
      .subscribe(res => {
        var counter = 0;
        this.rows = []
        this.mongoData = res.json().data;
        delete this.mongoData._id
        res.json().data.Roster.forEach(element => {
          this.rows.push({name:element["name"],class:element["class"],spec:element["spec"],server:element["server"],normal:0,heroic:0,mythic:0,rowIndex:counter,role:'assets/'+element["role"]+'Icon.png'})
          counter++;
        });
        this.updateExtras();
        this.totalToLoad = this.rows.length;
        this.warcraftService.getBosses()
          .subscribe(response =>  {
            response.json().forEach(zone => {
              if(zone.id == this.zoneId) {
                this.bosses = zone.encounters;
              }
            });
        this.rows.forEach(element => {
          element.mythicParse = {};
          element.heroicParse = {};
          element.normalParse = {};
          if(element.role=="assets/healerIcon.png"){
            var serviceResponse = this.warcraftService.searchCharacterHeal(element.name,element.server);
          }
          else  {
            var serviceResponse = this.warcraftService.searchCharacterDps(element.name,element.server);
          }
          serviceResponse
            .subscribe(response =>  {
              response.json().forEach(report => {
                this.getBossesParses(element,report);
              })
              this.loadedCounter++;
              if(this.loadedCounter==this.totalToLoad){
                this.getOverallParses();
              }
            }
          )
        });
      })
    });
    }
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
    };
  }

  getCellClass({ row, column, value }): any {
    return {
      'grayParse': value < 25,
      'greenParse': value >= 25 && value < 50,
      'blueParse': value >= 50 && value < 75,
      'PurpleParse': value >= 75 && value < 95,
      'LegendaryParse': value >= 95 && value < 100,
      'topParse': value == 100,
      'bossName': true
    };
  }
  
  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      console.log('paged!', event);
    }, 100);
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
  }

  getDetail() {
    let tmp = [];
    this.detailedRows = [];
    this.rows.forEach(element => {
      tmp = [];
      this.bosses.forEach(boss => {
        tmp.push({boss:boss.name, normal:element.normalParse[boss.name] | 0, heroic:element.heroicParse[boss.name] | 0, mythic:element.mythicParse[boss.name] | 0});
      });
      this.detailedRows.push(tmp);
    });
    this.detailsHeight = 50 + this.bosses.length * 40;
  }

  getBossesParses(element,report) {
    if(report.difficulty == 5){//Mythic
      report.specs.forEach(specs => {
        if(specs.spec == element.spec)  {
          element.mythicParse[report.name] = parseInt(specs.best_historical_percent);
        }
      });
    } else if(report.difficulty == 4) {//Heroic
      report.specs.forEach(specs => {
        if(specs.spec == element.spec)  {
          element.heroicParse[report.name] = parseInt(specs.best_historical_percent);
        }
      });
    } else if(report.difficulty == 3) {//Normal
      report.specs.forEach(specs => {
        if(specs.spec == element.spec)  {
          element.normalParse[report.name] = parseInt(specs.best_historical_percent);
        }
      });
    }
  }

  getOverallParses(){
    this.rows.forEach(element => {
      element.mythic = 0;
      Object.keys(element.mythicParse).forEach(mythicBoss => {
        element.mythic = element.mythic + element.mythicParse[mythicBoss];
      });
      element.mythic = element.mythic / Object.keys(element.mythicParse).length;
      element.mythic = parseInt(element.mythic);
      element.mythic = element.mythic | 0;
      element.heroic = 0;
      Object.keys(element.heroicParse).forEach(heroicBoss => {
        element.heroic = element.heroic + element.heroicParse[heroicBoss];
      });
      element.heroic = element.heroic / Object.keys(element.heroicParse).length;
      element.heroic = parseInt(element.heroic);
      element.heroic = element.heroic | 0;
      element.normal = 0;
      Object.keys(element.normalParse).forEach(normalBoss => {
        element.normal = element.normal + element.normalParse[normalBoss];
      });
      element.normal = element.normal / Object.keys(element.normalParse).length;
      element.normal = parseInt(element.normal);
      element.normal = element.normal | 0;
    });
    this.getDetail();
    this.loaded = true
    this.rows = [...this.rows];
  }

  updateExtras(){
    this.specs = [];
    this.rows.forEach(element => {
      this.specs.push(specList[element.class])
    });
  }

  updateValue(event, cell, rowIndex){
    this.loadSpec[rowIndex] = true;
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex].spec = event.target.value;
    this.rows[rowIndex].role = "assets/"+roleCheck[event.target.value]+"Icon.png";
    if(this.rows[rowIndex].role.role=="assets/healerIcon.png"){
      var serviceResponse = this.warcraftService.searchCharacterHeal(this.rows[rowIndex].name,this.rows[rowIndex].server);
    }
    else  {
      var serviceResponse = this.warcraftService.searchCharacterDps(this.rows[rowIndex].name,this.rows[rowIndex].server);
      }
    serviceResponse
      .subscribe(response =>  {
        this.rows[rowIndex].mythicParse = {};
        this.rows[rowIndex].heroicParse = {};
        this.rows[rowIndex].normalParse = {};
        this.rows[rowIndex].mythic = 0;
        this.rows[rowIndex].heroic = 0;
        this.rows[rowIndex].normal = 0;
        response.json().forEach(report => {
          this.getBossesParses(this.rows[rowIndex],report);
        })
        // this.loadedCounter++;
        // if(this.loadedCounter==this.totalToLoad){
        //   this.getOverallParses();
        // }
        this.detailedRows[rowIndex].forEach(detailedRow => {
          detailedRow.normal = this.rows[rowIndex].normalParse[detailedRow.boss];
          if(detailedRow.normal == undefined){
            detailedRow.normal = 0;
          }
          detailedRow.heroic = this.rows[rowIndex].heroicParse[detailedRow.boss];
          if(detailedRow.heroic == undefined){
            detailedRow.heroic = 0;
          }
          detailedRow.mythic = this.rows[rowIndex].mythicParse[detailedRow.boss];
          if(detailedRow.mythic == undefined){
            detailedRow.mythic = 0;
          }
          this.rows[rowIndex].mythic = this.rows[rowIndex].mythic + detailedRow.mythic;
          this.rows[rowIndex].heroic = this.rows[rowIndex].heroic + detailedRow.heroic;
          this.rows[rowIndex].normal = this.rows[rowIndex].normal + detailedRow.normal;
        });
        this.rows[rowIndex].mythic = this.rows[rowIndex].mythic / Object.keys(this.rows[rowIndex].mythicParse).length;
        this.rows[rowIndex].heroic = this.rows[rowIndex].heroic / Object.keys(this.rows[rowIndex].heroicParse).length;
        this.rows[rowIndex].normal = this.rows[rowIndex].normal / Object.keys(this.rows[rowIndex].normalParse).length;
        this.rows[rowIndex].mythic = parseInt(this.rows[rowIndex].mythic) | 0;
        this.rows[rowIndex].heroic = parseInt(this.rows[rowIndex].heroic) | 0;
        this.rows[rowIndex].normal = parseInt(this.rows[rowIndex].normal) | 0;
        this.rows = [...this.rows];
        this.detailedRows = [...this.detailedRows];
        this.loadSpec[rowIndex] = false;
      }
    )
  }
}