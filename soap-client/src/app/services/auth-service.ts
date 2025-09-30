import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IUser, UpdateUserRequest, User } from 'soap-models/users'
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = `${environment.apiUrl}/user`;
  public accessToken = signal('');
  public refreshToken = signal('');
  public errorMsg = signal('');
  public user = signal(new User);
  isLoggedIn = computed(() => this.user() && this.accessToken() !== '');
  isAdmin = computed(() => this.user() && this.user().administrator);

  constructor(
    private http: HttpClient
  ) {}

  authenticate(email: string, passwd: string): Observable<HttpResponse<IUser>> {
    return this.http.post<IUser>(this.authUrl + '/authenticate',
      { email: email, password: passwd },
      { observe: 'response' }).pipe(map(res => {
        const user = new User(res.body as IUser);
        if (user.badAttempts >= 0) {
          this.user.set(new User(res.body as IUser));
        }
        return res;
      }));
  }

  mustChange(email: string, passwd: string): Observable<HttpResponse<IUser>> {
    const request: UpdateUserRequest = {
      id: email,
      field: '',
      value: passwd
    };
    const url = this.authUrl + '/mustchange';
    return this.http.put<IUser>(url , request, { observe: 'response'}).pipe(
      map(res => {
        const user = new User(res.body as IUser);
        if (user.badAttempts >= 0) {
          this.user.set(new User(res.body as IUser));
        }
        return res;
      }));
  }

  forgotStart(email: string): Observable<HttpResponse<IUser>> {
    const data: UpdateUserRequest = {
      id: email,
      field: '',
      value: ''
    };
    const url = this.authUrl + '/forgot';
    return this.http.put<IUser>(url, data, {observe: 'response'});
  }

  forgotChange(email: string, token: string, passwd: string)
    : Observable<HttpResponse<IUser>> {

    const data: UpdateUserRequest = {
      id: email,
      field: token,
      value: passwd
    };
    const url = this.authUrl + '/forgot2';
    return this.http.put<IUser>(url, data, {observe: 'response'});
  }
}
