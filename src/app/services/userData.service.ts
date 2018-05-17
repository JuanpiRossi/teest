import {Injectable} from "@angular/core";
import { BehaviorSubject } from 'rxjs';
import {CookieService} from 'angular2-cookie/core';

@Injectable()
export class userData {
    userLevel = new BehaviorSubject(1);

    constructor(private _cookieService:CookieService) {
        if(this.getCookie('bG9nZ2luZyBpbiBzdGF0dXM')=='Z3VpbGRtYXN0ZXJhbHRvcXVl')  {//guildmasteraltoque
          this.setValue(3);
        } else if(this.getCookie('bG9nZ2luZyBpbiBzdGF0dXM')=='Z3VpbGRtZW1iZXJyZXR1cnJv')  {//guildmemberreturro
          this.setValue(2);
        } else if(this.getCookie('bG9nZ2luZyBpbiBzdGF0dXM')=='bm9lc2RlbGd1aWxkZWxnYXRvZXN0ZQ==')  {//noesdelguildelgatoeste
          this.setValue(1);
        } else  {
          this._cookieService.put('bG9nZ2luZyBpbiBzdGF0dXM', 'bm9lc2RlbGd1aWxkZWxnYXRvZXN0ZQ==');
          this.setValue(1);
        }
    }

    getCookie(key){
      return this._cookieService.get(key);
    }

    setValue(val) {
        this.userLevel.next(val)
    }
}