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
  @Input() detailedRows = {};
  detailsHeight;
  editing = {};
  specs = {};
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
  playersInfo = {};
  tableTypes = ["overall parse","item level parse"];
  tableTypesSelection = "overall parse";

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
        this.totalToLoad = this.rows.length;
        this.warcraftService.getBosses()
          .subscribe(response =>  {
            response.json().forEach(zone => {
              if(zone.id == this.zoneId) {
                this.bosses = zone.encounters;
              }
            })
            this.rows.forEach(row => {
              this.mongoService.getPlayer({name:row.name,server:row.server})
                .subscribe(playerData =>  {
                  this.playersInfo[row.name] = playerData.json().data
                  row.normal = playerData.json().data["parse"][row.spec]["overall"]["normal"]
                  row.heroic = playerData.json().data["parse"][row.spec]["overall"]["heroic"]
                  row.mythic = playerData.json().data["parse"][row.spec]["overall"]["mythic"]
                  this.specs[row.name] = Object.keys(playerData.json().data["parse"])
                  let tmp=[]
                  this.bosses.forEach(boss => {
                    tmp.push({boss:boss.name, normal:playerData.json().data["parse"][row.spec][boss.name]["normal"], heroic:playerData.json().data["parse"][row.spec][boss.name]["heroic"], mythic:playerData.json().data["parse"][row.spec][boss.name]["mythic"]})
                  });
                  this.detailedRows[row.name] = tmp

                  this.loadedCounter++;
                  if(this.loadedCounter==this.totalToLoad)  {
                    this.loaded = true;
                  }
                }
                )
              }
            );
            this.detailsHeight = 50 + this.bosses.length * 40;
          }
        )
      }
    );
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

  radioChange($event) {
    var target = {"mat-radio-2-input":"parse","mat-radio-3-input":"parseIlvl"}[event.target["id"]]
    this.rows.forEach(row => {
      row.normal = this.playersInfo[row.name][target][row.spec]["overall"]["normal"];
      row.heroic = this.playersInfo[row.name][target][row.spec]["overall"]["heroic"];
      row.mythic = this.playersInfo[row.name][target][row.spec]["overall"]["mythic"];
      let tmp=[]
      this.bosses.forEach(boss => {
        tmp.push({boss:boss.name, normal:this.playersInfo[row.name][target][row.spec][boss.name]["normal"], heroic:this.playersInfo[row.name][target][row.spec][boss.name]["heroic"], mythic:this.playersInfo[row.name][target][row.spec][boss.name]["mythic"]})
      });
      this.detailedRows[row.name] = tmp;
    });
    this.rows = [...this.rows]
  }

  updateValue($event, rowIndex) {
    var newSpec = event.target["value"];
    var target = {"overall parse":"parse","item level parse":"parseIlvl"}[this.tableTypesSelection]
    let tmp=[]
    this.rows[rowIndex].spec = newSpec;
    this.rows[rowIndex].normal = this.playersInfo[this.rows[rowIndex].name][target][newSpec]["overall"]["normal"];
    this.rows[rowIndex].heroic = this.playersInfo[this.rows[rowIndex].name][target][newSpec]["overall"]["heroic"];
    this.rows[rowIndex].mythic = this.playersInfo[this.rows[rowIndex].name][target][newSpec]["overall"]["mythic"];
    this.bosses.forEach(boss => {
      tmp.push({boss:boss.name, normal:this.playersInfo[this.rows[rowIndex].name][target][newSpec][boss.name]["normal"], heroic:this.playersInfo[this.rows[rowIndex].name][target][newSpec][boss.name]["heroic"], mythic:this.playersInfo[this.rows[rowIndex].name][target][newSpec][boss.name]["mythic"]})
    });
    this.detailedRows[this.rows[rowIndex].name] = tmp;
    this.rows = [...this.rows]
  }
}


