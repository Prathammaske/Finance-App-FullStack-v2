import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MaterialModule } from '../../material/material-module';
import { DashboardService } from '../dashboard'; // Note: For services, the filename might be dashboard.service.ts
import { DashboardSummary } from '../dashboard.models';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    CurrencyPipe
  ],
  templateUrl: './dashboard-page.html',
  styleUrls: ['./dashboard-page.scss']
})
export class DashboardPageComponent implements OnInit {
  public summary$: Observable<DashboardSummary | null> = of(null);


  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.summary$ = this.dashboardService.getDashboardSummary();
  }
}