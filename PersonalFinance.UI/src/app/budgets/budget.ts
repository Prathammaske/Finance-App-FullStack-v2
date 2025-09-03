import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Budget {
  id: number;
  amount: number;
  month: number;
  year: number;
  categoryId: number;
  categoryName: string;
}

export interface CreateOrUpdateBudget {
  amount: number;
  month: number;
  year: number;
  categoryId: number;
}

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private apiUrl = '/api/budgets'; 

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

   getBudgets(month?: number, year?: number): Observable<Budget[]> {
    let params = new HttpParams();
    if (month && year) {
      params = params.set('month', month.toString());
      params = params.set('year', year.toString());
    }
    // Pass the params object to the request.
    return this.http.get<Budget[]>(this.apiUrl, { headers: this.getAuthHeaders(), params: params });
  }

  createBudget(data: CreateOrUpdateBudget): Observable<Budget> {
    return this.http.post<Budget>(this.apiUrl, data, { headers: this.getAuthHeaders() });
  }

  updateBudget(id: number, data: CreateOrUpdateBudget): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() });
  }

  deleteBudget(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}