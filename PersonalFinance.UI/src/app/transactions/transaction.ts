import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction, CreateOrUpdateTransaction } from './transaction.models';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = '/api/transactions'; 

  constructor(private http: HttpClient) { }

  
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  
  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

 
  createTransaction(transaction: CreateOrUpdateTransaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction, { headers: this.getAuthHeaders() });
  }

  
  updateTransaction(id: number, transaction: CreateOrUpdateTransaction): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, transaction, { headers: this.getAuthHeaders() });
  }

  
  deleteTransaction(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
  exportTransactions(): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/export`, {
    headers: this.getAuthHeaders(),
    responseType: 'blob' // This is crucial for file downloads
  });
}
}