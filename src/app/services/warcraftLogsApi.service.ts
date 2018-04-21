import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Http } from '@angular/http';
import {Observable} from 'rxjs';

@Injectable()
export class WarcraftLogsService {
    public guildData;
    api_key = "16653d65bcc270d94cf72848be6a1cdc";

	constructor(private http : Http){
        this.guildData = {}
	}

	alive(){
		return this.http.get('http://localhost:3000/api/alive')
	}

	searchCharacterDps(character,server){
		return this.http.get('https://www.warcraftlogs.com/v1/parses/character/'+character+'/'+server+'/us?metric=dps&api_key='+this.api_key);
	}

	searchCharacterHeal(character,server){
		return this.http.get('https://www.warcraftlogs.com/v1/parses/character/'+character+'/'+server+'/us?metric=hps&api_key='+this.api_key);
	}

	searchCharacterDpsIlvl(character,server){
		return this.http.get('https://www.warcraftlogs.com/v1/parses/character/'+character+'/'+server+'/us?metric=dps&bracket=-1&api_key='+this.api_key);
	}

	searchCharacterHealIlvl(character,server){
		return this.http.get('https://www.warcraftlogs.com/v1/parses/character/'+character+'/'+server+'/us?metric=hps&bracket=-1&api_key='+this.api_key);
	}

	getBosses(){
		return this.http.get('https://www.warcraftlogs.com/v1/zones?api_key='+this.api_key);
	}
}