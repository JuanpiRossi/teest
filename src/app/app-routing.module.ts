import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component'
import { PagesComponent } from './core/pages/pages.component'
import { HomeComponent } from './core/pages/home/home.component'
import { ParsesComponent } from './core/pages/parses/parses.component'
import { RosterComponent } from './core/pages/roster/roster.component'


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