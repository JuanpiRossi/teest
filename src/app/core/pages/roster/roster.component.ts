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

  constructor(private mongoService:MongoService) {
    this.rows=[
      { }
    ];
    this.columns= [
                    { name: 'name',prop: 'name' },
                    { name: 'class',prop: 'class' },
                    { name: 'spec',prop: 'spec' }
                  ];        
  }
  
  dataModel2 = this.rows;
  renderTable = true;

  ngOnInit() {
    this.mongoService.getGuild({"guildName":"Untamed"})
      .subscribe(res => {
        this.rows = []
        res.json().data.Roster.forEach(element => {
          this.rows.push({name:element["Name"],class:element["Class"],spec:element["Spec"]})
        });
        console.log(this.rows)
        this.updateSpecs();   
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
    console.log('inline editing rowIndex', rowIndex)
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    console.log('UPDATED!', this.rows[rowIndex][cell]);
    this.updateSpecs();
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
    console.log(newData)
  }

  updateSpecs(){
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
    this.rows.forEach(element => {
      this.specs.push(specList[element.class])
    });
    console.log(this.specs)
  }
}
