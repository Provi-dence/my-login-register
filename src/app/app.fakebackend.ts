import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

const users: any[] = JSON.parse(localStorage.getItem('users') || '[]'); // Simulated Database

export const fakeBackendInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const { url, method, body } = req;

  return of(null).pipe(
    mergeMap(() => {
      // Register User
      if (url.endsWith('/users/register') && method === 'POST') {
        return registerUser(body);
      }

      // Login User
      if (url.endsWith('/users/login') && method === 'POST') {
        return loginUser(body);
      }

      // Pass through other requests
      return next(req);
    }),
    materialize(),
    delay(500), // Simulate server response time
    dematerialize()
  );
};

// Simulated User Registration
function registerUser(body: any) {
  const { email, password, fullName } = body;
  
  if (users.find(x => x.email === email)) {
    return throwError(() => new Error('Email already registered'));
  }

  const newUser = { id: users.length + 1, email, password, fullName };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  return of(new HttpResponse({ status: 200, body: { message: 'User registered successfully' } }));
}

// Simulated User Login
function loginUser(body: any) {
  const { email, password } = body;
  const user = users.find(x => x.email === email && x.password === password);

  if (!user) {
    return throwError(() => new Error('Invalid email or password'));
  }

  const token = `fake-jwt-token-${user.id}`;
  localStorage.setItem('authToken', token);

  return of(new HttpResponse({ status: 200, body: { message: 'Login successful', token } }));
}
