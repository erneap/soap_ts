import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Translation } from 'soap-models/plans';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TranslationsService {
  private apiUrl = environment.apiUrl;
  
  constructor(
    private http: HttpClient
  ) { }

  getTranslations(): Observable<HttpResponse<Translation[]>> {
    const url = this.apiUrl + '/translations';
    return this.http.get<Translation[]>(url, { observe: 'response'});
  }
}
