import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material-module';
import { CategoryListComponent } from '../category-list/category-list';
import { AccountListComponent } from '../account-list/account-list';
import { BudgetListComponent } from '../budget-list/budget-list';

@Component({
  selector: 'app-management-page',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    CategoryListComponent, 
    AccountListComponent,
    BudgetListComponent
  ],
  templateUrl: './management-page.html',
  styleUrls: ['./management-page.scss']
})
export class ManagementPageComponent { }