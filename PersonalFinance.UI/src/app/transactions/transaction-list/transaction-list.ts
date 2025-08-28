import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Transaction } from '../transaction.models';
import { TransactionService } from '../transaction';
import { MaterialModule } from '../../material/material-module';
import { MatDialog } from '@angular/material/dialog'; 
import { TransactionFormComponent } from '../transaction-form/transaction-form';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    CurrencyPipe
  ],
  templateUrl: './transaction-list.html',
  styleUrls: ['./transaction-list.scss']
})
export class TransactionListComponent implements OnInit, AfterViewInit {
  // Columns to display in the table. The names must match the 'matColumnDef' in the HTML.
  displayedColumns: string[] = ['date', 'title', 'categoryName', 'amount', 'status', 'actions'];
  
  // The data source for the table
  dataSource = new MatTableDataSource<Transaction>();

  // Using @ViewChild to get a reference to the sort and paginator components from the template
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private transactionService: TransactionService,private dialog: MatDialog ) { }

   onDeleteTransaction(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { 
        title: "Confirm Deletion",
        message: "Are you sure you want to delete this transaction?" 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Only proceed if the user clicked "Yes" (result is true)
      if (result) {
        this.transactionService.deleteTransaction(id).subscribe({
          next: () => {
            this.loadTransactions(); // Refresh the table
            // Optionally, show a success snackbar here
          },
          error: (err) => console.error('Error deleting transaction:', err)
        });
      }
    });
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  ngAfterViewInit(): void {
    // After the view has been initialized, we can connect the sort and paginator to the data source
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadTransactions(): void {
    this.transactionService.getTransactions().subscribe({
      next: (transactions) => {
        this.dataSource.data = transactions;
        console.log('Transactions loaded:', transactions);
      },
      error: (err) => console.error('Error loading transactions:', err)
    });
  }
   openAddTransactionDialog(): void {
    const dialogRef = this.dialog.open(TransactionFormComponent, {
      width: '500px',
      data: { transaction: null } // We pass null for 'create' mode
    });

    dialogRef.afterClosed().subscribe(result => {
      // If the dialog returned a result (meaning a transaction was created)
      if (result) {
        this.loadTransactions(); // Reload the table data
      }
    });
  }
  openEditTransactionDialog(transaction: Transaction): void {
  const dialogRef = this.dialog.open(TransactionFormComponent, {
    width: '500px',
    // We pass the transaction data of the clicked row to the dialog
    data: { transaction: transaction }
  });

  dialogRef.afterClosed().subscribe(result => {
    // If the dialog returns a result, it means the form was submitted successfully
    if (result) {
      this.loadTransactions(); // Reload the table to show the updated data
    }
  });
}
}