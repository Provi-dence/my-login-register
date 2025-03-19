import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

const users: any[] = JSON.parse(localStorage.getItem('users') || '[]'); // Simulated Database

export const fakeBackendInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const { url, method, body } = req;

  return of(null).pipe(
    mergeMap(() => {
      if (url.endsWith('/users/register') && method === 'POST') {
        return registerUser(body);
      }

      if (url.endsWith('/users/login') && method === 'POST') {
        return loginUser(body);
      }

      if (url.endsWith('/users') && method === 'GET') {
        return getUsers();
      }

      if (url.endsWith('/users/verify') && method === 'POST') {
        return verifyUser(body);
      }


      return next(req);
    }),
    materialize(),
    delay(500), // Simulate server response time
    dematerialize()
  );
};

// 🟢 Simulated User Registration
function registerUser(body: any) {
  const { email, password, fullName } = body;

  if (users.find(x => x.email === email)) {
    return throwError(() => new Error('Email already registered'));
  }

  const newUser = {
    id: users.length + 1,
    email,
    password,
    fullName,
    isVerified: false // User is not verified initially
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  return of(new HttpResponse({ status: 200, body: { message: 'User registered successfully. Please verify your email before logging in.' } }));
}


// 🔵 Simulated User Login
function loginUser(body: any) {
  const { email, password } = body;
  const user = users.find(x => x.email === email && x.password === password);

  if (!user) {
    return throwError(() => new Error('Invalid email or password'));
  }

  if (!user.verified) {
    return of(new HttpResponse({
      status: 400,
      body: { message: 'Email not verified', user: { verified: false } }
    }));
  }

  const token = `fake-jwt-token-${user.id}`;
  localStorage.setItem('authToken', token);

  return of(new HttpResponse({
    status: 200,
    body: {
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, fullName: user.fullName, verified: user.verified }
    }
  }));
}



// 🟢 Simulated Email Verification
function verifyUser(body: any) {
  const { email } = body;
  const user = users.find(x => x.email === email);

  if (!user) {
    return throwError(() => new Error('User not found.'));
  }

  user.verified = true; // ✅ Set user as verified
  localStorage.setItem('users', JSON.stringify(users));

  return of(new HttpResponse({ status: 200, body: { message: 'Email verified successfully' } }));
}


// 🟠 Simulated Get Users
function getUsers() {
  return of(new HttpResponse({ status: 200, body: users }));
}
