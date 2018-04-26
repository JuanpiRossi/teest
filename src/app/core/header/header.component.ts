import { Component, OnInit } from '@angular/core';
import { wowApiService } from '../../services/wowApi.services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  serverStatus;
  constructor(private wowApi:wowApiService) { }

  ngOnInit() {
    this.wowApi.realmStatus()
      .subscribe(response =>  {
        response.json().realms.forEach(element => {
          if(element.slug == "zuljin"){
            this.serverStatus = element.status;
          }
        });
    })
  }

}
