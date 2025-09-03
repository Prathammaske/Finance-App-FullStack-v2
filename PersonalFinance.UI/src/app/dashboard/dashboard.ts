import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardSummary, MonthlySpending } from './dashboard.models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private dashboardApiUrl = '/api/dashboard';
  private notificationsApiUrl = '/api/notifications';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getDashboardSummary(month: number, year: number): Observable<DashboardSummary> {
    const headers = this.getAuthHeaders();
    const params = new HttpParams()
      .set('month', month.toString())
      .set('year', year.toString());

    return this.http.get<DashboardSummary>(this.dashboardApiUrl, { headers, params });
  }

  getSpendingTrend(): Observable<MonthlySpending[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<MonthlySpending[]>(`${this.dashboardApiUrl}/spending-trend`, { headers });
  }

  triggerNotificationCheck(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.notificationsApiUrl}/trigger-check`, {}, { headers });
  }
}