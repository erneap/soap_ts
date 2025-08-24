import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPage } from 'soap-models/dist/help';

@Injectable({
  providedIn: 'root'
})
export class HelpService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {}

  getHelpPages(): Observable<HttpResponse<IPage[]>> {
    const url = this.apiUrl + `/help`;
    return this.http.get<IPage[]>(url, {
      observe: 'response'
    });
  }
}
