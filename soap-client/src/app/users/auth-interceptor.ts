import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { UserService } from './user-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  const accessToken = userService.getAuthToken();
  const refreshToken = userService.getRefreshToken();
  const authReq = req.clone({
    setHeaders: {authorization: accessToken, refreshToken: refreshToken }
  })
  return next(authReq).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        const accessToken = event.headers.get('authorization');
        const refreshToken = event.headers.get('refreshToken');
        if (accessToken && accessToken !== null) {
          userService.setAuthToken(accessToken);
        }
        if (refreshToken && refreshToken !== null) {
          userService.setRefreshToken(refreshToken);
        }
      }
    })
  );
};
