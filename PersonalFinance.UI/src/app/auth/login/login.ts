import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router,RouterLink } from '@angular/router'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth';
import { MaterialModule } from '../../material/material-module';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterLink 
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, 
    private router: Router,
    private snackBar: MatSnackBar 
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Sending to API:', this.loginForm.value);
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          console.log('Login successful!', response);
           // Store the token
          localStorage.setItem('authToken',response.token)
          //Navigate to the main application page (dashboard)
          this.router.navigate(['/']);
        },
        error: (err: any) => {
          console.error('Login failed:', err);
                    // USE THE SNACKBAR TO SHOW A USER-FRIENDLY MESSAGE
          this.snackBar.open('Login Failed: Invalid email or password.', 'Close', {
            duration: 5000, // Message disappears after 5 seconds
            verticalPosition: 'top', // Show it at the top of the screen
            panelClass: ['error-snackbar'] // Optional: for custom styling
          });

        }
      });
    }
  }
}