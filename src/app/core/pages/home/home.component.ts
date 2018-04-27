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
  constructor(public sanitizer: DomSanitizer) { 
    pageList.forEach(element => {
      this.htmlOut = this.htmlOut+'<div class="menuComponentContainer"><div class="menuComponent" onclick="window.location=\'/#/'+element.route+'\';"><div class="componentTitle">'+element.title+'</div><div class="componentDescription">'+element.description+'</div></div></div>'
    });
  }

  ngOnInit() {
  }

}
