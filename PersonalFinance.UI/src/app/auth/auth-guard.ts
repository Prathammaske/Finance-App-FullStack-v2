import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';

// This is the new, functional way of creating route guards in modern Angular.
export const authGuard: CanActivateFn = (route, state) => {

  // Use the modern 'inject' function to get instances of our services
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if the user is authenticated
  if (authService.isAuthenticated()) {
    return true; // Yes, they are. Allow them to proceed to the route.
  } else {
    // No, they are not. Block them and redirect to the login page.
    router.navigate(['/login']);
    return false; // Deny access to the requested route.
  }
};