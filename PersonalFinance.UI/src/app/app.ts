import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './material/material-module'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MaterialModule 
  ],
  templateUrl: './app.html',  
  styleUrls: ['./app.scss']   
})
export class AppComponent {
  title = 'PersonalFinance.UI';
}