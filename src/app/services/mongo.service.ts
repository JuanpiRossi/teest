import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {Observable} from 'rxjs';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient } from '@angular/common/http'

@Injectable()
export class MongoService {
	public guildData;
	
	constructor(private http : HttpClient){
        this.guildData = {}
	}

	alive(){
		return this.http.get(environment.apiUrl + '/api/alive')
	}

	addGuild(guild){
		return this.http.post(environment.apiUrl + '/api/addGuild',guild)
	}

	getGuild(query){
		return this.http.post(environment.apiUrl + '/api/getGuild',query)
	}

	getPlayer(query){
		return this.http.post(environment.apiUrl + '/api/getPlayer',query)
	}

	updateGuild(guildData){
		return this.http.post(environment.apiUrl + '/api/updateGuild',guildData)
	}

	getGuidesReduced(){
		return this.http.get(environment.apiUrl + '/api/getGuidesReduced')
	}

	getGuide(guildData){
		return this.http.post(environment.apiUrl + '/api/getGuide',guildData)
	}
}