import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../material/material-module';
import { DashboardService } from '../dashboard';
import { DashboardSummary } from '../dashboard.models';
import { SpendingChartComponent } from '../spending-chart/spending-chart'; // Corrected Path
import { NotificationDialogComponent } from '../../shared/notification-dialog/notification-dialog';
import { Observable, BehaviorSubject, switchMap } from 'rxjs';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, MaterialModule, CurrencyPipe, FormsModule, SpendingChartComponent],
  templateUrl: './dashboard-page.html',
  styleUrls: ['./dashboard-page.scss']
})
export class DashboardPageComponent implements OnInit {
  private refreshTrigger = new BehaviorSubject<void>(undefined);
  public summary$: Observable<DashboardSummary | null>;
  availableYears: number[] = [];
  selectedYear: number;
  months = [
    { value: 1, viewValue: 'January' }, { value: 2, viewValue: 'February' },
    { value: 3, viewValue: 'March' }, { value: 4, viewValue: 'April' },
    { value: 5, viewValue: 'May' }, { value: 6, viewValue: 'June' },
    { value: 7, viewValue: 'July' }, { value: 8, viewValue: 'August' },
    { value: 9, viewValue: 'September' }, { value: 10, viewValue: 'October' },
    { value: 11, viewValue: 'November' }, { value: 12, viewValue: 'December' }
  ];
  selectedMonth: number;

  constructor(
    private dashboardService: DashboardService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    const today = new Date();
    this.selectedYear = today.getFullYear();
    this.selectedMonth = today.getMonth() + 1;
    for (let i = 0; i < 5; i++) {
      this.availableYears.push(this.selectedYear - i);
    }
    this.summary$ = this.refreshTrigger.pipe(
      switchMap(() => this.dashboardService.getDashboardSummary(this.selectedMonth, this.selectedYear))
    );
  }

  ngOnInit(): void {
    this.refreshTrigger.next();
  }

  onFilterChange(): void {
    this.refreshTrigger.next();
  }

  onCheckNotifications(): void {
    this.dashboardService.triggerNotificationCheck().subscribe((response: any) => {
      this.dialog.open(NotificationDialogComponent, {
        width: '500px',
        data: { notifications: response.notifications }
      });
    });
  }
}