import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './material/material-module'; 
import { LoaderComponent } from './core/loader/loader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MaterialModule,
    LoaderComponent  
  ],
  templateUrl: './app.html',  
  styleUrls: ['./app.scss']   
})
export class AppComponent {
  title = 'PersonalFinance.UI';
}