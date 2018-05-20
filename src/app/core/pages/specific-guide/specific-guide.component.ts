import { Component, OnInit,Input,ViewEncapsulation } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { MongoService } from '../../../services/mongo.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-specific-guide',
  templateUrl: './specific-guide.component.html',
  styleUrls: ['./specific-guide.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SpecificGuideComponent implements OnInit {

  role = ["any","melee dps","range dps","healer","tank"];
  @Input() bossName;
  bossId;
  @Input() res = {};
  @Input() roleSelect;
  loaded = false;

  constructor(private _activatedRoute: ActivatedRoute, private _router:Router,private mongoService:MongoService, public sanitizer: DomSanitizer) { 
    var queryStrings = this._router.url.split("?")
    queryStrings = queryStrings[1].split("&");
    this.bossId = queryStrings[0].substr(5);
    this.roleSelect = queryStrings[1].substr(5);
    this.mongoService.getGuide({"id":this.bossId})
    .subscribe(response =>  {
      this.bossName = response["data"]["name"];
      this.res = response;
      this.loaded = true;
    })
  }

  ngOnInit() {
  }

  updateValue($event) {
    this.roleSelect = event.target["value"];
    this._router.navigate(["/guide"], { queryParams: { boss: this.bossId, role: this.roleSelect } });
  }
}
