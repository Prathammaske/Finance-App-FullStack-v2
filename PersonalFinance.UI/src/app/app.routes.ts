import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { DashboardPageComponent } from './dashboard/dashboard-page/dashboard-page';
import { TransactionListComponent } from './transactions/transaction-list/transaction-list';
import { ManagementPageComponent } from './management/management-page/management-page';
import { AdminPageComponent } from './admin/admin-page/admin-page';
import { authGuard } from './auth/auth-guard';
import { adminGuard } from './admin/admin-guard';
 import { LandingPage } from './home/landing-page/landing-page';                
export const routes: Routes = [
    {path: '', component: LandingPage},
{ path: 'login', component: LoginComponent },
{ path: 'register', component: RegisterComponent },
{
path: 'app',
component: LayoutComponent,
canActivate: [authGuard],
children: [
{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
{ path: 'dashboard', component: DashboardPageComponent,
        data: { bodyClass: 'dashboard-bg' } },
{ path: 'transactions', component: TransactionListComponent ,data: { bodyClass: 'transactions-bg' }},
{ path: 'management', component: ManagementPageComponent , data: { bodyClass: 'management-bg' }},
{ path: 'admin', component: AdminPageComponent, canActivate: [adminGuard],data: { bodyClass: 'admin-bg' }  }
]
},
{ path: '**', redirectTo: '' }
];