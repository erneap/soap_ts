import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBibleBook } from 'soap-models/plans';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }
  
  getBookList(): Observable<HttpResponse<IBibleBook[]>> {
    return this.http.get<IBibleBook[]>(this.apiUrl + '/books', {
      observe: 'response'
    });
  }
}
