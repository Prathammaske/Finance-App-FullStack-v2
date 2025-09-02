import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { MaterialModule } from '../../material/material-module';
import { Budget, BudgetService } from '../../budgets/budget';
import { Category, CategoryService } from '../../categories/category';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './budget-form.html',
  styleUrls: ['./budget-form.scss']
})
export class BudgetFormComponent implements OnInit {
  budgetForm: FormGroup;
  categories$!: Observable<Category[]>;
  dialogTitle: string;
  isEditMode: boolean;
  
  // Hardcoded months for the dropdown
  months = [
    { value: 1, viewValue: 'January' }, { value: 2, viewValue: 'February' },
    { value: 3, viewValue: 'March' }, { value: 4, viewValue: 'April' },
    { value: 5, viewValue: 'May' }, { value: 6, viewValue: 'June' },
    { value: 7, viewValue: 'July' }, { value: 8, viewValue: 'August' },
    { value: 9, viewValue: 'September' }, { value: 10, viewValue: 'October' },
    { value: 11, viewValue: 'November' }, { value: 12, viewValue: 'December' }
  ];

  constructor(
    private fb: FormBuilder,
    private budgetService: BudgetService,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<BudgetFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item: Budget | null },private snackBar: MatSnackBar
  ) {
    this.isEditMode = !!this.data.item;
    this.dialogTitle = this.isEditMode ? 'Edit Budget' : 'Add New Budget';

    this.budgetForm = this.fb.group({
      categoryId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      month: [new Date().getMonth() + 1, Validators.required],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(2000)]]
    });
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories();

    if (this.isEditMode) {
      this.budgetForm.patchValue(this.data.item!);
    }
  }

  onSubmit(): void {
    if (this.budgetForm.invalid) {
      return;
    }

    const budgetData = this.budgetForm.value;
    const saveObservable = this.isEditMode
      ? this.budgetService.updateBudget(this.data.item!.id, budgetData)
      : this.budgetService.createBudget(budgetData);

    saveObservable.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: any) => {
      console.error('Error saving budget', err);
      
      const errorMessage = err.error?.message || 'An unexpected error occurred. Please try again.';
      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}