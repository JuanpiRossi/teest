import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Http } from '@angular/http';
import {Observable} from 'rxjs';

@Injectable()
export class wowApiService {
    public guildData;
    api_key = "2jtxhexd5rkbctb54s7g5djfdasxwhfc";

	constructor(private http : Http){
        this.guildData = {}
	}

	realmStatus(){
		return this.http.get("https://us.api.battle.net/wow/realm/status?locale=en_US&apikey="+this.api_key);
	}

	getClasses(){
		return this.http.get("https://us.api.battle.net/wow/data/character/classes?locale=en_US&apikey="+this.api_key);
	}

	getRaces(){
		return this.http.get("https://us.api.battle.net/wow/data/character/races?locale=en_US&apikey="+this.api_key);
	}

	characterInformation(name,server){
		return this.http.get("https://us.api.battle.net/wow/character/"+server+"/"+name+"?fields=guild,items,professions,progression,pvp,stats,talents&locale=en_US&apikey="+this.api_key);
	}

	retrieveAvatarImage(image){
		return "http://render-us.worldofwarcraft.com/character/"+image+"-avatar.jpg";
	}

	retrieveInsetImage(image){
		return "http://render-us.worldofwarcraft.com/character/"+image+"-inset.jpg";
	}

	retrieveProfileImage(image){
		return "http://render-us.worldofwarcraft.com/character/"+image+"-profilemain.jpg";
	}

	retrieveIcon(image){
		return "https://wow.zamimg.com/images/wow/icons/large/"+image+".jpg";
	}
}