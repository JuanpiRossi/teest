import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component'
import { PagesComponent } from './core/pages/pages.component'
import { HomeComponent } from './core/pages/home/home.component'
import { ParsesComponent } from './core/pages/parses/parses.component'
import { RosterComponent } from './core/pages/roster/roster.component'
import { CharSearcherComponent } from './core/pages/char-searcher/char-searcher.component'
import { UnauthorizedComponent } from './core/pages/unauthorized/unauthorized.component'
import { RosterMembersComponent } from './core/pages/roster-members/roster-members.component'
import { GuidesComponent } from './core/pages/guides/guides.component'
import { SpecificGuideComponent } from './core/pages/specific-guide/specific-guide.component'
import { GuidesAdminComponent } from './core/pages/guides-admin/guides-admin.component'
import { SpecificGuideAdminComponent } from './core/pages/specific-guide-admin/specific-guide-admin.component'
import { BossRosterAdminComponent } from './core/pages/boss-roster-admin/boss-roster-admin.component'
import { BossRosterComponent } from './core/pages/boss-roster/boss-roster.component'
import { UsefulLinksComponent } from './core/pages/useful-links/useful-links.component'
import { SpecificBossRosterComponent } from './core/pages/specific-boss-roster/specific-boss-roster.component'
import { SpecificBossRosterAdminComponent } from './core/pages/specific-boss-roster-admin/specific-boss-roster-admin.component'

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'unauthorized',
        component: UnauthorizedComponent,
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'parses',
        component: ParsesComponent,
      },
      {
        path: 'roster',
        component: RosterComponent,
      },
      {
        path: 'charSearcher',
        component: CharSearcherComponent,
      },
      {
        path: 'rosterM',
        component: RosterMembersComponent,
      },
      {
        path: 'guides',
        component: GuidesComponent,
      },
      {
        path: 'guide',
        component: SpecificGuideComponent,
      },
      {
        path: 'guidesAdmin',
        component: GuidesAdminComponent,
      },
      {
        path: 'guideAdmin',
        component: SpecificGuideAdminComponent,
      },
      {
        path: 'bossRoster',
        component: BossRosterComponent,
      },
      {
        path: 'bossRosterAdmin',
        component: BossRosterAdminComponent,
      },
      {
        path: 'usefulLinks',
        component: UsefulLinksComponent,
      },
      {
        path: 'specificBossRoster',
        component: SpecificBossRosterComponent,
      },
      {
        path: 'specificBossRosterAdmin',
        component: SpecificBossRosterAdminComponent,
      }
      //{ path: 'error-500', component: Error500Component },
      //{ path: '**', component: NotFoundComponent }
    ]
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  declarations: []
})
export class AppRoutingModule { }