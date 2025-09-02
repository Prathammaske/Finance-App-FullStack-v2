import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TransactionService } from '../transaction';
import { TransactionType, TransactionStatus, Transaction } from '../transaction.models';
import { Category, CategoryService } from '../../categories/category';
import { Account, AccountService } from '../../accounts/account';
import { MaterialModule } from '../../material/material-module';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './transaction-form.html',
  styleUrls: ['./transaction-form.scss']
})
export class TransactionFormComponent implements OnInit {
  transactionForm: FormGroup;
  categories$!: Observable<Category[]>;
  accounts$!: Observable<Account[]>;
  
  transactionType = TransactionType;
  transactionStatus = TransactionStatus;
  
  isEditMode = false;
  dialogTitle: string;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private accountService: AccountService,
    public dialogRef: MatDialogRef<TransactionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { transaction: Transaction | null }
  ) {
    
    this.isEditMode = !!this.data.transaction;
    this.dialogTitle = this.isEditMode ? 'Edit Transaction' : 'Add New Transaction';

    this.transactionForm = this.fb.group({
      title: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^\d*\.?\d{0,2}$/)]],
      date: [new Date(), Validators.required],
      type: [TransactionType.Expense, Validators.required],
      status: [TransactionStatus.Cleared, Validators.required],
      categoryId: ['', Validators.required],
      accountId: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories();
    this.accounts$ = this.accountService.getAccounts();

    
    if (this.isEditMode) {
      this.transactionForm.patchValue(this.data.transaction!);
    }
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) {
      return;
    }

    const transactionData = this.transactionForm.value;
    let saveObservable: Observable<any>;

    if (this.isEditMode) {
      
      saveObservable = this.transactionService.updateTransaction(this.data.transaction!.id, transactionData);
    } else {
      
      saveObservable = this.transactionService.createTransaction(transactionData);
    }

    saveObservable.subscribe({
      next: (response) => {
        
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error saving transaction:', err);
       
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(); 
  }
}