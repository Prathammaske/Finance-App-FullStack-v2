import { Component, OnDestroy, Renderer2, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MaterialModule } from './material/material-module';
import { LoaderComponent } from './core/loader/loader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MaterialModule, LoaderComponent],
  templateUrl: './app.html'
})
export class AppComponent implements OnDestroy {
  private routerSubscription: Subscription;
  private currentBodyClass: string | undefined;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.routerSubscription = this.router.events.pipe(
      // We only care about the NavigationEnd event
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      
      // Remove the previous class if it exists
      if (this.currentBodyClass) {
        this.renderer.removeClass(this.document.body, this.currentBodyClass);
      }
      
      // Get the data from the activated route's snapshot
      let route = this.router.routerState.snapshot.root;
      while (route.firstChild) {
        route = route.firstChild;
      }
      
      const bodyClass = route.data['bodyClass'];

      // Add the new class if it's defined on the route
      if (bodyClass) {
        this.renderer.addClass(this.document.body, bodyClass);
        this.currentBodyClass = bodyClass;
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up the subscription
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}