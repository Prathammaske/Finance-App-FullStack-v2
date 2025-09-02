import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Account { id: number; name: string; }
export interface CreateOrUpdateAccount { name: string; }

@Injectable({ providedIn: 'root' })
export class AccountService {
  private apiUrl = 'api/accounts';
  constructor(private http: HttpClient) { }
  private getAuthHeaders = () => new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('authToken')}`);

  getAccounts = (): Observable<Account[]> => this.http.get<Account[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  createAccount = (data: CreateOrUpdateAccount): Observable<Account> => this.http.post<Account>(this.apiUrl, data, { headers: this.getAuthHeaders() });
  updateAccount = (id: number, data: CreateOrUpdateAccount): Observable<any> => this.http.put(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() });
  deleteAccount = (id: number): Observable<any> => this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
}