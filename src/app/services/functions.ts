import { Injectable } from '@angular/core';
import { wowApiService } from './wowApi.services';

@Injectable()
export class utils {

	constructor(private wowApi:wowApiService){
	}

    getBossesIcons(boss)    {
        let bossIcon;
        bossIcon = boss.toLocaleLowerCase().split(" ");
        bossIcon = bossIcon.join("");
        bossIcon = bossIcon.split("'");
        bossIcon = bossIcon.join("");
        bossIcon = bossIcon.split("-");
        bossIcon = bossIcon.join("");
        //EXCEPCIONES!!!!
        if(bossIcon=="antoranhighcommand"){bossIcon="warcouncil"}
        if(bossIcon=="eonarthelifebinder"){bossIcon="eonar"}
        //FIN DE EXCEPCIONES
        bossIcon = this.wowApi.retrieveBossImage(bossIcon);
    
        return bossIcon;
    }
}