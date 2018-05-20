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