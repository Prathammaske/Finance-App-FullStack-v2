import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MaterialModule } from '../../material/material-module';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './admin-page.html',
})
export class AdminPageComponent implements OnInit {
  healthStatus$: Observable<any>;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.healthStatus$ = this.http.get('/api/admin/health', { headers });
  }

  ngOnInit(): void {}
}