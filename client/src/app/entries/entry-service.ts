import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ISoapEntry, NewEntryRequest, UpdateEntryRequest } from 'soap-models/dist/entries';
import { Message } from 'soap-models/dist/common';
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
    return this.http.get<ISoapEntry[]>(url, {
      observe: 'response'
    });
  }

  newEntry(userid: string, date: Date): Observable<HttpResponse<ISoapEntry>> {
    const url = this.apiUrl + `/entry`;
    const data: NewEntryRequest = {
      user: userid,
      entrydate: date.toISOString()
    }
    return this.http.post<ISoapEntry>(url, data, {
      observe: 'response'
    });
  }

  updateEntry(userid: string, id: string, field: string, value: string): 
    Observable<HttpResponse<ISoapEntry>> {
    const url = this.apiUrl + '/entry';
    const data: UpdateEntryRequest = {
      user: userid,
      entrydate: id,
      field: field, 
      value: value
    };
    return this.http.put<ISoapEntry>(url, data, {
      observe: 'response'
    });
  }

  deleteEntry(userid: string, date: Date): Observable<HttpResponse<Message>> {
    const url = `${this.apiUrl}/entry/${userid}/${date.toISOString()}`;
    return this.http.delete<Message>(url, {
      observe: 'response'
    });
  }
}
