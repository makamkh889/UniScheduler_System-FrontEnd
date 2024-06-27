import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Admin } from '../../models/admin';
import { AdminView } from '../../models/admin-view';
import { ApiAdminService } from '../../services/api-admin.service';
import { AlertService } from '../../services/alert.service';
import { User } from '../../models/user';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admins-dashboard-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admins-dashboard-control.component.html',
  styleUrls: ['./admins-dashboard-control.component.css'],
})
export class AdminsDashboardControlComponent implements OnInit {

  admins: Admin[] = [];
  EditedAdmin: User = {} as User;
  changeMode: boolean = false;
  localAdmins: AdminView[] = [];
  newAdmin: User = {} as User;
  newAdminView: AdminView = {} as AdminView;
  route: any;

  constructor(private _AlertService: AlertService, private _activatedRoute: ActivatedRoute, private _ApiAdminService: ApiAdminService) { }


  getCurrentRoute() {
    // Use optional chaining to safely access routeConfig and path
    const currentRoute = this._activatedRoute.snapshot?.routeConfig?.path;
    return currentRoute;
  }


  ngOnInit(): void {
    console.log('Current Route:',this.getCurrentRoute());
    this._ApiAdminService.GetAllAdmins().subscribe({
      next: (admins: Admin[]) => {
        this.admins = admins;
        this.localAdmins = admins.map(admin => ({
          adminName: admin.adminName,
          nationalId: admin.nationalId,
          academicEmail: admin.academicEmail,
          editMode: false, // Initialize editMode as false for each AdminView object
          AddedMode: false
        }));
      },
      error: (error) => {
        console.error('Error fetching admins:', error);
      }
    });
  }

  addNewAdmin() {
    if (!this.changeMode) {
      this.localAdmins.push({
        adminName: '',
        nationalId: '',
        academicEmail: '',
        editMode: true,
        AddedMode: true
      });
      this.changeMode = true;
    }
    else {
      this._AlertService.showWarningAlert("You are not allowed to edit two fields at the same time");
    }
  }

  EditMode(admin: AdminView) {
    if (!this.EditedAdmin.name || !this.EditedAdmin.email) {
      this._AlertService.showWarningAlert("Please fill all the fields");
    } else if (!admin.academicEmail.endsWith('@compit.aun.edu.eg')) {
      this._AlertService.showWarningAlert("Email must end with @compit.aun.edu.eg");
    } else {
      this.EditedAdmin = {
        name: this.EditedAdmin.name,
        email: this.EditedAdmin.email,
        nationalId: admin.nationalId
      };
      this._ApiAdminService.EditAdmin(this.EditedAdmin).subscribe({
        next: (response) => {
          // Update localadmins with the edited admin details
          const index = this.localAdmins.findIndex(a => a.nationalId === admin.nationalId);
          if (index !== -1) {
            this._AlertService.showSuccessAlert(response.message);
            // Update the existing admin object
            this.localAdmins[index].adminName = this.EditedAdmin.name;
            this.localAdmins[index].academicEmail = this.EditedAdmin.email;
            this.localAdmins[index].nationalId = this.EditedAdmin.nationalId;
          }
          admin.editMode = false;
          admin.AddedMode = false;
          this.changeMode = false;
        },

        error: (err) => {
          this._AlertService.showErrorAlert(err.message || "Failed to update admin.");
        }
      });
    }
  }


  deleteAdmin(admin: AdminView) {
    this._ApiAdminService.DeleteAdmin(admin.nationalId).subscribe({
      next: (response) => {
        this.localAdmins = this.localAdmins.filter(a => a.nationalId !== admin.nationalId);
        this._AlertService.showSuccessAlert(response.message);
        admin.editMode = false;
        this.changeMode = false;
      },
      error: (err) => {
        this._AlertService.showErrorAlert(err.message || "An error occurred while deleting the admin.");
      }
    });
  }

  saveAdmin(newadmin: User, admin: AdminView) {
    if (!newadmin.name || !newadmin.email || !newadmin.nationalId) {
      this._AlertService.showWarningAlert("Please fill all the fields");
    } else if (newadmin.nationalId.length !== 14) {
      this._AlertService.showWarningAlert("National ID must be exactly 14 characters long.");
    } else if (!newadmin.email.endsWith('@compit.aun.edu.eg')) {
      this._AlertService.showWarningAlert("Email must end with @compit.aun.edu.eg");
    } else {
      this._ApiAdminService.AddNewAdmin(this.newAdmin).subscribe({
        next: (response) => {
          console.log("Ok");
          this._AlertService.showSuccessAlert(response.message);
          admin.editMode = false;
          admin.AddedMode = false;
          this.changeMode = false;
          admin.adminName = newadmin.name;
          admin.academicEmail = newadmin.email;
          admin.nationalId = newadmin.nationalId;
        },
        error: (err) => {
          this._AlertService.showErrorAlert(err.message);
        }
      });
    }
  }

  ChangeMode(admin: AdminView) {
    if (!this.changeMode) {
      admin.editMode = !admin.editMode;
      this.changeMode = !this.changeMode;
      this.EditedAdmin.name = admin.adminName
      this.EditedAdmin.email = admin.academicEmail
      this.EditedAdmin.nationalId = admin.nationalId
    }
    else {
      this._AlertService.showWarningAlert("You are not allowed to edit two fields at the same time");
    }
  }

  check(admin: AdminView) {
    if (admin.AddedMode) {
      this.changeMode = true;
      admin.editMode = true;
      this.newAdmin.name = this.EditedAdmin.name;
      this.newAdmin.nationalId = admin.nationalId;
      this.newAdmin.email = this.EditedAdmin.email;
      this.saveAdmin(this.newAdmin, admin);
    }
    else this.EditMode(admin);
  }

  cancelEdit(admin: AdminView) {
    if (admin.AddedMode) {
      this.localAdmins = this.localAdmins.filter(a => a !== admin);
      admin.editMode = false;
      this.changeMode = false;
      admin.AddedMode = false;
    } else {
      admin.editMode = false;
      this.changeMode = false;
    }

  }
}
