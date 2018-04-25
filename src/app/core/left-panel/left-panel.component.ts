import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { pageList } from '../pages/pages.list';
import { DomSanitizer } from '@angular/platform-browser';
import {Router} from '@angular/router';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LeftPanelComponent implements OnInit {
  htmlOut="";
  constructor(private sanitizer: DomSanitizer,private router: Router) {
    pageList.forEach(element => {
      if("/"+element.route != router.url){
        this.htmlOut = this.htmlOut + '<div class="menuPanelComponent" onmousedown="window.location=\'/#/'+element.route+'\';"><div class="componentPanelTitle">'+element.title+'</div><div class="componentPanelDescription">'+element.description+'</div></div>'
        // this.htmlOut = this.htmlOut + '<div class="menuPanelComponent" onmousedown="console.log(\'test\')"><div class="componentPanelTitle">'+element.title+'</div><div class="componentPanelDescription">'+element.description+'</div></div>'
      }
    });
  }

  ngOnInit() {
  }

}
