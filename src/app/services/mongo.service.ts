import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Http } from '@angular/http';
import {Observable} from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class MongoService {
	public guildData;
	
	constructor(private http : Http){
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

	updateGuild(guildData){
		return this.http.post(environment.apiUrl + '/api/updateGuild',guildData)
	}
}