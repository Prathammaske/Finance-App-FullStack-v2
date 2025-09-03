import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material-module';

@Component({
  selector: 'app-notification-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, MatDialogModule],
  templateUrl: './notification-dialog.html',
  styleUrls: ['./notification-dialog.scss']
})
export class NotificationDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { notifications: string[] }
  ) {}

  getIcon(notification: string): { name: string, class: string } {
    const lowerCaseNotification = notification.toLowerCase();
    if (lowerCaseNotification.startsWith('alert')) {
      return { name: 'error', class: 'alert' };
    }
    if (lowerCaseNotification.startsWith('warning')) {
      return { name: 'warning', class: 'warning' };
    }
    return { name: 'info', class: 'reminder' };
  }
}