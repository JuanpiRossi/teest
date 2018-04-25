import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { ParsesComponent } from './parses/parses.component';
import { RouterModule } from '@angular/router';
import { RosterComponent } from './roster/roster.component';
import { NgxDatatableModule,DatatableComponent } from '@swimlane/ngx-datatable';
import { ParsesIlvlComponent } from './parses-ilvl/parses-ilvl.component'
import { LeftPanelComponent } from '../left-panel/left-panel.component';
import {DragulaExtendedDirective} from '../../directives/dragula/dragula-extended.directive';
import {DragulaModule, DragulaService} from 'ng2-dragula';


@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    NgxDatatableModule,
    DragulaModule
  ],
  providers:[DragulaService],
  declarations: [PagesComponent, HomeComponent, ParsesComponent, RosterComponent, ParsesIlvlComponent,LeftPanelComponent,DragulaExtendedDirective],
  exports: [PagesComponent, HomeComponent, ParsesComponent, RosterComponent, LeftPanelComponent, DragulaExtendedDirective]
})
export class PagesModule { }
