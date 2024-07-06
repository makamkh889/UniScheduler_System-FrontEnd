import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { UserAuthenticationService } from '../../services/user-authentication.service';
import { UserAuth } from '../../models/user-auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-login',
  standalone: true,
  // must import RouterOutlet to make router work
  imports: [RouterLink, RouterOutlet, FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './doctor-login.component.html',
  styleUrl: './doctor-login.component.css',
})
export class DoctorLoginComponent implements OnInit {

  password: string = "";
  DoctorID: string = "";
  _UserAuth: UserAuth = {} as UserAuth;
  DoctorForm: FormGroup = {} as FormGroup;
  loginError = false;

  CheckLogin() {
    this._UserAuth.userName = this.DoctorID;
    this._UserAuth.password = this.password;
    this.authService.login('doctor', this._UserAuth).subscribe({
      next: (response) => {
        this.ShowDoctorLogin = false;
        this.router.navigate(['/Home/DoctorLogin/DoctorHome']);
      },
      error: (error) => {
        this.loginError = true;
      }
    });

  }

  ShowDoctorLogin: boolean = true;
  constructor(private authService: UserAuthenticationService, private fb: FormBuilder,private router: Router, private _activatedRoute: ActivatedRoute) {
    // Listen to route changes to correctly set showHome
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setShowHomeState();
      });
  }
  ngOnInit(): void {
    this.DoctorForm = this.fb.group({
      DoctorID: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  private setShowHomeState(): void {
    // Retrieve the path of the current active child route (if any)
    const currentRoute =
      this._activatedRoute.snapshot.firstChild?.routeConfig?.path;
    // Set showHome to true if there's no current child route or the path is empty (i.e., we're at the Home route)
    this.ShowDoctorLogin = !currentRoute || currentRoute === '';
  }
}

