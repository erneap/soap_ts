import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISoapEntry, NewEntryRequest, UpdateEntryRequest } from 'soap-models/entries';
import { Message } from 'soap-models/common';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntryService {
  private apiUrl = environment.apiUrl;

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

  updateEntry(userid: string, year: number, id: string, field: string, value: string): 
    Observable<HttpResponse<ISoapEntry>> {
    const url = this.apiUrl + '/entry';
    const data: UpdateEntryRequest = {
      user: userid,
      year: year,
      id: id,
      field: field, 
      value: value
    };
    return this.http.put<ISoapEntry>(url, data, {
      observe: 'response'
    });
  }

  deleteEntry(userid: string, year: number, id: string): Observable<HttpResponse<Message>> {
    const url = `${this.apiUrl}/entry/${userid}/${year}/${id}`;
    return this.http.delete<Message>(url, {
      observe: 'response'
    });
  }
}
