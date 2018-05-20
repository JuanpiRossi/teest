import { Component, OnInit, Input } from '@angular/core';
import { MongoService } from '../../../services/mongo.service';
import { specList } from '../../../../constants/class.specs';
import { roleCheck } from '../../../../constants/specs.roles';
import { userData } from '../../../services/userData.service';
import { officerPageList,memberPageList,noMemberPageList } from '../pages.list';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-roster-members',
  templateUrl: './roster-members.component.html',
  styleUrls: ['./roster-members.component.scss']
})
export class RosterMembersComponent implements OnInit {
  @Input() rows = [];
  columns;
  editing = {};
  specs = []
  icons = ["assets/tankIcon.png","assets/tankIcon.png","assets/tankIcon.png"]
  mongoData;
  newData;
  userLevelBool;

  constructor(private mongoService:MongoService, public _userData:userData,private router: Router) {
    this.rows=[{}];
    this.columns= [
                    { name: 'name',prop: 'name' },
                    { name: 'server',prop: 'server' },
                    { name: 'class',prop: 'class' },
                    { name: 'spec',prop: 'spec' },
                    { name: 'role',prop: 'role' }
                  ];        
  }
  
  dataModel2 = this.rows;
  renderTable = true;

  ngOnInit() {
    this._userData.userLevel.subscribe(UL=>{
        const componentRoute = "rosterM";
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
          this.rows = []
          this.mongoData = res["data"];
          delete this.mongoData._id
          if(this.mongoData.Roster!= undefined) {
            this.mongoData.Roster.forEach(element => {
              this.rows.push({name:element["name"],server:element["server"],class:element["class"],spec:element["spec"]})
            });
          } else  {
            this.rows = [{name:"name",server:"server",class:"Priest",spec:"Holy"}];
          }
          this.updateExtras();
        });
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
  

  updateExtras(){
    this.specs = [];
    this.icons = [];
    let i=0;
    this.rows.forEach(element => {
      this.specs.push(specList[element.class])
      if(roleCheck[element.spec] == "tank") {
        element["role"] = "tank";
        this.icons.push("assets/tankIcon.png");
      }
      else if(roleCheck[element.spec] == "healer")  {
        element["role"] = "healer";
        this.icons.push("assets/healerIcon.png");
      }
      else if(roleCheck[element.spec] == "dps") {
        element["role"] = "dps";
        this.icons.push("assets/dpsIcon.png");
      }
      else
        this.icons.push("");
    });
  }
}
