import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { ParsesComponent } from './parses/parses.component';
import { RouterModule } from '@angular/router';
import { RosterComponent } from './roster/roster.component';
import { NgxDatatableModule,DatatableComponent } from '@swimlane/ngx-datatable';
import { DragulaExtendedDirective } from '../../directives/dragula/dragula-extended.directive';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { CharSearcherComponent } from './char-searcher/char-searcher.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { RosterMembersComponent } from './roster-members/roster-members.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { GuidesComponent } from './guides/guides.component';


@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    NgxDatatableModule,
    DragulaModule,
    MatRadioModule,
    FormsModule
  ],
  providers:[DragulaService],
  declarations: [PagesComponent, HomeComponent, ParsesComponent, RosterComponent,DragulaExtendedDirective, CharSearcherComponent, UnauthorizedComponent, RosterMembersComponent, GuidesComponent],
  exports: [PagesComponent, HomeComponent, ParsesComponent, RosterComponent, DragulaExtendedDirective]
})
export class PagesModule { }
