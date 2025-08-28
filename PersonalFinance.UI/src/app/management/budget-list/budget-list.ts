import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material-module';
import { Budget, BudgetService } from '../../budgets/budget';
import { BudgetFormComponent } from '../budget-form/budget-form';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './budget-list.html',
  styleUrls: ['./budget-list.scss']
})
export class BudgetListComponent implements OnInit {
  displayedColumns: string[] = ['categoryName', 'amount', 'month', 'year', 'actions'];
  dataSource = new MatTableDataSource<Budget>();

  constructor(
    private budgetService: BudgetService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadBudgets();
  }

  loadBudgets(): void {
    this.budgetService.getBudgets().subscribe(data => {
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
      data: {
        title: 'Delete Budget',
        message: 'Are you sure you want to delete this budget?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.budgetService.deleteBudget(id).subscribe(() => this.loadBudgets());
      }
    });
  }
}