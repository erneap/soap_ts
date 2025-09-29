import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser, NewUserRequest, NewUserResponse, UpdateUserRequest } from 'soap-models/users';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private userUrl = this.apiUrl + '/user';
  private usersUrl = this.apiUrl + '/users';

  constructor(
    private http: HttpClient
  ) {}

  getUsers(): Observable<HttpResponse<IUser[]>> {
    return this.http.get<IUser[]>(this.usersUrl, {
      observe: 'response'
    });
  }

  createUser(email: string, first: string, middle: string | null, last: string, 
    plan: string, translation: string ): Observable<HttpResponse<NewUserResponse>> {
    const newuser: NewUserRequest = {
      email: email,
      firstName: first,
      middleName: (middle && middle !== null) ? middle : '',
      lastName: last,
      plan: plan,
      translation: translation
    };
    const url = this.userUrl + '/new';
    return this.http.post<NewUserResponse>(url, newuser, { 
      observe: 'response'});
  }

  updateUser(id: string, field: string, value: string): Observable<HttpResponse<IUser>> {
    const update: UpdateUserRequest = {
      id: id,
      field: field,
      value: value
    };
    return this.http.put<IUser>(this.userUrl, update, { observe: 'response' });
  }
}
