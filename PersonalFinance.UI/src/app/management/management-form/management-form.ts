import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material-module';

@Component({
  selector: 'app-management-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './management-form.html',
})
export class ManagementFormComponent {
  form: FormGroup;
  title: string;
  label: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ManagementFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item?: { id: number, name: string }, type: 'Category' | 'Account' }
  ) {
    this.title = data.item ? `Edit ${data.type}` : `Add New ${data.type}`;
    this.label = data.type;

    this.form = this.fb.group({
      name: [data.item?.name || '', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      // Return the form value, the dialog opener will handle saving it
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}