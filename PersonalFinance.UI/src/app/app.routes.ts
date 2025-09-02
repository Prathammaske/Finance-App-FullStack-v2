import { Routes } from '@angular/router';

import { LayoutComponent } from './core/layout/layout';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register'; 
import { DashboardPageComponent } from './dashboard/dashboard-page/dashboard-page';
import { TransactionListComponent } from './transactions/transaction-list/transaction-list';
import { ManagementPageComponent } from './management/management-page/management-page';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [

    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },

   
    {
        
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
           
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

            { path: 'dashboard', component: DashboardPageComponent },
            { path: 'transactions', component: TransactionListComponent },
            { path: 'management', component: ManagementPageComponent }
        ]
    },

   
    {
        
        path: '**',
        redirectTo: ''
    }
];