import { Component, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
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
  styleUrls: ['./layout.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // We are keeping this
})
export class LayoutComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  
  public isHandset = false;
  public isSidenavCollapsed = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public authService: AuthService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {
    this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        takeUntil(this.destroy$)
      ).subscribe(result => {
        // After we set the new value...
        this.isHandset = result;
        // ...we MUST manually tell Angular to check for changes.
        this.cdr.detectChanges();
      });
  }

  toggleMainSidenav(sidenav: MatSidenav): void {
    if (this.isHandset) {
      sidenav.toggle();
    } else {
      this.isSidenavCollapsed = !this.isSidenavCollapsed;
    }
  }

  closeSidenavOnMobile(sidenav: MatSidenav): void {
    if (this.isHandset) {
      sidenav.close();
    }
  }

  onLogout(): void {
    this.authService.logout();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}