import { Component, OnInit, OnDestroy,Input } from '@angular/core';
import { MongoService } from '../../../services/mongo.service';
import { Http, Response } from "@angular/http"
import { TableColumn,ColumnMode } from '@swimlane/ngx-datatable';
import 'rxjs/add/operator/map';


@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss']
})
export class RosterComponent implements OnDestroy,OnInit {
  @Input() rows = [];
  columns;
  editing = {};
  specs = []
  icons = ["assets/tankIcon.png","assets/tankIcon.png","assets/tankIcon.png",]

  constructor(private mongoService:MongoService) {
    this.rows=[
      { }
    ];
    this.columns= [
                    { name: 'name',prop: 'name' },
                    { name: 'server',prop: 'server' },
                    { name: 'class',prop: 'class' },
                    { name: 'spec',prop: 'spec' },
                    { name: 'role',prop: 'role' }
                  ];        
  }
  
  dataModel2 = this.rows;
  renderTable = true;

  ngOnInit() {
    this.mongoService.getGuild({"guildName":"Untamed"})
      .subscribe(res => {
        this.rows = []
        res.json().data.Roster.forEach(element => {
          this.rows.push({name:element["Name"],server:element["Server"],class:element["Class"],spec:element["Spec"]})
        });
        this.updateExtras();   
      });
  }

  ngOnDestroy() {
  }

  openAddMember(){
    console.log("addMember");
  }
  
  updateRows(){
    console.log("updateRow");
  }

  updateValue(event, cell, rowIndex){
    console.log(event.target.value)
    this.editing[rowIndex + '-' + cell] = false;
    if(event.target.value != ""){
      this.rows[rowIndex][cell] = event.target.value;
      this.rows = [...this.rows];
    }
    this.updateExtras();
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
  
  // DRAG and DROP - Virtual Scroll
  onDrop(event){
    // ngx-datatable recommends you force change detection
    let listData = event.split("\n");
    let newData = [];
    for(var i=0;i<(listData.length/3)-1;i++) {
      var saveData = {name: listData[i*3], class: listData[i*3+1], spec: listData[i*3+2]};
      newData.push(saveData);
      }
  }

  updateExtras(){
    var specList= {
      "Death Knight":[{"name":"Frost"},{"name":"Unholy"},{"name":"Blood"}],
      "Demon Hunter":[{"name":"Havoc"},{"name":"Vengeance"}],
      "Druid":[{"name":"Balance"},{"name":"Restoration"},{"name":"Feral"},{"name":"Guardian"}],
      "Hunter":[{"name":"Marksmanship"},{"name":"Beast Mastery"},{"name":"Survival"}],
      "Mage":[{"name":"Frost"},{"name":"Fire"},{"name":"Arcane"}],
      "Monk":[{"name":"Brewmaster"},{"name":"Mistweaver"},{"name":"Windwalker"}],
      "Paladin":[{"name":"Retribution"},{"name":"Holy"},{"name":"Protection"}],
      "Priest":[{"name":"Holy"},{"name":"Shadow"},{"name":"Discipline"}],
      "Rogue":[{"name":"Assassination"},{"name":"Outlaw"},{"name":"Subtlety"}],
      "Shaman":[{"name":"Elemental"},{"name":"Restoration"},{"name":"Enhancement"}],
      "Warlock":[{"name":"Destruction"},{"name":"Affliction"},{"name":"Demonology"}],
      "Warrior":[{"name":"Arms"},{"name":"Fury"},{"name":"Protection"}]
    }
    this.specs = [];
    this.icons = [];
    this.rows.forEach(element => {
      this.specs.push(specList[element.class])
      console.log(element.spec)
      if(element.spec=="Blood" || element.spec=="Vengeance" || element.spec=="Guardian" || element.spec=="Brewmaster" || element.spec=="Protection" || element.spec=="Protection")
        this.icons.push("assets/tankIcon.png");
      else if(element.spec=="Restoration" || element.spec=="Mistweaver" || element.spec=="Holy" || element.spec=="Discipline")
        this.icons.push("assets/healerIcon.png");
      else if(element.spec=="Frost" || element.spec=="Unholy" || element.spec=="Havoc" || element.spec=="Balance" || element.spec=="Feral" || element.spec=="Marksmanship" || element.spec=="Beast Mastery" || element.spec=="Survival" || element.spec=="Frost" || element.spec=="Fire" || element.spec=="Arcane" || element.spec=="Windwalker" || element.spec=="Retribution" || element.spec=="Shadow" || element.spec=="Assassination" || element.spec=="Outlaw" || element.spec=="Subtlety" || element.spec=="Elemental" || element.spec=="Enhancement" || element.spec=="Destruction" || element.spec=="Affliction" || element.spec=="Demonology" || element.spec=="Arms" || element.spec=="Fury")
        this.icons.push("assets/dpsIcon.png");
      else
        this.icons.push("");
    });
  }
}
