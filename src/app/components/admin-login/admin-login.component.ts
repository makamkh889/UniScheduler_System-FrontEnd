import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserAuthenticationService } from '../../services/user-authentication.service';
import { UserAuth } from '..//../models/user-auth';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, RouterOutlet],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent implements OnInit {


  ShowAdminLogin: boolean = true;
  password: string = "";
  AdminID: string = "";
  _UserAuth: UserAuth = {} as UserAuth;
  constructor(private authService: UserAuthenticationService, private router: Router, private _activatedRoute: ActivatedRoute) {
    // Listen to route changes to correctly set showHome
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setShowHomeState();
      });
  }
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }

  CheckLogin() {
    this._UserAuth.userName = this.AdminID;
    this._UserAuth.password = this.password;
    this.authService.login('admin', this._UserAuth).subscribe({
      next: (response) => {
        console.log('Login successful');
        this.ShowAdminLogin = false;
        this.router.navigate(['/Home/AdminLogin/AdminHome']);
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });

  }

  private setShowHomeState(): void {
    // Retrieve the path of the current active child route (if any)
    const currentRoute =
      this._activatedRoute.snapshot.firstChild?.routeConfig?.path;
    // Set showHome to true if there's no current child route or the path is empty (i.e., we're at the Home route)
    this.ShowAdminLogin = !currentRoute || currentRoute === '';
  }
}

