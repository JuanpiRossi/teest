import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss']
})
export class RosterComponent implements OnInit {
  rows;
  columns;
  selected;
  
  constructor() {
    this.rows=[
      { name: 'Aiun', class: 'Mage', spec: 'Fire' },
      { name: 'Aidos', class: 'Shaman', spec: 'Elemental' },
      { name: 'Aitres', class: 'Druid', spec: 'Feral' },
      { name: 'Aicua', class: 'Death Knight', spec: 'Frost' },
      { name: 'Aicinco', class: 'Monk', spec: 'Mistweaver' }
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
    this.columns[0].width = 1;
  }
  ngAfterViewInit(){
    
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
}
