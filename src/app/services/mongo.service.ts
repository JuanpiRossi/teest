import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Http } from '@angular/http';
import {Observable} from 'rxjs';

@Injectable()
export class MongoService {
    public guildData;

	constructor(private http : Http){
        this.guildData = {}
	}

	alive(){
		return this.http.get('http://localhost:3000/api/alive')
	}

	addGuild(guild){
		return this.http.post('http://localhost:3000/api/addGuild',guild)
	}

	getGuild(query){
		return this.http.post('http://localhost:3000/api/getGuild',query)
	}

	updateGuild(guildData){
		return this.http.post('http://localhost:3000/api/updateGuild',guildData)
	}
}