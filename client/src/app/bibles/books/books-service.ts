import { inject, Injectable } from '@angular/core';
import { APP_SETTINGS } from '../../app.settings';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBibleBook } from 'soap-models/dist/plans';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  apiUrl = inject(APP_SETTINGS).apiUrl;

  constructor(
    private http: HttpClient
  ) { }
  
  getBookList(): Observable<HttpResponse<IBibleBook[]>> {
    return this.http.get<IBibleBook[]>(this.apiUrl + '/books', {
      observe: 'response'
    });
  }
}
