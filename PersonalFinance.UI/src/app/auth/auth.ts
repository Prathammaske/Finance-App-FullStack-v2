import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

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

    
    this.router.navigate(['/']);
  }
   private decodeToken(): any {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        return jwtDecode(token);
      } catch(Error) {
        return null;
      }
    }
    return null;
  }

  getRoles(): string[] | null {
    const decodedToken = this.decodeToken();
    if (!decodedToken) return null;

    const roleClaim = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    if (roleClaim) {
      return Array.isArray(roleClaim) ? roleClaim : [roleClaim];
    }
    return null;
  }

  isAdmin(): boolean {
    const roles = this.getRoles();
    return roles ? roles.includes('Admin') : false;
  }
  getUserName(): string | null {
    const decodedToken = this.decodeToken();
    // .NET Identity uses a long schema URL for the name claim
    return decodedToken ? decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] : null;
  }

  getUserEmail(): string | null {
    const decodedToken = this.decodeToken();
    // And another for the email claim
    return decodedToken ? decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] : null;
  }
}