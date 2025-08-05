import { computed, inject, Injectable, signal } from '@angular/core';
import { APP_SETTINGS } from '../general/app.settings';
import { map, Observable, of } from 'rxjs';
import { IUser, User } from 'soap-models/dist/users';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessToken = signal('');
  private user: User = new User();
  private userUrl = inject(APP_SETTINGS).apiUrl + '/user';
  isLoggedIn = computed(() => this.accessToken() !== '');
  
  constructor(
  ) {
    console.log('authService');
  }

  login(email: string, password: string): Observable<void> {
    const authUrl = this.userUrl + '/authenticate';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const data = { email: email, password: password };
    //return this.http.post<IUser>(authUrl, data);
    return of();
  }
}
