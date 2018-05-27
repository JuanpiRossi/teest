import { Component,OnInit,ViewEncapsulation,Inject } from '@angular/core';
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
  loaded = false;

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
        this.htmlOut = ""
        response["data"].forEach(guide =>{
          delete guide["_id"];
          if(guide["show"]) {
            this.htmlOut = this.htmlOut+'<div class="guideComponentContainerAdmin"><div class="guideComponentAdmin" onclick="window.location=\'/#/guideAdmin?boss='+guide.id+'\';"><img class="guideComponentImageAdmin" src='+guide.img+' width="30px" height="30px"><div class="guideComponentTitleAdmin">'+guide.name+'</div></div></div>';
          }
        })
        this.loaded = true;
      }
    )
  }

  newGuide($event)  {
    let modal = this.dialog.open(guideAdminModal, {});

    modal.afterClosed()
      .subscribe(result => {
        if(result)  {
          this.mongoService.getGuidesReduced()
            .subscribe(response =>  {
              this.htmlOut = ""
              response["data"].forEach(guide =>{
                delete guide["_id"];
                if(guide["show"]) {
                  this.htmlOut = this.htmlOut+'<div class="guideComponentContainerAdmin"><div class="guideComponentAdmin" onclick="window.location=\'/#/guideAdmin?boss='+guide.id+'\';"><img class="guideComponentImageAdmin" src='+guide.img+' width="30px" height="30px"><div class="guideComponentTitleAdmin">'+guide.name+'</div></div></div>';
                }
              })
            }
          )
        }
      }
    )
  }

  getGuideOk(evt) {
    console.log(evt);
  }
}


@Component({
  selector: 'app-guides-admin',
  templateUrl: 'guides-admin-modal.html',
  styleUrls: ['./guides-admin.component.scss'],
})
export class guideAdminModal {

  guideName = "";
  guideId = "";
  img="";
  showImage = false;
  guideIdRegex = false;
  guideEmpty = false;
  loaded = true;

  constructor(
    public dialogRef: MatDialogRef<guideAdminModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private mongoService:MongoService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onChangeName($event)  {
    this.guideName = event.target["value"];
    this.guideEmpty = false;
  }

  onChangeImg($event) {
    this.img = event.target["value"];
    this.guideEmpty = false;
  }

  onChangeID($event)  {
    this.guideEmpty = false;
    this.guideId = event.target["value"];
    if(/^([a-zA-Z0-9]*)$/i.test(this.guideId))  {
      this.guideIdRegex = false;
    } else  {
      this.guideIdRegex = true;
    }
  }

  showHideImage($event) {
    this.showImage = !this.showImage;
  }

  newGuideCreate($event)  {
    if(this.guideId != "" && this.guideName != ""){
      this.loaded = false;
      this.mongoService.getGuidesOrderNumer()
        .subscribe(order => {
          console.log(order["data"]["order"]);
          this.mongoService.addGuide({name:this.guideName,id:this.guideId,img:this.img,show:true,order:order["data"]["order"]+1,"html-healer":"","html-range":"","html-melee":"","html-tank":""})
            .subscribe(res => {
              console.log(res)
              this.dialogRef.close(true);
              this.loaded = false;
            }
          )
        }
      )
    } else  {
      this.guideEmpty = true;
    }
  }

  quitModal($event) {
    this.dialogRef.close();
  }
}