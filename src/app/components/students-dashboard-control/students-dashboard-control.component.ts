import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Student } from '../../models/student';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator } from '@angular/material/paginator';
import { DragAndDropDirectiveDirective } from '../../../directives/drag-and-drop-directive.directive'; // Adjust path as per your project structure
import { ApiAdminService } from '../../services/api-admin.service';
import { AlertService } from '../../services/alert.service';
import { ValidationService } from '../../services/validation.service';
import { StudentData } from '../../models/student-data';


@Component({
  selector: 'app-students-dashboard-control',
  standalone: true,
  imports: [CommonModule, DragAndDropDirectiveDirective, MatSelectModule, MatPaginator, MatCardModule, FormsModule, MatTableModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './students-dashboard-control.component.html',
  styleUrl: './students-dashboard-control.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class StudentsDashboardControlComponent implements OnInit {

  constructor(private fb: FormBuilder, private _ValidationService: ValidationService, private _ApiAdminService: ApiAdminService, private _AlertService: AlertService) { }

  fileName = '';
  studentForm: FormGroup = {} as FormGroup;
  STUDENT_DATA: StudentData[] = [];
  status: "initial" | "uploading" | "success" | "fail" = "initial"; // Variable to store file status
  file: File | null = null; // Variable to store file


  displayedColumns: string[] = ['name', 'academicNumber', 'nationalId', 'email', 'department', 'gpa', 'Actions'];
  dataSource = new MatTableDataSource(this.STUDENT_DATA);
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: StudentData | null = null;
  showAddStudentForm = false;
  newStudent: Student = { nationalId: '', name: '', email: '', academicNumber: '', department: '', level: 0, semester: 0 };
  FilterBySemester: number = 0;
  FilterByDepartment: string = '';
  AppearTable: boolean = false;


  onFileSelected(event: any) {
    this.status = 'initial';
    const file: File = event.target.files[0];
    if (file) {
      // Check if the file type is Excel
      if (
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {

        this.fileName = file.name;
        const formData = new FormData();

        formData.append('file', file, file.name);

        const upload$ = this._ApiAdminService.uploadExcelsheetForStudent(formData);
        this.status = 'uploading';
        upload$.subscribe({
          next: (response) => {
            this.status = 'success';
          },
          error: (err) => {
            console.log(err.message);
            this.status = 'fail';
          }
        });
      } else {
        this._AlertService.showErrorAlert("Please select an Excel file (.xls or .xlsx)");
        event.target.value = null;
      }
    }
  }



  ngOnInit() {
    this.studentForm = this.fb.group({
      nationalId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      department: ['', Validators.required],
      semester: ['', Validators.required],
      level: ['', Validators.required],
      academicNumber: ['', Validators.required]
    });
  }


  toggleAddStudentForm() {
    this.showAddStudentForm = !this.showAddStudentForm;
  }


  onSubmit() {
    if (this.studentForm.valid) {
      const studentData = this.studentForm.value;
      if (!this._ValidationService.validateNationalId(studentData.nationalId)) {
        this._AlertService.showWarningAlert("National ID must be exactly 14 numeric characters long.");
      }
      else if (!this._ValidationService.emailDomainValidator(studentData.email)) {
        this._AlertService.showWarningAlert("Email must end with @compit.aun.edu.eg");
      }
      else {
        this._ApiAdminService.AddStudent(studentData).subscribe({
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


  filterBySemesterAndDepartment() {
    this._ApiAdminService.GetStudents(this.FilterBySemester*2, this.FilterByDepartment).subscribe({
      next: (student: StudentData[]) => {
        this.STUDENT_DATA = student;
        console.log(student)
        this.dataSource.data = this.STUDENT_DATA.slice(); // Refresh the dataSource
        console.log(this.dataSource.data)
      },
      error: (error) => {
        console.error('Error fetching Students:', error);
      }
    });
    this.AppearTable = true;
  }


  deleteStudent(student: string) {

    this._ApiAdminService.DeleteStudent(student).subscribe({
      next: (response) => {
        this.STUDENT_DATA = this.STUDENT_DATA.filter(a => a.AcademicNumber !== student)
        // Update the data source
        this.dataSource.data = this.STUDENT_DATA;
        this._AlertService.showSuccessAlert(response.message);
      },
      error: (err) => {
        this._AlertService.showErrorAlert(err.message || "An error occurred while deleting the admin.");
      }
    });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
