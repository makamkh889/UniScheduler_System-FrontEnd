import { Component } from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
  Router,
  NavigationEnd,
  ActivatedRoute,
} from '@angular/router';

import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  //  I hide Home (parent) in order to appear child when go to Login in page
  showHome: boolean = true;

  constructor(private router: Router, private _activatedRoute: ActivatedRoute) {
    // Listen to route changes to correctly set showHome
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setShowHomeState();
      });
  }

  navigateTo(path: string): void {
    this.showHome = false;
    this.router.navigate([`/Home/${path}`]);
  }

  private setShowHomeState(): void {
    // Retrieve the path of the current active child route (if any)
    const currentRoute =
      this._activatedRoute.snapshot.firstChild?.routeConfig?.path;
    // Set showHome to true if there's no current child route or the path is empty (i.e., we're at the Home route)

    this.showHome = !currentRoute || currentRoute === '';
  }
}
