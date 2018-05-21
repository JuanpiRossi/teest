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
  public editorContentMelee = '';
  public editorContentRange = '';
  public editorContentHealer = '';
  public editorContentTank = '';
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
    })
  }

  ngOnInit() {
    this._userData.userLevel.subscribe(UL=>{
      const componentRoute = "guidesAdmin";
      if(UL!=3) {
        this.router.navigate(["/unauthorized"]);
      }
    }
  )
    // setTimeout(() => {
    //   this.editorContent = '<h1>content changed!</h1>';
    //   console.log('you can use the quill instance object to do something', this.editor);
    //   // this.editor.disable();
    // }, 2800)
  }

  updateValue($event) {
    this.roleSelect = event.target["value"];
    this._router.navigate(["/guide"], { queryParams: { boss: this.bossId, role: this.roleSelect } });
  }

  onEditorBlured(role,quill) {
    console.log('editor blur!', quill);
  }

  onEditorFocused(role,quill) {
    console.log('editor focus!', quill);
  }

  onEditorCreated(role,quill) {
    this.editor = quill;
    console.log('quill is ready! this is current quill instance object', quill);
  }

  onContentChanged(role,{ quill, html, text }) {
    console.log('quill content is changed!', quill, html, text);
  }

  radioChange($event) {
    this.roleSelect = {"mat-radio-2-input":"all","mat-radio-3-input":"melee dps","mat-radio-4-input":"range dps","mat-radio-5-input":"healer","mat-radio-6-input":"tank"}[event.target["id"]]
  }
}
