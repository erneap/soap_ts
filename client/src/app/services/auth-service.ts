import { computed, inject, Injectable, signal } from '@angular/core';
import { APP_SETTINGS } from '../app.settings';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IUser, User } from 'soap-models/dist/users'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private settings = inject(APP_SETTINGS);
  private authUrl = `${this.settings.apiUrl}/user`;
  public accessToken = signal('');
  public refreshToken = signal('');
  public errorMsg = signal('');
  public user = signal(new User);
  isLoggedIn = computed(() => this.accessToken() !== '');

  constructor(
    private http: HttpClient
  ) {}

  authenticate(email: string, passwd: string): Observable<HttpResponse<IUser>> {
    return this.http.post<IUser>(this.authUrl + '/authenticate',
      { email: email, password: passwd },
      { observe: 'response' }).pipe(map(res => {
        this.user.set(new User(res.body as IUser));
        return res;
      }));
  }
}
