import { Component, OnInit, Input,Inject } from '@angular/core';
import { MongoService } from '../../../services/mongo.service';
import { specList } from '../../../../constants/class.specs';
import { roleCheck } from '../../../../constants/specs.roles';
import { userData } from '../../../services/userData.service';
import { officerPageList,memberPageList,noMemberPageList } from '../pages.list';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss']
})
export class RosterComponent implements OnInit {
  @Input() rowsRoster = [];
  @Input() rowsTrials = [];
  columns;
  editingRoster = {};
  editingTrials = {};
  specsRoster = []
  specsTrials = []
  iconsRoster = ["assets/tankIcon.png","assets/tankIcon.png","assets/tankIcon.png"]
  iconsTrials = ["assets/tankIcon.png","assets/tankIcon.png","assets/tankIcon.png"]
  mongoData;
  userLevelBool;
  loaded = false;
  options = {position: ["top", "right"]}
  
  dataModeRoster = this.rowsRoster;
  dataModeTrials = this.rowsTrials;
  renderTable = true;

  constructor(private mongoService:MongoService, public _userData:userData,private router: Router,public dialog: MatDialog,private _service: NotificationsService) {
    this.rowsRoster=[{}];
    this.rowsTrials=[{}];
    this.columns= [
                    { name: 'name',prop: 'name' },
                    { name: 'server',prop: 'server' },
                    { name: 'class',prop: 'class' },
                    { name: 'spec',prop: 'spec' },
                    { name: 'role',prop: 'role' }
                  ];        
  }

  ngOnInit() {
    this._userData.userLevel.subscribe(UL=>{
        const componentRoute = "roster";
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
    
    if(this.userLevelBool)  {
      this.mongoService.getGuild({"guildName":"Untamed"})
        .subscribe(res => {
          this.rowsRoster = []
          this.rowsTrials = []
          this.mongoData = res["data"];
          delete this.mongoData._id
          if(this.mongoData.Roster!= undefined) {
            this.mongoData.Roster.forEach(element => {
              this.rowsRoster.push({name:element["name"],server:element["server"],class:element["class"],spec:element["spec"]})
            });
          } else  {
            this.rowsRoster = [{name:"name",server:"server",class:"Priest",spec:"Holy"}];
          }
          if(this.mongoData.Trials!= undefined) {
            this.mongoData.Trials.forEach(element => {
              this.rowsTrials.push({name:element["name"],server:element["server"],class:element["class"],spec:element["spec"]})
            });
          } else  {
            this.rowsTrials = [{name:"name",server:"server",class:"Priest",spec:"Holy"}];
          }
          this.updateExtras();
          this.loaded = true;
        },error =>  {
          this._service.error("Servers are down");
        }
      );
    }
  }

  addMember(event,dbDict){
    let modal = this.dialog.open(rosterModal, {data:dbDict});

    modal.afterClosed()
      .subscribe(result => {
        if(result!=undefined) {
          if(dbDict=="Roster")  {
            this.rowsRoster.push(result);
            this.updateExtras();
            this.mongoData.Roster = this.rowsRoster
            this.rowsRoster = [...this.rowsRoster];
          }
          if(dbDict=="Trials")  {
            this.rowsTrials.push(result);
            this.updateExtras();
            this.mongoData.Trials = this.rowsTrials
            this.rowsTrials = [...this.rowsTrials];
          }
        }
      }
    )
  }

  saveRoster($event,dbDict){
    var updateData;
    if(dbDict=="Roster")  {
      updateData = {"$set":{"Roster":this.mongoData.Roster}};
    }
    if(dbDict=="Trials")  {
      updateData = {"$set":{"Trials":this.mongoData.Trials}};
    }
    if(dbDict=="All")  {
      updateData = {"$set":{"Trials":this.mongoData.Trials,"Roster":this.mongoData.Roster}};
    }
    this.mongoService.updateGuild({data:updateData,query:{guildName:"Untamed"}})
      .subscribe(res => {
        console.log(res["status"]=="success")
        if(dbDict=="Roster")  {
          if(res["status"]=="success")
            this._service.success("Main raiders saved succesfully");
          else
            this._service.error("Failed to execute action");
        }
        if(dbDict=="Trials")  {
          if(res["status"]=="success")
            this._service.success("Trials saved succesfully");
          else
            this._service.error("Failed to execute action");
        }
        if(dbDict=="All")  {
          if(res["status"]=="success")
            this._service.success("Roster saved succesfully");
          else
            this._service.error("Failed to execute action");
        }
      },error =>  {
        this._service.error("Servers are down");
      }
    )
  }

  deleteRow(rowIndex,dbDict){
    if(dbDict=="Roster")  {
      this.rowsRoster.splice(rowIndex,1)
      this.mongoData.Roster = this.rowsRoster
      this.rowsRoster = [...this.rowsRoster];
    }
    if(dbDict=="Trials")  {
      this.rowsTrials.splice(rowIndex,1)
      this.mongoData.Trials = this.rowsTrials
      this.rowsTrials = [...this.rowsTrials];
    }
  }
  
  updateRows(){
    console.log("updateRow");
  }

  updateValue(event, cell, rowIndex,dbDict){
    if(event.target.value != "")  {
      if(dbDict=="Roster")  {
        this.editingRoster[rowIndex + '-' + cell] = false;
        this.rowsRoster[rowIndex][cell] = event.target.value;
        this.rowsRoster = [...this.rowsRoster];
        this.updateExtras();
        if(cell=="class") {
          this.rowsRoster[rowIndex].spec = this.specsRoster[rowIndex][0].name;
        }
        this.mongoData.Roster = this.rowsRoster
      }
      if(dbDict=="Trials")  {
        this.editingTrials[rowIndex + '-' + cell] = false;
        this.rowsTrials[rowIndex][cell] = event.target.value;
        this.rowsTrials = [...this.rowsTrials];
        this.updateExtras();
        if(cell=="class") {
          this.rowsTrials[rowIndex].spec = this.specsTrials[rowIndex][0].name;
        }
        this.mongoData.Trials = this.rowsTrials
      }
    }    
  }

  getRowClass(row) {
    return  {
      'row-class-deathKnight': row.class === "Death Knight",
      'row-class-demonHunter': row.class === "Demon Hunter",
      'row-class-druid': row.class === "Druid",
      'row-class-hunter': row.class === "Hunter",
      'row-class-mage': row.class === "Mage",
      'row-class-monk': row.class === "Monk",
      'row-class-paladin': row.class === "Paladin",
      'row-class-priest': row.class === "Priest",
      'row-class-rogue': row.class === "Rogue",
      'row-class-shaman': row.class === "Shaman",
      'row-class-warlock': row.class === "Warlock",
      'row-class-warrior': row.class === "Warrior"
    }
  }
  
  onDrop(event,dbDict){
    let listData = event.split("\n");
    var newData = [];
    for(var i=0;i<(listData.length/5)-1;i++) {
      var saveData = {name: listData[i*5], server: listData[i*5+1], class: listData[i*5+2], spec: listData[i*5+3]};
      newData.push(saveData);
    }
    if(dbDict=="Roster")  {
      this.mongoData.Roster = newData;
    }
    if(dbDict=="Trials")  {
      this.mongoData.Trials = newData;
    }
  }

  ShowDebuger($event){
    console.log(this.rowsRoster);
  }

  updateExtras(){
    this.specsRoster = [];
    this.specsTrials = [];
    this.iconsRoster = [];
    this.iconsTrials = [];
    let i=0;
    this.rowsRoster.forEach(element => {
      this.specsRoster.push(specList[element.class])
      if(roleCheck[element.spec] == "tank") {
        element["role"] = "tank";
        this.iconsRoster.push("assets/tankIcon.png");
      }
      else if(roleCheck[element.spec] == "healer")  {
        element["role"] = "healer";
        this.iconsRoster.push("assets/healerIcon.png");
      }
      else if(roleCheck[element.spec] == "dps") {
        element["role"] = "dps";
        this.iconsRoster.push("assets/dpsIcon.png");
      }
      else
        this.iconsRoster.push("");
    });
    this.rowsTrials.forEach(element => {
      this.specsTrials.push(specList[element.class])
      if(roleCheck[element.spec] == "tank") {
        element["role"] = "tank";
        this.iconsTrials.push("assets/tankIcon.png");
      }
      else if(roleCheck[element.spec] == "healer")  {
        element["role"] = "healer";
        this.iconsTrials.push("assets/healerIcon.png");
      }
      else if(roleCheck[element.spec] == "dps") {
        element["role"] = "dps";
        this.iconsTrials.push("assets/dpsIcon.png");
      }
      else
        this.iconsTrials.push("");
    });
  }

  upgradePlayer(rowIndex) {
    let tmp;
    tmp = this.rowsTrials.splice(rowIndex,1)[0];
    this.mongoData.Trials = this.rowsTrials;
    this.rowsRoster.push(tmp);
    this.mongoData.Roster = this.rowsRoster;
    this.updateExtras()
    this.rowsRoster = [...this.rowsRoster];
    this.rowsTrials = [...this.rowsTrials]
  }

  lowgradePlayer(rowIndex)  {
    let tmp;
    tmp = this.rowsRoster.splice(rowIndex,1)[0];
    this.mongoData.Roster = this.rowsRoster;
    this.rowsTrials.push(tmp);
    this.mongoData.Trials = this.rowsTrials;
    this.updateExtras()
    this.rowsRoster = [...this.rowsRoster];
    this.rowsTrials = [...this.rowsTrials]
  }
}



@Component({
  selector: 'app-roster',
  templateUrl: './roster.modal.html',
  styleUrls: ['./roster.component.scss']
})
export class rosterModal {
  outData = {name:"",server:"",class:"",spec:""}
  serverError = false;
  modalEmpty = false;

  specListSave = specList;

  constructor(
    public dialogRef: MatDialogRef<rosterModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private mongoService:MongoService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onInput(event,tag)  {
    this.modalEmpty = false;
    if(tag == "name") {
      this.outData.name = event.target["value"];
    }
    if(tag == "server") {
      this.outData.server = event.target["value"];
      if(/^([a-zA-Z0-9]*)$/i.test(this.outData.server))  {
        this.serverError = false;
      } else  {
        this.serverError = true;
      }
    }
  }

  addPlayerButton(event)  {
    console.log(this.outData)
    if(this.outData.name!="" && this.outData.server!="" && this.outData.class!="" && this.outData.spec!="") {
      this.dialogRef.close(this.outData);
    } else  {
      this.modalEmpty = true;
    }
  }

  quitRosterModal(event)  {
    this.dialogRef.close();
  }
}