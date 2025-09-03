import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
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
export class LayoutComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  
  public isHandset = false;
  public isSidenavCollapsed = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public authService: AuthService
  ) {
    // Subscribe to the breakpoint observer in the constructor.
    // When the screen size changes, this will update the 'isHandset' boolean.
    // Angular will automatically detect this change and update the view.
    this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        takeUntil(this.destroy$)
      ).subscribe(result => {
        this.isHandset = result;
      });
  }

  // A single, clean method for the menu button
  toggleMainSidenav(sidenav: MatSidenav): void {
    if (this.isHandset) {
      sidenav.toggle();
    } else {
      this.isSidenavCollapsed = !this.isSidenavCollapsed;
    }
  }

  // A method for the nav links
  closeSidenavOnMobile(sidenav: MatSidenav): void {
    if (this.isHandset) {
      sidenav.close();
    }
  }

  onLogout(): void {
    this.authService.logout();
  }
  
  // Clean up the subscription when the component is destroyed
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}