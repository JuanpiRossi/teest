import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { ParsesComponent } from './parses/parses.component';
import { RouterModule } from '@angular/router';
import { RosterComponent } from './roster/roster.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RosterModule } from './roster/roster.module'


@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    NgxDatatableModule,
    RosterModule
  ],
  declarations: [PagesComponent, HomeComponent, ParsesComponent],
  exports: [PagesComponent, HomeComponent, ParsesComponent]
})
export class PagesModule { }
