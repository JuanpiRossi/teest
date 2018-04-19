import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-parses',
  templateUrl: './parses.component.html',
  styleUrls: ['./parses.component.scss']
})
export class ParsesComponent implements OnInit {

  rows = [{name:"aiun",class:"Mage",spec:"Fire"},{name:"aidos",class:"Shaman",spec:"Elemental"}];
  expanded: any = {};
  timeout: any;

  @ViewChild('myTable') table: any;

  constructor() { }

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
  
  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      console.log('paged!', event);
    }, 100);
  }

  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }

  getDetailRowHeight(row, index) {
    console.log("aaa", row, index);
    return 100;
  }
}
