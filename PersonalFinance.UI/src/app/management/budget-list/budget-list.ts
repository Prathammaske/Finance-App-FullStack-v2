import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material-module';
import { Budget, BudgetService } from '../../budgets/budget';
import { BudgetFormComponent } from '../budget-form/budget-form';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './budget-list.html',
  styleUrls: ['./budget-list.scss']
})
export class BudgetListComponent implements OnInit {
  displayedColumns: string[] = ['categoryName', 'amount', 'month', 'year', 'actions'];
  dataSource = new MatTableDataSource<Budget>();
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
    private budgetService: BudgetService,
    private dialog: MatDialog
  ) {
    const today = new Date();
    this.selectedYear = today.getFullYear();
    this.selectedMonth = today.getMonth() + 1;
    for (let i = 0; i < 5; i++) {
      this.availableYears.push(this.selectedYear - i);
    }
  }

  ngOnInit(): void {
    this.loadBudgets();
  }

  loadBudgets(): void {
    this.budgetService.getBudgets(this.selectedMonth, this.selectedYear).subscribe(data => {
      this.dataSource.data = data;
    });
  }
  
  openForm(item?: Budget): void {
    const dialogRef = this.dialog.open(BudgetFormComponent, {
      width: '450px',
      data: { item }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBudgets();
      }
    });
  }

  deleteItem(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Budget', message: 'Are you sure you want to delete this budget?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.budgetService.deleteBudget(id).subscribe(() => this.loadBudgets());
      }
    });
  }
}