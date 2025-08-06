import { HttpClient, HttpResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { ObjectId } from 'mongodb';
import { map, Observable } from 'rxjs';
import { IUser, User } from 'soap-models/dist/users';
import { APP_SETTINGS } from '../app.settings';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = inject(APP_SETTINGS).apiUrl;
  userUrl = `${this.apiUrl}/user`;
  usersUrl = `${this.apiUrl}/users`;
  private accessToken = signal('');
  private refreshToken = signal('');
  private user = signal(new User())
  isLoggedIn = computed(() => this.accessToken() !== '');

  constructor(
    private http: HttpClient
  ) {}

  getUsers(): Observable<HttpResponse<IUser[]>> {
    return this.http.get<IUser[]>(this.usersUrl, {
      observe: 'response'
    });
  }

  authenticate(email: string, password: string): Observable<HttpResponse<IUser>> {
    return this.http.post<IUser>(this.userUrl + '/authenticate', {
      email: email, password: password
    }, {
      observe: 'response'
    }).pipe(map(res => {
      this.user.set(new User(res.body as IUser));
      return res;
    }));
  }

  setAuthToken(token: string) {
    this.accessToken.set(token);
  }

  getAuthToken(): string {
    return this.accessToken();
  }

  setRefreshToken(token: string) {
    this.refreshToken.set(token);
  }

  getRefreshToken(): string {
    return this.refreshToken();
  }

  getUser(): User | undefined {
    const user = this.user();
    if (user.email !== '') {
      return user;
    }
    return undefined;
  }

  logout() {
    this.accessToken.set('');
    this.refreshToken.set('');
    this.user.set(new User());
  }
}
