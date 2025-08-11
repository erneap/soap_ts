import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPlan } from 'soap-models/dist/plans';
import { APP_SETTINGS } from '../app.settings';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private apiUrl = inject(APP_SETTINGS).apiUrl
  
  constructor(
    private http: HttpClient,
  ) {}

  getReadingPlan(id: string): Observable<HttpResponse<IPlan>> {
    const url = this.apiUrl + `/plan/${id}`;
    return this.http.get<IPlan>(url, { observe: 'response'});
  }

  getPlans(): Observable<HttpResponse<IPlan[]>> {
    const url = this.apiUrl + '/plans';
    return this.http.get<IPlan[]>(url, { observe: 'response'});
  }
}
