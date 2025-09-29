import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPlan, NewPlanDayReadingRequest, NewPlanRequest, UpdatePlanRequest } from 'soap-models/plans';
import { Message } from 'soap-models/common';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private apiUrl = environment.apiUrl;
  
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

  addPlan(title: string, plantype: string, months: number)
    : Observable<HttpResponse<IPlan>> {
    if (months < 1) {
      months = 1;
    }
    const newPlan: NewPlanRequest = {
      name: title,
      plantype: plantype,
      months: months
    };
    const url = this.apiUrl + '/plan/newplan';
    return this.http.post<IPlan>(url, newPlan, { observe: 'response'});
  }

  addReading(plan: string, month: number, day: number, book: string, 
    chapter: number, start?: number, end?: number)
    : Observable<HttpResponse<IPlan>> {
    const url = this.apiUrl + '/plan/reading';
    const data: NewPlanDayReadingRequest = {
      id: plan,
      month: month,
      day: day,
      book: book,
      chapter: chapter,
      start: start,
      end: end
    };
    return this.http.post<IPlan>(url, data, { observe: 'response'});
  }

  updatePlan(id: string, field: string, value: string, month?: number, 
    day?: number, reading?: number): Observable<HttpResponse<IPlan>> {
    const url = this.apiUrl + "/plan";
    const data: UpdatePlanRequest = {
      id: id,
      field: field,
      value: value,
      month: month,
      day: day,
      readingID: reading
    };
    return this.http.put<IPlan>(url, data, { observe: 'response'});
  }

  deletePlan(id: string): Observable<HttpResponse<Message>> {
    const url = `${this.apiUrl}/plan/${id}`;
    return this.http.delete<Message>(url, { observe: 'response'});
  }
}
