import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { MongoService } from './services/mongo.service';
import { WarcraftLogsService } from './services/warcraftLogsApi.service';
import { wowApiService } from './services/wowApi.services';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    HttpModule
  ],
  providers: [MongoService,WarcraftLogsService,wowApiService],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
