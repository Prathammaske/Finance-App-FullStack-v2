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
         backgroundColor: '#0D6EFD', 
        hoverBackgroundColor: '#0B5ED7' 
      }
    ]
  };
   public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { // X-Axis (Month names)
        ticks: {
          color: 'rgba(0, 0, 0, 0.7)' // Dark text color for the labels
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)' // Faint dark grid lines
        }
      },
      y: { // Y-Axis (Amount numbers)
        ticks: {
          color: 'rgba(0, 0, 0, 0.7)' // Dark text color for the numbers
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgba(0, 0, 0, 0.87)' // Dark text color for the legend
        }
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