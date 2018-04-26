import { Component, OnInit } from '@angular/core';
import { wowApiService } from '../../../services/wowApi.services';

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
  races;
  classes;
  character = {};
  innerHTML = "";

  constructor(private wowApi:wowApiService) { }

  ngOnInit() {
    this.wowApi.getClasses()
      .subscribe(response=>{
        this.classes = response.json();
      }
    )
    this.wowApi.getRaces()
      .subscribe(response=>{
        this.races = response.json();
      }
    )
  }

  CharacterInfo() {
    console.log("CharacterInfo");
    this.wowApi.characterInformation("aicero","zuljin")
      .subscribe(response =>  {
        console.log(response.json())
    })
  };

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

  searchCharacter($event) {
    this.loader = true;
    this.error.webService.error = false;
    this.error.webService.text = "";
    console.log("charName",this.charName);
    console.log("serverName",this.serverName);
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
          this.processCharacterInfo(response.json());
          this.loader = false;
        },  error => {
          this.error.webService.error = true;
          this.error.webService.text = error.json().reason;
          console.log(this.error.webService)
          this.loader = false;
        }
      )
    } else  {
      this.loader = false;
    }
  };

  processCharacterInfo(response){
    console.log(response)
    this.character = {};
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
    this.character["avatar"] = response.thumbnail.split('-')[0];
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
    this.character["stats"] = response.stats;
    this.character["pvp"] = {arena2v2:response.pvp.brackets.ARENA_BRACKET_2v2.rating,arena3v3:response.pvp.brackets.ARENA_BRACKET_3v3.rating,rbg:response.pvp.brackets.ARENA_BRACKET_RBG.rating,honorKill:response.totalHonorableKills}
    this.character["talents"] = {};
    response.talents.forEach(element => {
      var tmpTalent={tier0:"",tier1:"",tier2:"",tier3:"",tier4:"",tier6:""};
      var spec = "";
      if(element.talents.length != 0) {
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
      this.character["professions"].push({name:element.name,level:element.rank});
    });
    this.character["progress"] = {name:response.progression.raids[response.progression.raids.length-1].name,normal:{},heroic:{},mythic:{}}
    response.progression.raids[response.progression.raids.length-1].bosses.forEach(element => {
      this.character["progress"]["normal"][element.name] = element.normalKills;
      this.character["progress"]["heroic"][element.name] = element.heroicKills;
      this.character["progress"]["mythic"][element.name] = element.mythicKills;
    });
    this.character["averageIlvl"] = response.items.averageItemLevel;
    this.character["averageIlvlEquiped"] = response.items.averageItemLevelEquipped;
    var itemsKeys = Object.keys(response.items);
    itemsKeys.splice(itemsKeys.indexOf("averageItemLevel"),1);
    itemsKeys.splice(itemsKeys.indexOf("averageItemLevelEquipped"),1);
    this.character["items"] = {};
    itemsKeys.forEach(item => {
      this.character["items"][item] = {name:response.items[item].name,ilvl:response.items[item].itemLevel,icon:response.items[item].icon,stats:response.items[item].stats}
    });
    this.generateHTML();
    console.log(this.character);
  }

  generateHTML()  {
    this.innerHTML = "";
    console.log(this.wowApi.retrieveAvatarImage(this.character["avatar"]))
    console.log(this.wowApi.retrieveInsetImage(this.character["avatar"]))
    console.log(this.wowApi.retrieveProfileImage(this.character["avatar"]))
  }
}
