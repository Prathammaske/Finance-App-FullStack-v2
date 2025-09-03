import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material-module';
import { Transaction } from '../transaction.models';
import { TransactionService } from '../transaction';
import { Category, CategoryService } from '../../categories/category';
import { Account, AccountService } from '../../accounts/account';
import { TransactionFormComponent } from '../transaction-form/transaction-form';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule, // <-- 2. ADD FormsModule to the imports array
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './transaction-list.html',
  styleUrls: ['./transaction-list.scss']
})
export class TransactionListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['date', 'title', 'categoryName', 'accountName', 'amount', 'status', 'actions'];
  dataSource = new MatTableDataSource<Transaction>();

  categories: Category[] = [];
  accounts: Account[] = [];
  filterValues = {
    searchTerm: '',
    categoryId: null as number | null,
    accountId: null as number | null
  };
  // --------------------------------------------------------

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private accountService: AccountService,
    private dialog: MatDialog
  ) {
    this.dataSource.filterPredicate = this.createFilter();
  }

  ngOnInit(): void {
    this.loadTransactions();
    this.loadFilterData(); 
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadTransactions(): void {
    this.transactionService.getTransactions().subscribe({
      next: (transactions) => {
        this.dataSource.data = transactions;
      },
      error: (err) => console.error('Error loading transactions:', err)
    });
  }

  // --- 5. ADD THE REMAINING FILTER LOGIC ---
  loadFilterData(): void {
    this.categoryService.getCategories().subscribe(data => this.categories = data);
    this.accountService.getAccounts().subscribe(data => this.accounts = data);
  }

  applyFilters(): void {
    this.dataSource.filter = JSON.stringify(this.filterValues);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createFilter(): (data: Transaction, filter: string) => boolean {
    const filterFunction = (data: Transaction, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);
      const searchTermMatch = searchTerms.searchTerm ?
        (
          data.title.toLowerCase().includes(searchTerms.searchTerm.toLowerCase()) ||
          !!(data.description && data.description.toLowerCase().includes(searchTerms.searchTerm.toLowerCase()))
        ) : true;
      const categoryMatch = searchTerms.categoryId ? data.categoryId === searchTerms.categoryId : true;
      const accountMatch = searchTerms.accountId ? data.accountId === searchTerms.accountId : true;
      return searchTermMatch && categoryMatch && accountMatch;
    };
    return filterFunction;
  }

  clearFilters(): void {
    this.filterValues = { searchTerm: '', categoryId: null, accountId: null };
    this.applyFilters();
  }
  
  onExport(): void {
    this.transactionService.exportTransactions().subscribe({
        next: (blob: Blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Transactions_${new Date().toISOString().slice(0, 10)}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        },
        error: (err: any) => { 
      console.error('Error exporting transactions:', err);
    }
    });
  }
  openAddTransactionDialog(): void {
  const dialogRef = this.dialog.open(TransactionFormComponent, {
    width: '500px',
    data: { transaction: null } 
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.loadTransactions(); 
    }
  });
}

openEditTransactionDialog(transaction: Transaction): void {
  const dialogRef = this.dialog.open(TransactionFormComponent, {
    width: '500px',
    data: { transaction: transaction } 
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.loadTransactions(); 
    }
  });
}

onDeleteTransaction(id: number): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: {
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this transaction?"
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) { // Only delete if the user confirmed
      this.transactionService.deleteTransaction(id).subscribe({
        next: () => {
          this.loadTransactions(); // Refresh the table after deletion
        },
        error: (err) => console.error('Error deleting transaction:', err)
      });
    }
  });
}
  

}