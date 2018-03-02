import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { ParsesComponent } from './parses/parses.component';
import { RouterModule } from '@angular/router';
import { RosterComponent } from './roster/roster.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    NgxDatatableModule
  ],
  declarations: [PagesComponent, HomeComponent, ParsesComponent, RosterComponent],
  exports: [PagesComponent, HomeComponent, ParsesComponent]
})
export class PagesModule { }
