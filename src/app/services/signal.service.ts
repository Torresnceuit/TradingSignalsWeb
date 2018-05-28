import { Injectable } from '@angular/core';
import { Signal } from '../models/signal';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class SignalService {
  constructor(private http: HttpService) { }

  getSignals(): Observable<Array<Signal>>{

    return this.http.get<Array<Signal>>(environment.base_endpoint+'/api/signals/get')
  }

}
