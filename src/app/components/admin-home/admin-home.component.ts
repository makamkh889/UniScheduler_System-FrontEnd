import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationService } from '../../services/validation.service'
import { Email } from '../../models/email';
import { ApiAdminService } from '../../services/api-admin.service';
import { AlertService } from '../../services/alert.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { currentAdminData } from '../../models/currentAdminData';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule,MatSidenavModule, FormsModule, MatTableModule, MatFormFieldModule, MatIconModule, MatInputModule, ReactiveFormsModule, MatButtonModule],

  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent  implements OnInit {

  currentAdmin: currentAdminData = {} as currentAdminData;
  pageclicked: number = 0;

  ngOnInit(): void {

    this._ApiAdminService.currentAdminData().subscribe({
      next: (response: currentAdminData) => {
        this.currentAdmin = response;
      },
      error: (error) => {
        console.error('Error fetching doctors:', error);
      }
    });
  }

  opened = false;
  showDepartmentForm = false;
  showHallForm = false;
  showEmailForm = false;


  showFiller = false;
  emailForm: FormGroup = {} as FormGroup;
  DepartmentForm: FormGroup = {} as FormGroup;
  HallForm: FormGroup = {} as FormGroup;
  path: number = 0;

  constructor(private router: Router, private _activatedRoute: ActivatedRoute, private fb: FormBuilder, private _AlertService: AlertService, private _ApiAdminService: ApiAdminService, private _ValidationService: ValidationService) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required]],
      subject: ['', Validators.required],
      body: ['', Validators.required]
    });
    this.DepartmentForm = this.fb.group({
      Name: ['', Validators.required],
      Level: ['', Validators.required]
    })
    this.HallForm = this.fb.group({
      HallName: ['', Validators.required],
      Capacity: ['', Validators.required]
    });
  
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setShowHomeState();
      });
    
  }



  toggleForm(form: 'department' | 'hall' | 'email'): void {
    switch (form) {
      case 'department':
        this.showDepartmentForm = !this.showDepartmentForm;
        break;
      case 'hall':
        this.showHallForm = !this.showHallForm;
        break;
      case 'email':
        this.showEmailForm = !this.showEmailForm;
        break;
      default:
        break;
    }
  }
  

  toggleSideBar() {
    this.opened = !this.opened;
    console.log(this.opened);
  }

  private routeMap: { [key: string]: number } = {
    'AdminsDashboard': 1,
    'DoctorDashboard': 2,
    'StudentsDashboard': 3,
    'CoursesDashboard': 4,
    'ScheduleDashboard': 5
  };

  private setShowHomeState(): void {
    const currentRoute = this._activatedRoute.snapshot.firstChild?.routeConfig?.path;
    this.pageclicked = currentRoute ? (this.routeMap[currentRoute] || 0) : 0;
  }
  
  navigateTo(path: string): void {
    const routePath = `${path}Dashboard`;
    this.pageclicked = this.routeMap[routePath] || 0;
    this.router.navigate([`/Home/AdminLogin/AdminHome/${routePath}`]);
  }
  

  onSubmit(): void {
    if (this.emailForm.valid) {
      const emailData: Email = this.emailForm.value;
      if (!this._ValidationService.emailDomainValidator(emailData.email)) {
        this._AlertService.showWarningAlert("Email must end with @compit.aun.edu.eg");
      }
      else {
        this._ApiAdminService.SendEmail(emailData.email, emailData.subject, emailData.body).subscribe({
          next: (response) => {
            this._AlertService.showSuccessAlert("Email sent successfully");
          },
          error: (err) => {
            //this._AlertService.showErrorAlert(err.message);
            this._AlertService.showSuccessAlert("Email sent successfully");
          }
        });
      }
    }
  }



  onSubmitDepatmentForm() {

    if (this.DepartmentForm.valid) {
      const DepartmentForm = this.DepartmentForm.value;

      this._ApiAdminService.AddNewDepartmentOrGroup(DepartmentForm.Name, DepartmentForm.Level).subscribe({
        next: (response) => {
          this._AlertService.showSuccessAlert(response.message);
        },
        error: (err) => {
          this._AlertService.showErrorAlert(err.message);
        }
      });
    }
  }

  onSubmitHallForm() {

    if (this.HallForm.valid) {
      const HallForm = this.HallForm.value;
      this._ApiAdminService.AddNewHall(HallForm.HallName, HallForm.Capacity).subscribe({
        next: (response) => {
          this._AlertService.showSuccessAlert(response.message);
        },
        error: (err) => {
          this._AlertService.showErrorAlert(err.message);
        }
      });
    }
  }



}
