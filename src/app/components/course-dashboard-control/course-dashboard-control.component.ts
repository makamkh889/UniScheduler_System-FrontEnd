import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ValidationService } from '../../services/validation.service';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseInfo } from '../../models/CourseInfo';
import { CourseInDepartment } from '../../models/CourseInDepartment';
import { AlertService } from '../../services/alert.service';
import { CourseInfoView } from '../../models/CourseInfoView';
import { CourseInDepartmentView } from '../../models/CourseInDepartmentView';
import { ApiAdminService } from '../../services/api-admin.service';

@Component({
  selector: 'app-course-dashboard-control',
  standalone: true,
  imports: [CommonModule, MatSelectModule, FormsModule, MatTableModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './course-dashboard-control.component.html',
  styleUrls: ['./course-dashboard-control.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
  
  
export class CourseDashboardControlComponent implements OnInit {

  @ViewChild('table', { static: false }) table!: MatTable<any>;
  @ViewChild('nameInput', { static: false }) nameInput!: ElementRef;
  ELEMENT_DATA: CourseInfoView[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  columnsToDisplay = ['courseName', 'courseCode', 'prerequisites', 'creditHour'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: CourseInfoView | null = null;
  addcourse: boolean = false;
  addcourseindepartments: boolean = false;
  newcourse: CourseInfo = {} as CourseInfo;
  newcourseindepartments: CourseInDepartment = {} as CourseInDepartment;
  
  constructor(private _AlertService: AlertService, private _ApiAdminService: ApiAdminService) {
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }


  ngOnInit() {
    this._ApiAdminService.CourseInfo().subscribe({
      next: (response: CourseInfo[]) => {
        this.ELEMENT_DATA = response.map(course => ({
          courseName: course.courseName,
          courseCode: course.courseCode,
          prerequisites: course.prerequisites,
          creditHour: course.creditHour,
          courses: course.courses.map(c => ({
            courseCode: c.courseCode,
            departmentName: c.departmentName,
            semaster: c.semaster,
            addcourseDepartment: false
          })),
          addCourse: false
        }));
        this.dataSource.data = this.ELEMENT_DATA;
      },
      error: (err) => {
        this._AlertService.showErrorAlert(err.message);
      }
    });
  }




  AddCourse() {
    if (!this.addcourse) {
      this.ELEMENT_DATA.push({
        courseName: '',
        courseCode: '',
        prerequisites: '',
        creditHour: 0,
        addCourse: true,
        courses: [],
      });
      this.addcourse = true;
      this.dataSource.data = this.ELEMENT_DATA; // Update the data source
      // Delay to ensure the new row is rendered before focusing and scrolling
      setTimeout(() => {
        this.nameInput.nativeElement.focus();
        this.nameInput.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 0);
    }
    else
      this._AlertService.showErrorAlert("You cannot add multiple courses simultaneously.");
  }

  Cancel(element: CourseInfoView) {
    this.ELEMENT_DATA.pop();
    this.dataSource.data = this.ELEMENT_DATA;
    element.addCourse = false;
    this.addcourse = false;
  }

  SaveCourse(course: CourseInfoView) {
    if (course.courseCode == "" || course.courseName == "" || course.prerequisites == '') {
      this._AlertService.showWarningAlert("Please fill all the fields");
    }
    else {
      this.newcourse.courseCode = course.courseCode;
      this.newcourse.courseName = course.courseName;
      this.newcourse.prerequisites = course.prerequisites;
      this.newcourse.courses = course.courses;
      this._ApiAdminService.AddnewCourse(this.newcourse).subscribe({
        next: (response) => {
          this.newcourse = {} as CourseInfo;
          this.addcourse = false;
          course.addCourse = false;
          this.dataSource.data = this.ELEMENT_DATA;
        },
        error: (err) => {
          this._AlertService.showErrorAlert(err.message);
        }
      });
    }
  }

  deleteCourse(course: CourseInfoView) {
    this._ApiAdminService.DeleteCourse(course.courseCode).subscribe({
      next: (response) => {
        const index = this.ELEMENT_DATA.findIndex(c => c.courseCode === course.courseCode);
        if (index !== -1) {
          this.ELEMENT_DATA.splice(index, 1);
          this.dataSource.data = this.ELEMENT_DATA;
        }
      },
      error: (err) => {
        this._AlertService.showErrorAlert(err.message);
      }
    });
  }



  toggleRow(element: CourseInfoView) {
    this.expandedElement = this.expandedElement === element ? null : element;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addCoursesinDepartment(course: CourseInfoView) {
    if (!this.addcourseindepartments) {
      course.courses.push({
        courseCode: '',
        departmentName: '',
        semaster: 0,
        addcourseDepartment: true,
      });
      this.addcourseindepartments = true;
      this.dataSource.data = this.ELEMENT_DATA;
    }
    else
      this._AlertService.showErrorAlert("You cannot add multiple courses in department simultaneously.");

  }


  Cancelfromdepartment(course: CourseInfoView, department: CourseInDepartmentView) {
    course.courses.pop();
    this.addcourseindepartments = false;
    department.addcourseDepartment = false;
  }

  SaveCourseindepartment(course: CourseInfoView, department: CourseInDepartmentView) {
    department.courseCode = course.courseCode;
    let index = this.ELEMENT_DATA.findIndex(c => c.courseCode === department.courseCode);
    if (department.departmentName == "") {
      this._AlertService.showWarningAlert("Please fill all the fields");
    }
    else if (this.ELEMENT_DATA[index].courses.filter(c => c.departmentName == department.departmentName).length > 1) {
      this._AlertService.showWarningAlert("You cannot add the same course more than once to the same department");
    }
    else {
      this.newcourseindepartments.courseCode = course.courseCode;
      this.newcourseindepartments.departmentName = department.departmentName;
      this.newcourseindepartments.semaster = department.semaster;
      this._ApiAdminService.AddnewDepartmentCourse(this.newcourseindepartments).subscribe({
        next: (response) => {
          this.newcourseindepartments = {} as CourseInDepartment;
          this.addcourseindepartments = true;
          department.addcourseDepartment = false;
          this.dataSource.data = this.ELEMENT_DATA;
        },
        error: (err) => {
          this._AlertService.showErrorAlert(err.message);
        }
      });

    }
  }

  DeleteCourseFromDepartment(department: CourseInDepartmentView) {
    this._ApiAdminService.DeleteDepartmentCourse(department.courseCode, department.departmentName).subscribe({
      next: (response) => {
        const index = this.ELEMENT_DATA.findIndex(c => c.courseCode === department.courseCode);
        if (index !== -1) {
          let indexD = this.ELEMENT_DATA[index].courses.findIndex(c => c.departmentName === department.departmentName);
          this.ELEMENT_DATA[index].courses.splice(indexD, 1);
        }
        this.dataSource.data = this.ELEMENT_DATA;
      },
      error: (err) => {
        this._AlertService.showErrorAlert(err.message);
      }
    });
  }
}
