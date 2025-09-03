import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardService } from '../dashboard';
import { MaterialModule } from '../../material/material-module';

@Component({
  selector: 'app-spending-chart',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    MaterialModule
  ],
  templateUrl: './spending-chart.html',
  styleUrls: ['./spending-chart.scss']
})
export class SpendingChartComponent implements OnInit {
  public barChartLegend = true;
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      { 
        data: [], 
        label: 'Total Monthly Expenses',
        backgroundColor: 'var(--accent-color, #20C997)',
        hoverBackgroundColor: '#1BAA80'
      }
    ]
  };
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      y: {
        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    },
    plugins: {
      legend: {
        labels: { color: 'rgba(255, 255, 255, 0.87)' }
      }
    }
  };

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.dashboardService.getSpendingTrend().subscribe(trendData => {
      if (trendData && trendData.length > 0) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        this.barChartData.labels = trendData.map(d => monthNames[d.month - 1]);
        this.barChartData.datasets[0].data = trendData.map(d => d.totalAmount);
        this.cdr.detectChanges();
      }
    });
  }
}