import { Component, OnInit,Input,ViewEncapsulation } from '@angular/core';
import { userData } from '../../../services/userData.service';
import {ActivatedRoute, Router} from '@angular/router';
import { MongoService } from '../../../services/mongo.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-specific-guide-admin',
  templateUrl: './specific-guide-admin.component.html',
  styleUrls: ['./specific-guide-admin.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SpecificGuideAdminComponent implements OnInit {

  public editor;
  public editorContent = {melee:"",range:"",tank:"",healer:""}
  public editorOptions = {
    placeholder: "insert content...",
    color:"#fff"
  };

  role = ["all","melee dps","range dps","healer","tank"];
  @Input() bossName;
  bossId;
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
      this.loaded = true;
      this.editorContent = {melee:response["data"]["html-melee"],range:response["data"]["html-range"],tank:response["data"]["html-tank"],healer:response["data"]["html-healer"]}
    })
  }

  ngOnInit() {
    this._userData.userLevel.subscribe(UL=>{
      const componentRoute = "guidesAdmin";
      if(UL!=3) {
        this.router.navigate(["/unauthorized"]);
      }
    })
  }

  onEditorBlured(role,quill) {
  }

  onEditorFocused(role,quill) {
  }

  onEditorCreated(role,quill) {
    this.editor = quill;
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
