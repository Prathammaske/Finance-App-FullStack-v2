import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../loader';
import { MaterialModule } from '../../material/material-module';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './loader.html',
  styleUrls: ['./loader.scss']
})
export class LoaderComponent {
  constructor(public loaderService: LoaderService) { }
}