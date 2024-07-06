import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { UserAuthenticationService } from '../../services/user-authentication.service';
import { UserAuth } from '..//../models/user-auth';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MatSelectModule, MatPaginator, MatCardModule, FormsModule, MatTableModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminLoginComponent implements OnInit {

  loginError = false;
  ShowAdminLogin: boolean = true;
  password: string = "";
  AdminID: string = "";
  _UserAuth: UserAuth = {} as UserAuth;
  adminForm: FormGroup = {} as FormGroup;
  constructor(private fb: FormBuilder,private authService: UserAuthenticationService, private router: Router, private _activatedRoute: ActivatedRoute) {
    // Listen to route changes to correctly set showHome
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setShowHomeState();
      });
  }
  ngOnInit(): void {
    this.adminForm = this.fb.group({
      AdminID: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  CheckLogin() {
    this._UserAuth.userName = this.AdminID;
    this._UserAuth.password = this.password;
    this.authService.login('admin', this._UserAuth).subscribe({
      next: (response) => {
        // console.log('Login successful');
        this.ShowAdminLogin = false;
        this.loginError = false;
        this.router.navigate(['/Home/AdminLogin/AdminHome']);
      },
      error: (error) => {
        this.loginError = true;
        // console.error('Login failed', error);
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

