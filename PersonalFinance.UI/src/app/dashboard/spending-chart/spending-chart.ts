import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
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
    MaterialModule,
    CurrencyPipe
  ],
  templateUrl: './spending-chart.html',
  styleUrls: ['./spending-chart.scss']
})
export class SpendingChartComponent implements OnInit {
  // We no longer need ChangeDetectorRef

  public barChartLegend = true;
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Total Monthly Expenses' }]
  };
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: 'rgba(0, 0, 0, 0.7)' }, grid: { color: 'rgba(0, 0, 0, 0.1)' } },
      y: { ticks: { color: 'rgba(0, 0, 0, 0.7)' }, grid: { color: 'rgba(0, 0, 0, 0.1)' } }
    },
    plugins: {
      legend: { labels: { color: 'rgba(0, 0, 0, 0.87)' } }
    }
  };

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.dashboardService.getSpendingTrend().subscribe(trendData => {
      if (trendData && trendData.length > 0) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        const newLabels = trendData.map(d => monthNames[d.month - 1]);
        const newData = trendData.map(d => d.totalAmount);

        this.barChartData = {
          labels: newLabels,
          datasets: [
            { 
              data: newData, 
              label: 'Total Monthly Expenses',
              backgroundColor: '#0D6EFD', 
              hoverBackgroundColor: '#0B5ED7' 
            }
          ]
        };
      }
    });
  }
}