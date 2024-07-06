import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import { Doctor } from '../../models/doctor';
import { MatSelectModule } from '@angular/material/select';
import { DoctorView } from '../../models/doctor-view';
import { ApiDoctorService } from '../../services/api-doctor.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ValidationService } from '../../services/validation.service';
import { DoctorOptions } from '../../models/doctor-options';
import { DoctorOptionsView } from '../../models/doctor-options-view';
import { DoctorMainInfo } from '../../models/doctor-main-info';
import { ApiAdminService } from '../../services/api-admin.service';
import { AddEditDoctorOptions } from '../../models/add-edit-doctor-options';
import { ViewChild, ElementRef } from '@angular/core';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-doctor-dashboard-control',
  standalone: true,
  imports: [CommonModule, MatSelectModule, FormsModule, MatTableModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './doctor-dashboard-control.component.html',
  styleUrl: './doctor-dashboard-control.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class DoctorDashboardControlComponent implements OnInit {


  @ViewChild('table', { static: false }) table!: MatTable<any>;
  @ViewChild('nameInput', { static: false }) nameInput!: ElementRef;

  AddnewCourse: AddEditDoctorOptions = {} as AddEditDoctorOptions;
  AddnewDoctor: DoctorMainInfo = {} as DoctorMainInfo;
  newDoctorView: DoctorView = {} as DoctorView;
  newCourse: DoctorOptionsView = {} as DoctorOptionsView;
  days: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  times: string[] = ["08:00", "10:00", "12:00", "02:00", "04:00", "06:00"];
  timeDayOptions: string[] = [];
  ELEMENT_DATA: DoctorView[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  columnsToDisplay = ['Name', 'Department', 'Email', 'NationalId'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: DoctorView | null = null;

  // Mapping of full day names to their abbreviations
  dayMapping: { [key: string]: string } = {
    "Sunday": "sun",
    "Monday": "mon",
    "Tuesday": "teus",
    "Wednesday": "wed",
    "Thursday": "thurs"
  };

  // Reverse mapping for easy lookup
  abbreviationMapping: { [key: string]: string } = {
    "sun": "Sunday",
    "mon": "Monday",
    "teus": "Tuesday",
    "wed": "Wednesday",
    "thurs": "Thursday"
  };

  constructor(private _AlertService: AlertService,
    private _ApiAdminService: ApiAdminService, private _ValidationService: ValidationService) {
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.generateTimeDayOptions();
  }

  ngOnInit(): void {
    this._ApiAdminService.GetAllDocotrs().subscribe({
      next: (doctors: Doctor[]) => {
        this.ELEMENT_DATA = doctors.map(doctor => ({
          name: doctor.name,
          email: doctor.email,
          department: doctor.department,
          nationalId: doctor.nationalId,
          AddOption: false,
          courseNames: doctor.courseNames.map(course => ({
            AddCourseOption: false,
            EditCourseOption: false,
            courseName: course.courseName,
            gruop: course.gruop,
            option1: this.getDisplayValue(course.option1),
            option2: this.getDisplayValue(course.option2),
            option3: this.getDisplayValue(course.option3),
            courseCode: course.courseCode

          }))
        }));
        this.dataSource.data = this.ELEMENT_DATA; // Refresh the dataSource

      },
      error: (error) => {
        //console.error('Error fetching doctors:', error);
      }
    });
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  AddDoctor() {
    this.ELEMENT_DATA.push({
      name: '',
      nationalId: '',
      email: '',
      department: '',
      courseNames: [],
      AddOption: true,
    });
    this.dataSource.data = this.ELEMENT_DATA; // Update the data source


    // Delay to ensure the new row is rendered before focusing and scrolling
    setTimeout(() => {
      this.nameInput.nativeElement.focus();
      this.nameInput.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 0);
  }

  SaveDoctor(doctor: DoctorView) {
    if (doctor.name == "" || doctor.department == "" || doctor.email == "") {
      this._AlertService.showWarningAlert("Please fill all the fields");
    } else if (!this._ValidationService.validateNationalId(doctor.nationalId)) {
      this._AlertService.showWarningAlert("National ID must be exactly 14 numeric characters long.");
    }
    else if (!this._ValidationService.emailDomainValidator(doctor.email)) {
      this._AlertService.showWarningAlert("Email must end with @compit.aun.edu.eg");
    }
    else {
      this.AddnewDoctor.name = doctor.name;
      this.AddnewDoctor.nationalId = doctor.nationalId;
      this.AddnewDoctor.email = doctor.email;
      this.AddnewDoctor.department = doctor.department;
      this._ApiAdminService.AddDoctor(this.AddnewDoctor).subscribe({
        next: (response) => {
          this._AlertService.showSuccessAlert(response.message);
          doctor.AddOption = false;
          this.dataSource.data = this.ELEMENT_DATA;
        },
        error: (err) => {
          this._AlertService.showErrorAlert(err.message);
        }
      });
    }
  }

  Cancel(doctor: DoctorView) {
    doctor.AddOption = false;
    this.ELEMENT_DATA.pop();
    this.dataSource.data = this.ELEMENT_DATA;
  }

  DeleteDoctor(doctor: DoctorView) {
    this._ApiAdminService.DeleteDoctor(doctor.nationalId).subscribe({
      next: (response) => {
        this.ELEMENT_DATA = this.ELEMENT_DATA.filter(a => a.nationalId !== doctor.nationalId)
        // Update the data source
        this.dataSource.data = this.ELEMENT_DATA;
        this._AlertService.showSuccessAlert(response.message);
      },
      error: (err) => {
        this._AlertService.showErrorAlert(err.message || "An error occurred while deleting the admin.");
      }
    });

    // If the expanded element was deleted, collapse it
    if (this.expandedElement && this.expandedElement.nationalId === doctor.nationalId) {
      this.expandedElement = null;
    }
  }


  AddDoctorCourse(doctor: DoctorView) {
    doctor.courseNames.push({
      courseCode: '',
      courseName: '',
      option1: '',
      option2: "",
      option3: "",
      gruop: '',
      AddCourseOption: true,
      EditCourseOption: false
    });
    this.dataSource.data = this.ELEMENT_DATA;
  }

  SaveDoctorCourse(doctor: DoctorView, course: DoctorOptionsView) {
    if (course.courseCode == "" || course.option1 == "" || course.option2 == "" || course.option3 == "" || course.gruop == "") {
      this._AlertService.showWarningAlert("Please fill all the fields");
    }
    else {
      this.AddnewCourse.nationalId = doctor.nationalId;
      this.AddnewCourse.courseCode = course.courseCode;
      this.AddnewCourse.option1 = this.getStoredValue(course.option1);
      this.AddnewCourse.option2 = this.getStoredValue(course.option2);
      this.AddnewCourse.option3 = this.getStoredValue(course.option3);
      this.AddnewCourse.group = course.gruop;
      this._ApiAdminService.AddDoctorOptions(this.AddnewCourse).subscribe({
        next: (response) => {
          this._AlertService.showSuccessAlert(response.message);
          course.AddCourseOption = false;
          this.dataSource.data = this.ELEMENT_DATA;
        },
        error: (err) => {
          console.log(err.message);
          this._AlertService.showErrorAlert(err.message);
        }
      });
    }
  }

  CancelCourse(doctor: DoctorView, course: DoctorOptionsView) {

    const doctorIndex = this.ELEMENT_DATA.findIndex(d => d.nationalId === doctor.nationalId);
    if (doctorIndex !== -1) {
      const courseIndex = this.ELEMENT_DATA[doctorIndex].courseNames.findIndex(c => c.courseCode === course.courseCode);
      if (courseIndex !== -1) {
        if (course.EditCourseOption) {
          this.newCourse = this.ELEMENT_DATA[doctorIndex].courseNames[courseIndex];
          this.ELEMENT_DATA[doctorIndex].courseNames[courseIndex].EditCourseOption = false;
          course.EditCourseOption = false;
          course.AddCourseOption = false;
          this.dataSource.data = this.ELEMENT_DATA;
        }
        else {

          // Remove the course from the courseNames array
          this.ELEMENT_DATA[doctorIndex].courseNames.splice(courseIndex, 1);
        }
      }
    }
  }

  EditDoctorCourse(doctor: DoctorView, course: DoctorOptions) {
    if (course.option1 == "" || course.option2 == "" || course.option3 == "") {
      this._AlertService.showWarningAlert("Please fill all the fields");
    }
    else {
      this.AddnewCourse.nationalId = doctor.nationalId;
      this.AddnewCourse.courseCode = course.courseCode;
      this.AddnewCourse.option1 = this.getStoredValue(course.option1);
      this.AddnewCourse.option2 = this.getStoredValue(course.option2);
      this.AddnewCourse.option3 = this.getStoredValue(course.option3);
      this.AddnewCourse.group = course.gruop;
      this._ApiAdminService.UpdateDoctorOptions(this.AddnewCourse).subscribe({
        
        next: (response) => {
          this._AlertService.showSuccessAlert(response.message);
          const doctorIndex = this.ELEMENT_DATA.findIndex(d => d.nationalId === doctor.nationalId);
          if (doctorIndex !== -1) {
            const courseIndex = this.ELEMENT_DATA[doctorIndex].courseNames.findIndex(c => c.courseCode === course.courseCode && c.gruop == course.gruop);
            if (courseIndex !== -1) {
              this.newCourse = this.ELEMENT_DATA[doctorIndex].courseNames[courseIndex];
              this.ELEMENT_DATA[doctorIndex].courseNames[courseIndex].EditCourseOption = false;
              // If you are using Angular Material Table, you may need to refresh the dataSource
              this.dataSource.data = this.ELEMENT_DATA;
            }
          }
        },
        error: (err) => {
          console.log(err.message)
          this._AlertService.showErrorAlert(err.message);
        }
      });
    }
  }

  DeleteDoctorCourse(doctor: DoctorView, course: DoctorOptions) {
    this._ApiAdminService.DeleteDoctoroption(doctor.nationalId, course.courseCode, course.gruop).subscribe({
      next: (response) => {
        const doctorIndex = this.ELEMENT_DATA.findIndex(d => d.nationalId === doctor.nationalId);
        if (doctorIndex !== -1) {
          const courseIndex = this.ELEMENT_DATA[doctorIndex].courseNames.findIndex(c => c.courseCode === course.courseCode && c.gruop == course.gruop);
          if (courseIndex !== -1) {
            // Remove the course at the found index
            this.ELEMENT_DATA[doctorIndex].courseNames.splice(courseIndex, 1);
            // Refresh the data source
            this.dataSource.data = this.ELEMENT_DATA;
          }
        }
        this.dataSource.data = this.ELEMENT_DATA;
        this._AlertService.showSuccessAlert(response.message);
      },
      error: (err) => {
        this._AlertService.showErrorAlert(err.message || "An error occurred while deleting the admin.");
      }
    });

  }

  changeMode(doctor: DoctorView, course: DoctorOptionsView) {
    course.EditCourseOption = true;
  }
  check(doctor: DoctorView, course: DoctorOptionsView) {
    if (course.AddCourseOption && !course.EditCourseOption)
      this.SaveDoctorCourse(doctor, course)
    else if (!course.AddCourseOption && course.EditCourseOption)
      this.EditDoctorCourse(doctor, course)
  }

  generateTimeDayOptions() {
    this.days.forEach(day => {
      this.times.forEach(time => {
        this.timeDayOptions.push(`${time} ${day}`);
      });
    });
  }

  // Method to map stored abbreviated values to full display values
  getDisplayValue(storedValue: string): string {
    const [time, dayAbbreviation] = storedValue.split(" ");
    const fullDay = this.abbreviationMapping[dayAbbreviation];
    return `${time} ${fullDay}`;
  }

  // Method to map selected display value back to abbreviated stored value
  getStoredValue(displayValue: string): string {
    const [time, fullDay] = displayValue.split(" ");
    const dayAbbreviation = this.dayMapping[fullDay];
    return `${time} ${dayAbbreviation}`;
  }
}



