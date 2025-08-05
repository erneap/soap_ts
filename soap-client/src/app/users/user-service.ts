import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObjectId } from 'mongodb';
import { map, Observable } from 'rxjs';
import { IUser, User } from 'soap-models/dist/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userUrl = 'http://localhost:4000/api/user';
  usersUrl = 'http://localhost:4000/api/users';

  constructor(
    private http: HttpClient
  ) {}

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.usersUrl);
  }

  authenticate(email: string, password: string): Observable<HttpResponse<IUser>> {
    return this.http.post<IUser>(this.userUrl + '/authenticate', {
      email: email, password: password
    }, {
      observe: 'response'
    }).pipe(map(res => {
      const accessToken = res.headers.get('authorization');
      console.log(`Authorization = ${accessToken}`);
      const refreshToken = res.headers.get('refreshToken');
      console.log(refreshToken);
      return res;
    }));
  }
}
