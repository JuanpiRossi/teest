import { Component, OnInit,Input,ViewEncapsulation } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { MongoService } from '../../../services/mongo.service';
import { DomSanitizer } from '@angular/platform-browser';
import { officerPageList,memberPageList,noMemberPageList } from '../pages.list';
import { userData } from '../../../services/userData.service';

@Component({
  selector: 'app-specific-guide',
  templateUrl: './specific-guide.component.html',
  styleUrls: ['./specific-guide.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SpecificGuideComponent implements OnInit {

  role = ["any","melee dps","range dps","healer","tank"];
  @Input() bossName;
  userLevelBool;
  bossId;
  @Input() res = {};
  @Input() roleSelect;
  loaded = false;
  editorOptions = {
    modules: {
      toolbar: false
    },
    readOnly: true,
    theme: 'snow'
  };

  constructor(private _activatedRoute: ActivatedRoute, private _router:Router,private mongoService:MongoService, public sanitizer: DomSanitizer,public _userData:userData,private router: Router) { 
    var queryStrings = this._router.url.split("?")
    queryStrings = queryStrings[1].split("&");
    this.bossId = queryStrings[0].substr(5);
    this.roleSelect = queryStrings[1].substr(5);
    this.mongoService.getGuide({"id":this.bossId})
      .subscribe(response =>  {
        this.bossName = response["data"]["name"];
        this.res = response;
        this.loaded = true;
      }
    )
  }

  ngOnInit() {
    this._userData.userLevel.subscribe(UL=>{
      const componentRoute = "guides";
      this.userLevelBool=false;
      if(UL==3) {
        officerPageList.forEach(element => {
          if(element.route==componentRoute) {
            this.userLevelBool=true;
          }
        });
      } else if(UL==2)  {
        memberPageList.forEach(element => {
          if(element.route==componentRoute) {
            this.userLevelBool=true;
          }
        });
      } else {
        noMemberPageList.forEach(element => {
          if(element.route==componentRoute) {
            this.userLevelBool=true;
          }
        });
      }
      if(!this.userLevelBool)  {
        this.router.navigate(["/unauthorized"]);
      }
    }
  )
  }

  updateValue($event) {
    this.roleSelect = event.target["value"];
    this._router.navigate(["/guide"], { queryParams: { boss: this.bossId, role: this.roleSelect } });
  }
}
