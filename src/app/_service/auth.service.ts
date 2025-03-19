import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4200/users';
  private isUserLoggedIn = false;

  constructor(private http: HttpClient, private router : Router) {}

  register(email: string, password: string, fullName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password, fullName});
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  logout(): void {
    localStorage.removeItem('authToken'); // ✅ Remove authentication token
    this.router.navigateByUrl('/login'); // ✅ Redirect to login page
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken'); // ✅ Returns true if token exists
  }

  getCurrentUserId(): number | null {
    const token = localStorage.getItem('authToken');
    if (!token) return null; // No user is logged in
    const userId = token.split('-').pop(); // Extract user ID from token
    return userId ? Number(userId) : null;
  }

  verifyEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify`, { email });
  }



}
