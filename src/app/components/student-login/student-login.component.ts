import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  Router,
  RouterLink,
  RouterOutlet,
  NavigationEnd,
  ActivatedRoute,
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';
import { UserAuth } from '../../models/user-auth';
import { UserAuthenticationService } from '../../services/user-authentication.service';

@Component({
  selector: 'app-student-login',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, FormsModule],
  templateUrl: './student-login.component.html',
  styleUrl: './student-login.component.css',
})
export class StudentLoginComponent {
  ShowStudentLogin!: boolean;
  _UserAuth: UserAuth = {} as UserAuth;
   StudentID: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private _alertService: AlertService,
    private authService: UserAuthenticationService
  ) {

    // Listen to route changes to correctly setshowHome to appear child or parnet
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setShowHomeState();
      });
    this.ShowStudentLogin = true;
  }


  checkLogin() {
    this._UserAuth.userName = this.StudentID;
    this._UserAuth.password = this.password;
  
    this.authService.login('student', this._UserAuth).subscribe({
      next: (response) => {
        console.log('Login successful');
        this.ShowStudentLogin = false;
        this.router.navigate(['/Home/StudentLogin/StudentHome']);
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });

  }

  private setShowHomeState(): void {
    const currentRoute =
      this._activatedRoute.snapshot.firstChild?.routeConfig?.path;
    this.ShowStudentLogin = !currentRoute || currentRoute === '';
  }
}
