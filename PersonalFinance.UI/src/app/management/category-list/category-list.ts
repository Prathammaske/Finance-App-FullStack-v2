import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material-module';
import { Category, CategoryService } from '../../categories/category';

import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';
import { ManagementFormComponent } from '../management-form/management-form';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './category-list.html',
  styleUrls: ['./category-list.scss']
})
export class CategoryListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'actions'];
  dataSource = new MatTableDataSource<Category>();

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.dataSource.data = data;
    });
  }
  
  
  
  openForm(item?: Category): void {
  const dialogRef = this.dialog.open(ManagementFormComponent, {
    width: '400px',
    data: { item, type: 'Category' } 
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      
      const saveObservable = item
        ? this.categoryService.updateCategory(item.id, result)
        : this.categoryService.createCategory(result);
      
      
      saveObservable.subscribe(() => this.loadCategories());
    }
  });
}
deleteItem(id: number): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '350px',
    data: {
      title: 'Delete Category',
      message: 'Are you sure you want to delete this category? This action cannot be undone.'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    
    if (result) {
      this.categoryService.deleteCategory(id).subscribe(() => {
        
        this.loadCategories();
      });
    }
  });
}
  
}