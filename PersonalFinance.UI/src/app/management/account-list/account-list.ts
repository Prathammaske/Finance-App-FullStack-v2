import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material-module';
import { Account, AccountService } from '../../accounts/account';
import { ManagementFormComponent } from '../management-form/management-form';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './account-list.html',
  styleUrls: ['./account-list.scss']
})
export class AccountListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'actions'];
  dataSource = new MatTableDataSource<Account>();

  constructor(
    private accountService: AccountService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe(data => {
      this.dataSource.data = data;
    });
  }

  openForm(item?: Account): void {
    const dialogRef = this.dialog.open(ManagementFormComponent, {
      width: '400px',
      data: { item, type: 'Account' } // <-- The only change is we pass 'Account' as the type
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const saveObservable = item
          ? this.accountService.updateAccount(item.id, result)
          : this.accountService.createAccount(result);
        
        saveObservable.subscribe(() => this.loadAccounts());
      }
    });
  }

  deleteItem(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Account',
        message: 'Are you sure you want to delete this account? This action cannot be undone.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.accountService.deleteAccount(id).subscribe(() => this.loadAccounts());
      }
    });
  }
}