import { Component, OnInit } from '@angular/core';
import { wowApiService } from '../../services/wowApi.services';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  serverStatus;

  constructor(private wowApi:wowApiService) { }

  ngOnInit() {
    this.wowApi.realmStatus()
      .subscribe(response =>  {
        response["realms"].forEach(element => {
          if(element.slug == "zuljin"){
            this.serverStatus = element.status;
          }
        });
    })
  }

}
