import { Component, OnInit,Input,ViewEncapsulation } from '@angular/core';
import { userData } from '../../../services/userData.service';
import {ActivatedRoute, Router} from '@angular/router';
import { MongoService } from '../../../services/mongo.service';
import { DomSanitizer } from '@angular/platform-browser';
import { officerPageList,memberPageList,noMemberPageList } from '../pages.list';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-specific-guide-admin',
  templateUrl: './specific-guide-admin.component.html',
  styleUrls: ['./specific-guide-admin.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SpecificGuideAdminComponent implements OnInit {

  public editor = {};
  public editorContent = {melee:"",range:"",tank:"",healer:""}
  public editorOptions = {
    placeholder: "insert content...",
    color:"#fff"
  };

  role = ["all","melee dps","range dps","healer","tank"];
  @Input() bossName;
  bossId;
  userLevelBool;
  @Input() res = {};
  @Input() roleSelect = "all";
  loaded = false;

  constructor(private _activatedRoute: ActivatedRoute,private router: Router, private _router:Router,private mongoService:MongoService, public sanitizer: DomSanitizer,public _userData:userData) { 
    var queryStrings = this._router.url.split("?")
    this.bossId = queryStrings[1].substr(5);
    this.mongoService.getGuide({"id":this.bossId})
    .subscribe(response =>  {
      this.bossName = response["data"]["name"];
      this.res = response;
      this.editorContent.range = response["data"]["html-range"];
      this.editorContent.tank = response["data"]["html-tank"];
      this.editorContent.healer = response["data"]["html-healer"];
      this.editorContent.melee = response["data"]["html-melee"];
      this.loaded = true;
      setTimeout(() => {
        this.editor["melee"].enable();
        this.editor["range"].enable();
        this.editor["tank"].enable();
        this.editor["healer"].enable();
      }, 100);
    })
  }

  ngOnInit() {
    this._userData.userLevel.subscribe(UL=>{
      const componentRoute = "guidesAdmin";
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

  onEditorBlured(role,quill) {
  }

  onEditorCreated(role,quill) {
    this.editor[role] = quill;
    this.editor[role].disable();
  }

  onContentChanged(role,{ quill, html, text }) {
  }

  radioChange($event) {
    this.roleSelect = {"mat-radio-2-input":"all","mat-radio-3-input":"melee dps","mat-radio-4-input":"range dps","mat-radio-5-input":"healer","mat-radio-6-input":"tank"}[event.target["id"]]
  }

  deleteGuide($event) {
    this.mongoService.updateGuide({"query":{"id":this.bossId},"update":{"$set":{"show":false}}})
      .subscribe(r  =>  {
        console.log(r)
        this.router.navigate(["/guidesAdmin"]);
      }
    )
  }

  saveGuide($event) {
    this.mongoService.updateGuide({"query":{"id":this.bossId},"update":{"$set":{"html-melee":this.editorContent['melee'],"html-range":this.editorContent['range'],"html-tank":this.editorContent['tank'],"html-healer":this.editorContent['healer']}}})
      .subscribe(r  =>  {
        console.log(r)
      }
    )
  }

  saveRoleGuide(role,$event) {
    var htmlRole = "html-"+role
    this.mongoService.updateGuide({"query":{"id":this.bossId},"update":{"$set":{[htmlRole]:this.editorContent[role]}}})
      .subscribe(r  =>  {
        console.log(r)
      }
    )
  }

}
