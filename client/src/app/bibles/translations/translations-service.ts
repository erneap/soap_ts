import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Translation } from 'soap-models/dist/plans';
import { APP_SETTINGS } from '../../app.settings';

@Injectable({
  providedIn: 'root'
})
export class TranslationsService {
  private apiUrl = inject(APP_SETTINGS).apiUrl;
  
  constructor(
    private http: HttpClient
  ) { }

  getTranslations(): Observable<HttpResponse<Translation[]>> {
    const url = this.apiUrl + '/translations';
    return this.http.get<Translation[]>(url, { observe: 'response'});
  }
}
