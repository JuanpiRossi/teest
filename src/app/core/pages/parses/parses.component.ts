import { Component, OnInit, ViewChild,  Input } from '@angular/core';
import { MongoService } from '../../../services/mongo.service';
import { WarcraftLogsService } from '../../../services/warcraftLogsApi.service';

@Component({
  selector: 'app-parses',
  templateUrl: './parses.component.html',
  styleUrls: ['./parses.component.scss']
})
export class ParsesComponent implements OnInit {

  @Input() rows = [];
  @Input() detailedRows = [];
  detailsHeight;
  mongoData;
  expanded: any = {};
  timeout: any;
  bosses;
  zoneId = 17;
  loadedCounter = 0;
  totalToLoad=0;
  loaded = false;

  @ViewChild('myTable') table: any;

  constructor(private mongoService:MongoService, private warcraftService:WarcraftLogsService) { }

  ngOnInit() {
    this.mongoService.getGuild({"guildName":"Untamed"})
      .subscribe(res => {
        var counter = 0;
        this.rows = []
        this.mongoData = res.json().data;
        delete this.mongoData._id
        res.json().data.Roster.forEach(element => {
          this.rows.push({name:element["name"],class:element["class"],spec:element["spec"],server:element["server"],normal:0,heroic:0,mythic:0,rowIndex:counter})
          counter++;
        });
        this.totalToLoad = this.rows.length;
        this.warcraftService.getBosses()
          .subscribe(response =>  {
            console.log(response.json());
            response.json().forEach(zone => {
              if(zone.id == this.zoneId) {
                this.bosses = zone.encounters;
              }
            });
        this.rows.forEach(element => {
          element.mythicParse = {};
          element.heroicParse = {};
          element.normalParse = {};
          this.warcraftService.searchCharacterDps(element.name,element.server)
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
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
    console.log(this.rows)
    console.log(this.loaded)
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
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
    console.log(this.detailedRows)
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
}