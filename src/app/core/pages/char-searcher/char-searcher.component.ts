import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { wowApiService } from '../../../services/wowApi.services';
import { classIcons } from '../../../../constants/class.icons';
import { specIcons } from '../../../../constants/spec.icons';
import { profIcons } from '../../../../constants/professions.icons';
import { roleCheck } from '../../../../constants/specs.roles';
import { specList } from '../../../../constants/class.specs';
import { WarcraftLogsService } from '../../../services/warcraftLogsApi.service';
import { userData } from '../../../services/userData.service';
import { officerPageList,memberPageList,noMemberPageList } from '../pages.list';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { utils } from '../../../services/functions';

@Component({
  selector: 'app-char-searcher',
  templateUrl: './char-searcher.component.html',
  styleUrls: ['./char-searcher.component.scss']
})
export class CharSearcherComponent implements OnInit {
  charName = "";
  serverName = "";
  error = {name:{text:"",error:false},server:{text:"",error:false},webService:{text:"",error:false}};
  loader = false;
  altCode = false;
  searchLoad = false;
  races;
  classes;
  character = {class:"",race:"",level:"",name:"",realm:"",avatar:"",faction:"",guild:{},pvp:{},spec:"",professions:[{name:"",level:"",icon:""},{name:"",level:"",icon:""}],averageIlvl:"",averageIlvlEquiped:"",specIcon:"",classIcon:""};
  innerHTML = "";
  expanded;
  detailsHeight;
  @Input() rows = [];
  @Input() items = [];
  @Input() stats = [];
  @Input() overallParse = [];
  @Input() overallParseDetails = {};
  @Input() ilvlParse = [];
  @Input() ilvlParseDetails = {};
  userLevelBool=false;

  @ViewChild('myTable') table: any;
  @ViewChild('myTable2') table2: any;
  
  constructor(private wowApi:wowApiService, private warcraftService:WarcraftLogsService, public _userData:userData,private router: Router, private _utils:utils) { }

  ngOnInit() {
      this._userData.userLevel.subscribe(UL=>{
        const componentRoute = "charSearcher";
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
      this.searchLoad = false;
      this.getBossesIcons()
      this.wowApi.getClasses()
        .subscribe(response=>{
          this.classes = response;
        }
      )
      this.wowApi.getRaces()
        .subscribe(response=>{
          this.races = response;
        }
      )
    }
  }

  nameChange($event)  {
    this.charName = event.target["value"];
    this.error.name.error = false;
    this.error.name.text = "";
  };

  serverChange($event)  {
    this.serverName = event.target["value"];
    this.error.server.error = false;
    this.error.server.text = "";
  };

  altCodes($event)  {
    this.altCode=!this.altCode;
  };

  closeAltCode($event)  {
    this.altCode=false;
  };

  specialChar($event) {
    this.charName = this.charName + event.target["value"];
  };

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  toggleExpandRow2(row) {
    this.table2.rowDetail.toggleExpandRow(row);
  }

  searchCharacter($event) {
    this.loader = true;
    this.error.webService.error = false;
    this.error.webService.text = "";
    if(this.charName=="") {
      this.error.name.error = true;
      this.error.name.text = "*Name required";
    }
    if(this.serverName=="") {
      this.error.server.error = true;
      this.error.server.text = "*Server required";
    }
    if(this.serverName!="" && this.charName!="")  {
      this.wowApi.characterInformation(this.charName,this.serverName)
        .subscribe(response =>  {
          this.processCharacterInfo(response);
          this.loader = false;
        },  error => {
          this.error.webService.error = true;
          this.error.webService.text = error.json().reason;
          this.loader = false;
        }
      )
    } else  {
      this.loader = false;
    }
  };

  processCharacterInfo(response){
    this.character = {class:"",race:"",level:"",name:"",realm:"",avatar:"",faction:"",guild:{},pvp:{},spec:"",professions:[{name:"",level:"",icon:""},{name:"",level:"",icon:""}],averageIlvl:"",averageIlvlEquiped:"",specIcon:"",classIcon:""};;
    this.classes.classes.forEach(element => {
      if(element.id == response.class){
        this.character["class"] = element.name;
      }
    });
    this.races.races.forEach(element => {
      if(element.id == response.race){
        this.character["race"] = element.name;
      }
    });
    this.character["level"] = response.level;
    this.character["name"] = response.name;
    this.character["realm"] = response.realm;
    this.character["avatar"] = this.wowApi.retrieveInsetImage(response.thumbnail.split('-')[0]);
    if(response.faction == 1){
      this.character["faction"] = "Horde";
    } else if(response.faction == 0){
      this.character["faction"] = "Alliance";
    } else{
      this.character["faction"] = "Neutral";
    }
    if(response.guild!=undefined) {
      this.character["guild"] = {name:response.guild.name,emblem:{icon:response.guild.emblem.icon,iconColorId:response.guild.emblem.iconColorId,border:response.guild.emblem.border,borderColor:response.guild.emblem.borderColor,borderColorId:response.guild.emblem.borderColorId,backgroundColor:response.guild.emblem.backgroundColor,backgroundColorId:response.guild.emblem.backgroundColorId}};
    }
    Object.keys(response.stats).forEach(key => {
      this.stats.push({stat:key,value:response.stats[key]})
    });
    this.stats = [...this.stats];
    this.character["pvp"] = {arena2v2:response.pvp.brackets.ARENA_BRACKET_2v2.rating,arena3v3:response.pvp.brackets.ARENA_BRACKET_3v3.rating,rbg:response.pvp.brackets.ARENA_BRACKET_RBG.rating,honorKill:response.totalHonorableKills}
    this.character["talents"] = {};
    response.talents.forEach(element => {
      var tmpTalent={tier0:"",tier1:"",tier2:"",tier3:"",tier4:"",tier6:""};
      var spec = "";
      if(element.talents.length != 0) {
        if(element.selected == true)  {
          this.character["spec"] = element.spec.name;
        }
        element.talents.forEach(talent => {
          tmpTalent["tier"+talent.tier] = talent.spell;
        if(talent.spec != undefined)  {
          spec = talent.spec.name;
        }
        });
      }
      if(spec!="")  {
        this.character["talents"][spec] = tmpTalent;
      }
    });
    this.character["professions"] = [];
    response.professions.primary.forEach(element => {
      this.character["professions"].push({name:element.name,level:element.rank,icon:this.wowApi.retrieveIcon(profIcons[element.name])});
    });
    this.rows = [];
    response.progression.raids[response.progression.raids.length-1].bosses.forEach(element => {
      this.rows.push({boss:element.name,normal:element.normalKills,heroic:element.heroicKills,mythic:element.mythicKills});
    });
    this.getBossesIcons();
    this.rows = [...this.rows];
    this.character["averageIlvl"] = response.items.averageItemLevel;
    this.character["averageIlvlEquiped"] = response.items.averageItemLevelEquipped;
    var itemsKeys = Object.keys(response.items);
    itemsKeys.splice(itemsKeys.indexOf("averageItemLevel"),1);
    itemsKeys.splice(itemsKeys.indexOf("averageItemLevelEquipped"),1);
    this.character.specIcon = this.wowApi.retrieveIcon(specIcons[this.character.class][this.character.spec]);
    this.character.classIcon = this.wowApi.retrieveIcon(classIcons[this.character.class]);
    this.items = [];
    itemsKeys.forEach(item => {
      this.items.push({slot:item,icon:this.wowApi.retrieveIcon(response.items[item].icon),ilvl:response.items[item].itemLevel,name:response.items[item].name})
    });
    this.items = [...this.items];
    this.ilvlParse = [];
    this.overallParse = [];
    this.getOveralParses();
    this.getIlvlParses();
    this.searchLoad = true
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

  getRowClass() {
    return  {
      'row-boss': true
    }
  }

  getBossesIcons()  {
    this.rows.forEach(element => {
      element["bossIcon"] = this._utils.getBossesIcons(element.boss)
    });
  }

  getOveralParses() {
    var specs = specList[this.character.class];
    var bosses = [];
    this.rows.forEach(element => {
      bosses.push(element.boss);
    });
    this.detailsHeight = 50 + bosses.length * 40;
    this.overallParseDetails =  {};
    specs.forEach(spec => {
      if(spec.name!="Ranged"&&spec.name!="Melee"&&spec.name!="Healing") {
        this.overallParseDetails[spec.name] = [];
        bosses.forEach(boss => {
          this.overallParseDetails[spec.name].push({boss:boss,normal:0,heroic:0,mythic:0})
        });
      }
    });
    this.warcraftService.searchCharacterDps(this.character.name,this.serverName)
      .subscribe(response =>  {
        response.forEach(report => {
          report.specs.forEach(specReport => {
            if(specReport.spec!="Ranged"&&specReport.spec!="Melee"&&specReport.spec!="Healing"&&roleCheck[specReport.spec]!="healer") {
              this.overallParseDetails[specReport.spec].forEach(boss => {
                if(boss.boss == report.name){
                  if(specReport.best_historical_percent == ""){
                    specReport.best_historical_percent = 0;
                  }
                  if(report.difficulty==5)  {
                    boss.mythic = parseInt(specReport.best_historical_percent) | 0;
                  } else if(report.difficulty==4)  {
                    boss.heroic = parseInt(specReport.best_historical_percent) | 0;
                  } else if(report.difficulty==3)  {
                    boss.normal = parseInt(specReport.best_historical_percent) | 0;
                  }
                }
              });
            }
          });
        });
        Object.keys(this.overallParseDetails).forEach(spec => {
          if(roleCheck[spec]!="healer"){
            var contN = 0;
            var contH = 0;
            var contM = 0;
            var normal = 0;
            var heroic = 0;
            var mythic = 0;
            this.overallParseDetails[spec].forEach(parses => {
              if(parses.normal != 0 && parses.normal != ""){
                contN++;
                normal = normal + parses.normal;
              }
              if(parses.heroic != 0 && parses.heroic != ""){
                contH++;
                heroic = heroic + parses.heroic;
              }
              if(parses.mythic != 0 && parses.mythic != ""){
                contM++;
                mythic = mythic + parses.mythic;
              }
            });
            normal = Math.round(normal/contN);
            heroic = Math.round(heroic/contH);
            mythic = Math.round(mythic/contM);
            this.overallParse.push({spec:spec,normal:normal|0,heroic:heroic|0,mythic:mythic|0,specIcon:this.wowApi.retrieveIcon(specIcons[this.character.class][spec])})
          }
        });
        this.overallParse = [...this.overallParse]
      }
    )
    this.warcraftService.searchCharacterHeal(this.character.name,this.serverName)
      .subscribe(response =>  {
        response.forEach(report => {
          report.specs.forEach(specReport => {
            if(specReport.spec!="Ranged"&&specReport.spec!="Melee"&&specReport.spec!="Healing"&&roleCheck[specReport.spec]=="healer") {
              this.overallParseDetails[specReport.spec].forEach(boss => {
                if(boss.boss == report.name){
                  if(specReport.best_historical_percent == ""){
                    specReport.best_historical_percent = 0;
                  }
                  if(report.difficulty==5)  {
                    boss.mythic = parseInt(specReport.best_historical_percent) | 0;
                  } else if(report.difficulty==4)  {
                    boss.heroic = parseInt(specReport.best_historical_percent) | 0;
                  } else if(report.difficulty==3)  {
                    boss.normal = parseInt(specReport.best_historical_percent) | 0;
                  }
                }
              });
            }
          });
        });
        Object.keys(this.overallParseDetails).forEach(spec => {
          if(roleCheck[spec]=="healer"){
            var contN = 0;
            var contH = 0;
            var contM = 0;
            var normal = 0;
            var heroic = 0;
            var mythic = 0;
            this.overallParseDetails[spec].forEach(parses => {
              if(parses.normal != 0 && parses.normal != ""){
                contN++;
                normal = normal + parses.normal;
              }
              if(parses.heroic != 0 && parses.heroic != ""){
                contH++;
                heroic = heroic + parses.heroic;
              }
              if(parses.mythic != 0 && parses.mythic != ""){
                contM++;
                mythic = mythic + parses.mythic;
              }
            });
            normal = Math.round(normal/contN);
            heroic = Math.round(heroic/contH);
            mythic = Math.round(mythic/contM);
            this.overallParse.push({spec:spec,normal:normal|0,heroic:heroic|0,mythic:mythic|0,specIcon:this.wowApi.retrieveIcon(specIcons[this.character.class][spec])})
          }
        });
        this.overallParse = [...this.overallParse]
      }
    )
  }

  getIlvlParses() {
    var specs = specList[this.character.class];
    var bosses = [];
    //overallParse
    this.rows.forEach(element => {
      bosses.push(element.boss);
    });
    this.ilvlParseDetails =  {};
    specs.forEach(spec => {
      if(spec.name!="Ranged"&&spec.name!="Melee"&&spec.name!="Healing") {
        this.ilvlParseDetails[spec.name] = [];
        bosses.forEach(boss => {
          this.ilvlParseDetails[spec.name].push({boss:boss,normal:0,heroic:0,mythic:0})
        });
      }
    });
    this.warcraftService.searchCharacterDpsIlvl(this.character.name,this.serverName)
      .subscribe(response =>  {
        response.forEach(report => {
          report.specs.forEach(specReport => {
            if(specReport.spec!="Ranged"&&specReport.spec!="Melee"&&specReport.spec!="Healing"&&roleCheck[specReport.spec]!="healer") {
              this.ilvlParseDetails[specReport.spec].forEach(boss => {
                if(boss.boss == report.name){
                  if(specReport.best_historical_percent == ""){
                    specReport.best_historical_percent = 0;
                  }
                  if(report.difficulty==5)  {
                    boss.mythic = parseInt(specReport.best_historical_percent) | 0;
                  } else if(report.difficulty==4)  {
                    boss.heroic = parseInt(specReport.best_historical_percent) | 0;
                  } else if(report.difficulty==3)  {
                    boss.normal = parseInt(specReport.best_historical_percent) | 0;
                  }
                }
              });
            }
          });
        });
        Object.keys(this.ilvlParseDetails).forEach(spec => {
          if(roleCheck[spec]!="healer"){
            var contN = 0;
            var contH = 0;
            var contM = 0;
            var normal = 0;
            var heroic = 0;
            var mythic = 0;
            this.ilvlParseDetails[spec].forEach(parses => {
              if(parses.normal != 0 && parses.normal != ""){
                contN++;
                normal = normal + parses.normal;
              }
              if(parses.heroic != 0 && parses.heroic != ""){
                contH++;
                heroic = heroic + parses.heroic;
              }
              if(parses.mythic != 0 && parses.mythic != ""){
                contM++;
                mythic = mythic + parses.mythic;
              }
            });
            normal = Math.round(normal/contN);
            heroic = Math.round(heroic/contH);
            mythic = Math.round(mythic/contM);
            this.ilvlParse.push({spec:spec,normal:normal|0,heroic:heroic|0,mythic:mythic|0,specIcon:this.wowApi.retrieveIcon(specIcons[this.character.class][spec])})
          }
        });
        this.ilvlParse = [...this.ilvlParse]
      }
    )
    this.warcraftService.searchCharacterHealIlvl(this.character.name,this.serverName)
      .subscribe(response =>  {
        response.forEach(report => {
          report.specs.forEach(specReport => {
            if(specReport.spec!="Ranged"&&specReport.spec!="Melee"&&specReport.spec!="Healing"&&roleCheck[specReport.spec]=="healer") {
              this.ilvlParseDetails[specReport.spec].forEach(boss => {
                if(boss.boss == report.name){
                  if(specReport.best_historical_percent == ""){
                    specReport.best_historical_percent = 0;
                  }
                  if(report.difficulty==5)  {
                    boss.mythic = parseInt(specReport.best_historical_percent) | 0;
                  } else if(report.difficulty==4)  {
                    boss.heroic = parseInt(specReport.best_historical_percent) | 0;
                  } else if(report.difficulty==3)  {
                    boss.normal = parseInt(specReport.best_historical_percent) | 0;
                  }
                }
              });
            }
          });
        });
        Object.keys(this.ilvlParseDetails).forEach(spec => {
          if(roleCheck[spec]=="healer"){
            var contN = 0;
            var contH = 0;
            var contM = 0;
            var normal = 0;
            var heroic = 0;
            var mythic = 0;
            this.ilvlParseDetails[spec].forEach(parses => {
              if(parses.normal != 0 && parses.normal != ""){
                contN++;
                normal = normal + parses.normal;
              }
              if(parses.heroic != 0 && parses.heroic != ""){
                contH++;
                heroic = heroic + parses.heroic;
              }
              if(parses.mythic != 0 && parses.mythic != ""){
                contM++;
                mythic = mythic + parses.mythic;
              }
            });
            normal = Math.round(normal/contN);
            heroic = Math.round(heroic/contH);
            mythic = Math.round(mythic/contM);
            this.ilvlParse.push({spec:spec,normal:normal|0,heroic:heroic|0,mythic:mythic|0,specIcon:this.wowApi.retrieveIcon(specIcons[this.character.class][spec])})
          }
        });
        this.ilvlParse = [...this.ilvlParse]
      }
    )
  }
}
