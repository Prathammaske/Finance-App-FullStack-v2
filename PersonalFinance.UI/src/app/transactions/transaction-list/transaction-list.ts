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
  
  displayedColumns: string[] = ['date', 'title', 'categoryName', 'amount', 'status', 'actions'];
  
 
  dataSource = new MatTableDataSource<Transaction>();

  
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
      
      if (result) {
        this.transactionService.deleteTransaction(id).subscribe({
          next: () => {
            this.loadTransactions(); 
            
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
}