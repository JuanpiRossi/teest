import { Component, OnInit,ViewEncapsulation,Inject } from '@angular/core';
import { userData } from '../../../services/userData.service';
import {Router} from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { officerPageList,memberPageList,noMemberPageList } from '../pages.list';
import { MongoService } from '../../../services/mongo.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { zoneId } from '../../../../constants/config';
import { wowApiService } from '../../../services/wowApi.services';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-guides-admin',
  templateUrl: './guides-admin.component.html',
  styleUrls: ['./guides-admin.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GuidesAdminComponent implements OnInit {
  userLevelBool;
  bosses = [];
  htmlOut = "";
  role = ["any","melee dps","range dps","healer","tank"];
  roleSelect = "any"
  responseSave;

  constructor(private wowApi:wowApiService, public sanitizer: DomSanitizer,public _userData:userData,private router: Router, private mongoService:MongoService,public dialog: MatDialog) { }

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

    this.mongoService.getGuidesReduced()
    .subscribe(response =>  {
      this.responseSave = response;
      this.htmlOut = ""
      response["data"].forEach(guide =>{
        delete guide["_id"];
        if(guide["show"]) {
          this.htmlOut = this.htmlOut+'<div class="guideComponentContainer"><div class="guideComponent" onclick="window.location=\'/#/guideAdmin?boss='+guide.id+'\';"><img class="guideComponentImage" src='+guide.img+' width="30px" height="30px"><div class="guideComponentTitle">'+guide.name+'</div></div></div>';
        }
      })
    })
  }

  updateValue($event) {
    console.log(event)
    this.roleSelect = event.target["value"]

    this.htmlOut = ""
    this.responseSave["data"].forEach(guide =>{
      delete guide["_id"];
      if(guide["show"]) {
        this.htmlOut = this.htmlOut+'<div class="guideComponentContainer"><div class="guideComponent" onclick="window.location=\'/#/guideAdmin?boss='+guide.id+'\';"><img class="guideComponentImage" src='+guide.img+' width="30px" height="30px"><div class="guideComponentTitle">'+guide.name+'</div></div></div>';
      }
    })
  }

  newGuide($event)  {
    this.dialog.open(guideAdminModal, {
      data: {
        animal: 'panda'
      }
    });
    console.log(event);
  }
}


@Component({
  selector: 'app-guides-admin',
  templateUrl: 'guides-admin-modal.html',
})
export class guideAdminModal {

  constructor(
    public dialogRef: MatDialogRef<guideAdminModal>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}