import { Component } from '@angular/core';
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
@Component({
  selector: 'app-halls-dashboard-control',
  standalone: true,
  imports: [MatSidenavModule, FormsModule, MatTableModule, MatFormFieldModule, MatIconModule, MatInputModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './halls-dashboard-control.component.html',
  styleUrl: './halls-dashboard-control.component.css'
})
export class HallsDashboardControlComponent {

  showFiller = false;
  emailForm: FormGroup = {} as FormGroup;
  DepartmentForm: FormGroup = {} as FormGroup;
  HallForm: FormGroup = {} as FormGroup;
  path: number = 0;

  constructor(private fb: FormBuilder, private _AlertService: AlertService, private _ApiAdminService: ApiAdminService, private _ValidationService: ValidationService) {
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
            this._AlertService.showSuccessAlert(response.message);
          },
          error: (err) => {
            this._AlertService.showErrorAlert(err.message);
          }
        });
      }
    }
  }



  onSubmitDepatmentForm() {

    if (this.DepartmentForm.valid) {
      const DepartmentForm= this.DepartmentForm.value;

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
      const HallForm=this.HallForm.value;
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