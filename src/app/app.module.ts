import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { MongoService } from './services/mongo.service';
import { WarcraftLogsService } from './services/warcraftLogsApi.service';
import { wowApiService } from './services/wowApi.services';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { userData } from './services/userData.service';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    HttpClientModule
  ],
  providers: [MongoService,WarcraftLogsService,wowApiService,CookieService,userData],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
