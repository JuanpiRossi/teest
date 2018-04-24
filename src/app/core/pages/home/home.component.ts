import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { pageList } from '../pages.list';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  htmlOut="";
  pageList=pageList;
  constructor(private sanitizer: DomSanitizer) { 
    this.htmlOut = '<div class="menuComponentContainer"><div class="menuComponent" onclick="window.location=\'/#/roster\';"><div class="componentTitle">Roster</div><div class="componentDescription">Guild roster list</div></div></div><div class="menuComponentContainer"><div class="menuComponent" onclick="window.location=\'/#/parses\';"><div class="componentTitle">Parses Overall</div><div class="componentDescription">Guild parses list overall</div></div></div><div class="menuComponentContainer"><div class="menuComponent" onclick="window.location=\'/#/parsesIlvl\';"><div class="componentTitle">Parses by ilvl</div><div class="componentDescription">Guild parses list by item level</div></div></div>'
  }

  ngOnInit() {
    // pageList.forEach(element => {
    //   this.htmlOut = this.htmlOut + '<div class="menuComponentContainer"><div class="menuComponent" style="cursor: pointer;" onclick="window.location=\'/#/roster\';"><div class="componentTitle">'+element.title+'</div><div class="componentDescription">'+element.description+'</div></div></div>';
    // });
  }

}
