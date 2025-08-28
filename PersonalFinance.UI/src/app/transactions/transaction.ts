import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction, CreateOrUpdateTransaction } from './transaction.models';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'https://localhost:7244/api/transactions'; // <-- Use YOUR backend port

  constructor(private http: HttpClient) { }

  // Helper method to get the authentication headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // GET: Fetch all transactions
  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // POST: Create a new transaction
  createTransaction(transaction: CreateOrUpdateTransaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction, { headers: this.getAuthHeaders() });
  }

  // PUT: Update an existing transaction
  updateTransaction(id: number, transaction: CreateOrUpdateTransaction): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, transaction, { headers: this.getAuthHeaders() });
  }

  // DELETE: Delete a transaction
  deleteTransaction(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}