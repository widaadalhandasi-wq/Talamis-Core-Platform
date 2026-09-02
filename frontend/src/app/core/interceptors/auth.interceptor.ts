import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';
import { environment } from '@env/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Only attach the token to calls hitting our own API, never to third-party requests.
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const token = inject(AuthService).getToken();
  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
