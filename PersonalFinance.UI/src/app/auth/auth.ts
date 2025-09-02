import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';

  constructor(private http: HttpClient,
    private router: Router
  ) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
  
register(userInfo: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/register`, userInfo);
}
   isAuthenticated(): boolean {
    
    
    const token = localStorage.getItem('authToken');
    return !!token; 
  }

   logout(): void {
    
    localStorage.removeItem('authToken');

    
    this.router.navigate(['/login']);
  }
}