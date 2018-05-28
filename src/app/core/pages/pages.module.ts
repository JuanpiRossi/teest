import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { ParsesComponent } from './parses/parses.component';
import { RouterModule } from '@angular/router';
import { RosterComponent,rosterModal } from './roster/roster.component';
import { NgxDatatableModule,DatatableComponent } from '@swimlane/ngx-datatable';
import { DragulaExtendedDirective } from '../../directives/dragula/dragula-extended.directive';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { CharSearcherComponent } from './char-searcher/char-searcher.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { RosterMembersComponent } from './roster-members/roster-members.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { GuidesComponent } from './guides/guides.component';
import { SpecificGuideComponent } from './specific-guide/specific-guide.component';
import { GuidesAdminComponent,guideAdminModal } from './guides-admin/guides-admin.component';
import { SpecificGuideAdminComponent } from './specific-guide-admin/specific-guide-admin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuillEditorModule } from 'ngx-quill-editor';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BossRosterAdminComponent } from './boss-roster-admin/boss-roster-admin.component';
import { BossRosterComponent } from './boss-roster/boss-roster.component';
import { UsefulLinksComponent } from './useful-links/useful-links.component';
import { SpecificBossRosterAdminComponent } from './specific-boss-roster-admin/specific-boss-roster-admin.component';
import { SpecificBossRosterComponent } from './specific-boss-roster/specific-boss-roster.component';




@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    NgxDatatableModule,
    DragulaModule,
    MatRadioModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    BrowserAnimationsModule,
    QuillEditorModule,
    MatInputModule,
    MatSelectModule,
    SimpleNotificationsModule.forRoot(),
    MatProgressSpinnerModule
  ],
  entryComponents: [ guideAdminModal,rosterModal ],
  providers:[DragulaService],
  declarations: [PagesComponent, HomeComponent, ParsesComponent, RosterComponent,DragulaExtendedDirective, CharSearcherComponent, UnauthorizedComponent, RosterMembersComponent, GuidesComponent, SpecificGuideComponent, GuidesAdminComponent, SpecificGuideAdminComponent, guideAdminModal,rosterModal, BossRosterAdminComponent, BossRosterComponent, UsefulLinksComponent, SpecificBossRosterAdminComponent, SpecificBossRosterComponent],
  exports: [PagesComponent, HomeComponent, ParsesComponent, RosterComponent, DragulaExtendedDirective]
})
export class PagesModule { }
