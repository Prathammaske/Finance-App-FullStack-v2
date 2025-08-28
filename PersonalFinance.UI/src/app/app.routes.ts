import { Routes } from '@angular/router';

// Import all necessary components and the guard
import { LayoutComponent } from './core/layout/layout';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register'; // Assuming you've created this
import { DashboardPageComponent } from './dashboard/dashboard-page/dashboard-page';
import { TransactionListComponent } from './transactions/transaction-list/transaction-list';
import { ManagementPageComponent } from './management/management-page/management-page';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
    // =======================================================
    // Public Routes (Accessible without logging in)
    // =======================================================
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },

    // =======================================================
    // Private Routes (Protected by the Auth Guard)
    // =======================================================
    {
        // This is the main "shell" route. It renders the LayoutComponent
        // (toolbar + sidenav) and protects all its children with the authGuard.
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            // If the user navigates to the base path ('/'),
            // redirect them to the dashboard by default.
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

            // These routes render their components INSIDE the LayoutComponent's <router-outlet>
            { path: 'dashboard', component: DashboardPageComponent },
            { path: 'transactions', component: TransactionListComponent },
            { path: 'management', component: ManagementPageComponent }
        ]
    },

    // =======================================================
    // Wildcard Route (Handles any URL that doesn't match)
    // =======================================================
    {
        // This should always be the LAST route.
        // It redirects any unknown URL to the main page. The authGuard
        // on the main page will then decide if they see the dashboard or get
        // sent to the login screen.
        path: '**',
        redirectTo: ''
    }
];