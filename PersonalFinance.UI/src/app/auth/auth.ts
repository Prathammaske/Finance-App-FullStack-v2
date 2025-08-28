import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7244/api/auth';

  constructor(private http: HttpClient,
    private router: Router
  ) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
  // ... inside AuthService class
register(userInfo: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/register`, userInfo);
}
   isAuthenticated(): boolean {
    // This is a simple but effective check.
    // If a token exists in localStorage, we'll consider the user authenticated.
    const token = localStorage.getItem('authToken');
    return !!token; // The '!!' operator is a neat trick to convert a string or null into a true/false boolean.
  }

   logout(): void {
    // 1. Remove the token from local storage
    localStorage.removeItem('authToken');

    // 2. Navigate the user back to the login page
    this.router.navigate(['/login']);
  }
}