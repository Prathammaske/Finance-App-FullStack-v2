import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category { id: number; name: string; }
export interface CreateOrUpdateCategory { name: string; }

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = '/api/categories';
  constructor(private http: HttpClient) { }
  private getAuthHeaders = () => new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('authToken')}`);

  getCategories = (): Observable<Category[]> => this.http.get<Category[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  createCategory = (data: CreateOrUpdateCategory): Observable<Category> => this.http.post<Category>(this.apiUrl, data, { headers: this.getAuthHeaders() });
  updateCategory = (id: number, data: CreateOrUpdateCategory): Observable<any> => this.http.put(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() });
  deleteCategory = (id: number): Observable<any> => this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
}