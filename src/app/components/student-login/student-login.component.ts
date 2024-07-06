import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  imports: [RouterLink, RouterOutlet,CommonModule, FormsModule, ReactiveFormsModule, FormsModule],
  templateUrl: './student-login.component.html',
  styleUrl: './student-login.component.css',
})
export class StudentLoginComponent implements OnInit {
  ShowStudentLogin!: boolean;
  _UserAuth: UserAuth = {} as UserAuth;
   StudentID: string = '';
  password: string = '';
  studentForm: FormGroup = {} as FormGroup;
  loginError = false;

  constructor(
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private _alertService: AlertService,
    private authService: UserAuthenticationService,
    private fb: FormBuilder
  ) {

    // Listen to route changes to correctly setshowHome to appear child or parnet
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setShowHomeState();
      });
    this.ShowStudentLogin = true;
  }

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      StudentID: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  checkLogin() {
    this._UserAuth.userName = this.StudentID;
    this._UserAuth.password = this.password;
  
    this.authService.login('student', this._UserAuth).subscribe({
      next: (response) => {
        console.log('Login successful');
        this.ShowStudentLogin = false;
        this.loginError = false;
        this.router.navigate(['/Home/StudentLogin/StudentHome']);
      },
      error: (error) => {
        this.loginError = true;
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
