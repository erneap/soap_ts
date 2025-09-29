import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HelpPageUpdateRequest, IPage } from 'soap-models/help';

@Injectable({
  providedIn: 'root'
})
export class HelpService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {}

  getHelpPages(lvl: number): Observable<HttpResponse<IPage[]>> {
    const url = this.apiUrl + `/help/${lvl}`;
    return this.http.get<IPage[]>(url, {
      observe: 'response'
    });
  }

  addHelpPage(): Observable<HttpResponse<IPage>> {
    const url = this.apiUrl + '/help';
    return this.http.post<IPage>(url, null, {
      observe: 'response'
    });
  }

  updateHelpPage(id: string, field: string, value: string, paraId?: number, 
    subid?: number, typeid?: string): Observable<HttpResponse<IPage>> {
    const url = this.apiUrl + '/help';
    const update: HelpPageUpdateRequest = {
      pageid: id,
      paragraphid: paraId,
      field: field,
      value: value
    };
    if (typeid && typeid.toLowerCase() === 'bullet') {
      update.bulletid = subid;
    } else if (typeid) {
      update.graphicid = subid;
    }
    return this.http.put<IPage>(url, update, { observe: 'response'});
  }

  addGraphicToHelp(id: string, paraID: number, caption: string, 
    mimetype: string, filedata: string): Observable<HttpResponse<IPage>> {
    const url = this.apiUrl + '/help/graphic';
    const update: HelpPageUpdateRequest = {
      pageid: id,
      paragraphid: paraID,
      field: caption,
      value: mimetype,
      filedata: filedata
    };
    return this.http.post<IPage>(url, update, {observe: 'response'});
  }

  deleteHelpPage(id: string): Observable<HttpResponse<void>> {
    const url = `${this.apiUrl}/help/${id}`;
    return this.http.delete<void>(url, { observe: 'response'});
  }
}
