import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router'; 
import { MaterialModule } from '../../material/material-module';
import { AuthService } from '../../auth/auth';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, 
     RouterLink,
    MaterialModule  
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss']
})
export class LayoutComponent {

  constructor(private authService: AuthService) { }

  // Create a method that the button can call
  onLogout(): void {
    this.authService.logout();
  }
}