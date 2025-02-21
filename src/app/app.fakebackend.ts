import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  private users: any[] = JSON.parse(localStorage.getItem('users') || '[]'); // Simulated Database

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, body } = req;

    return of(null).pipe(
      mergeMap(() => {
        // Register User
        if (url.endsWith('/users/register') && method === 'POST') {
          return this.registerUser(body);
        }

        // Login User
        if (url.endsWith('/users/login') && method === 'POST') {
          return this.loginUser(body);
        }

        // Pass through other requests
        return next.handle(req);
      }),
      materialize(),
      delay(500), // Simulate server response time
      dematerialize()
    );
  }

  // Simulated User Registration
  private registerUser(body: any) {
    const { email, password } = body;
    
    if (this.users.find(x => x.email === email)) {
      return throwError(() => new Error('Email already registered'));
    }

    const newUser = { id: this.users.length + 1, email, password };
    this.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(this.users));

    return of(new HttpResponse({ status: 200, body: { message: 'User registered successfully' } }));
  }

  // Simulated User Login
  private loginUser(body: any) {
    const { email, password } = body;
    const user = this.users.find(x => x.email === email && x.password === password);
  
    if (!user) {
      return throwError(() => new Error('Invalid email or password'));
    }
  
    // Generate a fake token (in real life, this would be from a backend)
    const token = `fake-jwt-token-${user.id}`;
  
    // Store token in localStorage (simulating real auth behavior)
    localStorage.setItem('authToken', token);
  
    return of(new HttpResponse({ 
      status: 200, 
      body: { message: 'Login successful', token } 
    }));
  }  
}
