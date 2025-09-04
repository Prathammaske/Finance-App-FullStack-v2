import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; 
import { MaterialModule } from '../../material/material-module';
import { AuthService } from '../../auth/auth';

@Component({
  selector: 'app-landing-page',
  imports: [CommonModule,RouterLink,MaterialModule],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss'
})
export class LandingPage {
  constructor(public authService : AuthService){}

}
