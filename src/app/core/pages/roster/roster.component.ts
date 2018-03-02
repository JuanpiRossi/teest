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
      { name: 'Aicero', class: 'Mage', spec: 'Fire' },
      { name: 'Aiun', class: 'Shaman', spec: 'Elemental' }
    ];
    this.columns= [
                    { prop: 'name' },
                    { name: 'class' },
                    { name: 'spec' }
                  ];
  }

  ngOnInit() {
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
}
