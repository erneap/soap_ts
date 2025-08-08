import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ISoapEntry, SoapEntry } from 'soap-models/dist/entries';
import { AuthService } from '../services/auth-service';
import { APP_SETTINGS } from '../app.settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntryService {
  private apiUrl = inject(APP_SETTINGS).apiUrl;

  constructor(
    private http: HttpClient
  ) {}

  getUserEntries(userid: string, start: Date, end: Date)
    : Observable<HttpResponse<ISoapEntry[]>> {
    const url = this.apiUrl + `/entries/dates/${userid}/${start.toISOString()}`
      + `/${end.toISOString()}`;
    console.log(url);
    return this.http.get<ISoapEntry[]>(url, {
      observe: 'response'
    });
  }
}
