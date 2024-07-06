import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; // Add this line
import { MatIconModule } from '@angular/material/icon'; // If using mat-icon
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { doctorHomeOptionsView } from '../../models/doctorHomeOptionsView';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AlertService } from '../../services/alert.service';
import { doctorSchedule } from '../../models/doctorSchedule';
import { DoctorOptions } from '../../models/doctor-options';
import { ApiDoctorService } from '../../services/api-doctor.service';
import { doctorHomeOptions } from '../../models/doctorHomeOptions';
import { EnrollDocotrCoruses } from '../../models/EnrollDocotrCoruses';
import { currentDoctorData } from '../../models/currentDoctorData';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'


@Component({
  selector: 'app-doctor-home',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule, CommonModule, MatSelectModule, FormsModule],
  templateUrl: './doctor-home.component.html',
  styleUrl: './doctor-home.component.css'
})
export class DoctorHomeComponent implements OnInit {

  currentDoctor: currentDoctorData = {} as currentDoctorData;
  ngOnInit() {
    this._ApiDoctorService.currentDoctorData().subscribe({
      next: (response: currentDoctorData) => {
        this.currentDoctor = response;
      },
      error: (error) => {
        console.error('Error fetching doctors:', error);
      }
    });

  }

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

  COURSE_DATA: doctorHomeOptionsView[] = [];
  option1: string = '';
  option2: string = '';
  option3: string = '';
  newoption: DoctorOptions = {} as DoctorOptions;
  AddnewCourse: EnrollDocotrCoruses = {} as EnrollDocotrCoruses;
  days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  times: string[] = ['08:00', '10:00', '12:00', '02:00', '04:00', '06:00'];
  timeDayOptions: string[] = [];
  myData: any = {}; // You can define a TypeScript interface for better type safety
  dataSource = new MatTableDataSource(this.COURSE_DATA);
  ShowOptionTable: boolean = false;
  ShowScheduleTable: boolean = false;
  courseSchedules: doctorSchedule[] = [];


  displayedColumns: string[] = ['courseName', 'courseCode', 'option1', 'option2', 'option3', 'gruop', 'EnrolledStudentsCount', 'actions'];
  displayedColumnsSchedule: string[] = ['time', 'Sunday', 'Monday', "Tuesday", 'Wednesday', 'Thursday'];

  constructor(private _AlertService: AlertService, private _ApiDoctorService: ApiDoctorService) {
    this.generateTimeDayOptions();
  }





  downloadPDF() {
    const doc = new jsPDF();
    interface Entry {
      name: string;
      department: string;
      hall: string;
    }


    const head = [['Time', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']];
    const times = ['08:00', '10:00', '12:00', '02:00', '04:00', '06:00'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

    const body = times.map(time => [
      time,
      ...days.map(day => {
        const entry: Entry = this.myData[day][time] || {}; // Initialize entry object

        // Example: Accessing properties, adjust as per your data structure
        let name = entry.name + "\n" || '';
        let department = entry.department + "\n" || '';
        let hall = entry.hall || '';
        if (name[0] == '-') {
          name = "\n";
          department = "\n";
          hall = " ";
        }
        let cellContent = "";
        if (name[0] == '\n') {
          cellContent = `${name} ${department} ${hall}`;
        }
        else
          cellContent = `Dr.${name} ${department} ${hall}`;
        return cellContent;
      })
    ]);



    autoTable(doc, {
      head: head,
      body: body,
      didDrawCell: (data) => {
        let raw = data.cell.raw;

        if (typeof raw === 'string' && raw.includes('\n')) {
          raw = "\n\n\n";
          const textPos = doc.getTextDimensions(raw);
          doc.setFontSize(10);
          doc.text(raw, data.cell.x + data.cell.padding('left'), data.cell.y + textPos.h / 2 + data.cell.padding('top'));
        }
      }
    });

    doc.save(`schedule ${this.currentDoctor.name} ${this.currentDoctor.department}.pdf`);
  }




  Register() {
    this._ApiDoctorService.GetDoctorCourses().subscribe({
      next: (doctors: doctorHomeOptions[]) => {
        this.ShowOptionTable = true;
        this.COURSE_DATA = doctors.map(doctor => ({
          courseName: doctor.courseName,
          courseCode: doctor.courseCode,
          gruop: doctor.gruop,
          option1: this.getDisplayValue(doctor.option1),
          option2: this.getDisplayValue(doctor.option2),
          option3: this.getDisplayValue(doctor.option3),
          AddCourseOption: false,
          EditCourseOption: false,
          EnrolledStudentsCount: 0,
        }))
        
        this.dataSource.data = this.COURSE_DATA;
      },
      error: (error) => {
        console.error('Error fetching doctors:', error);
      }
    });

  }


  CancelTable() {
    this.ShowOptionTable = false;
  }

  Schedule() {

    this._ApiDoctorService.GetDoctorSechdule().subscribe({
      next: (doctors: doctorSchedule[]) => {

        this.courseSchedules = doctors.map(doctor => ({
          name: doctor.name,
          department: doctor.department,
          hall: doctor.hall,
          day: this.abbreviationMapping[doctor.day],
          time: doctor.time,
        }))
        this.filterData();
        this.ShowScheduleTable = true;
      },
      error: (error) => {
        console.error('Error fetching doctors:', error);
      }
    });

  }

  CancelSchedule() {
    this.ShowScheduleTable = false;
  }


  AddDoctorCourse() {
    this.COURSE_DATA.push({
      courseName: '',
      option1: '',
      option2: '',
      option3: '',
      gruop: '',
      courseCode: '',
      AddCourseOption: true,
      EditCourseOption: false,
      EnrolledStudentsCount: 0

    });

    this.dataSource.data = this.COURSE_DATA.slice();
  }
  editDoctorCourse(option: doctorHomeOptionsView) {

    option.AddCourseOption = false
    option.EditCourseOption = true
    this.option1 = option.option1;
    this.option2 = option.option2;
    this.option3 = option.option3;

  }

  SaveCourse(course: doctorHomeOptionsView) {
    if (course.AddCourseOption) {
      if (course.courseCode == "" || course.option1 == "" || course.option2 == "" || course.option3 == "" || course.gruop == "") {
        this._AlertService.showWarningAlert("Please fill all the fields");
      }
      else {
        this.AddnewCourse.courseCode = course.courseCode;
        this.AddnewCourse.option1 = this.getStoredValue(course.option1);
        this.AddnewCourse.option2 = this.getStoredValue(course.option2);
        this.AddnewCourse.option3 = this.getStoredValue(course.option3);
        this.AddnewCourse.group = course.gruop;

        this._ApiDoctorService.EnrollDocotrCoruses(this.AddnewCourse).subscribe({
          next: (response) => {
            course.EditCourseOption = false;
            course.AddCourseOption = false;
            this.dataSource.data = this.COURSE_DATA;
            this.AddnewCourse = {} as EnrollDocotrCoruses;
            course.AddCourseOption = false
            this._AlertService.showSuccessAlert("Done");
          },
          error: (error) => {
            course.EditCourseOption = false;
            course.AddCourseOption = false;
            this.dataSource.data = this.COURSE_DATA;
            this.AddnewCourse = {} as EnrollDocotrCoruses;
            course.AddCourseOption = false
            this._AlertService.showSuccessAlert("Done");
          //   this._AlertService.showErrorAlert(error.message);
          //   console.error('Error fetching Enroll:', error.message);
          }
        });
      }
    } else {
      if (course.option1 == "" || course.option2 == "" || course.option3 == "") {
        this._AlertService.showWarningAlert("Please fill all options the fields");
      }
      else {
        this.AddnewCourse.courseCode = course.courseCode;
        this.AddnewCourse.option1 = this.getStoredValue(course.option1);
        this.AddnewCourse.option2 = this.getStoredValue(course.option2);
        this.AddnewCourse.option3 = this.getStoredValue(course.option3);
        this.AddnewCourse.group = course.gruop;

        this._ApiDoctorService.UpdateOptions(this.AddnewCourse).subscribe({
          next: (response) => {
            course.EditCourseOption = false;
            this.dataSource.data = this.COURSE_DATA;
            this.AddnewCourse = {} as EnrollDocotrCoruses;

          },
          error: (error) => {
            const index = this.COURSE_DATA.findIndex(a => a.courseCode === course.courseCode);
            this.COURSE_DATA[index].option1 = this.option1;
            this.COURSE_DATA[index].option2 = this.option2;
            this.COURSE_DATA[index].option3 = this.option3;
            this.option1 = "";
            this.option2 = "";
            this.option3 = "";
            console.error('Error fetching Enroll:', error.message);
          }
        });


      }
    }
  }
  cancelCourse(course: doctorHomeOptionsView) {
    if (course.AddCourseOption) {
      // Remove the course if AddCourseOption is true
      this.COURSE_DATA = this.COURSE_DATA.filter(a => a.courseCode !== course.courseCode);
      // Update the data source
      this.dataSource.data = this.COURSE_DATA;
    }
    if (course.EditCourseOption) {
      // Find the index of the course
      const index = this.COURSE_DATA.findIndex(c => c.courseCode === course.courseCode);
      if (index !== -1) {

        // Replace the course data at the found index with the new course data
        this.COURSE_DATA[index].option1 = this.option1;
        this.COURSE_DATA[index].option2 = this.option2;
        this.COURSE_DATA[index].option3 = this.option3;
        this.option1 = '';
        this.option2 = '';
        this.option3 = '';

      }
      // Update the data source
      this.dataSource.data = this.COURSE_DATA;
    }


    course.AddCourseOption = false;
    course.EditCourseOption = false;
    // Reset the options
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





  filterData() {
    // Initialize myData with placeholder values
    this.days.forEach(day => {
      this.myData[day] = {};
      this.times.forEach(time => {
        this.myData[day][time] = { name: '-', hall: '-', department: '-', isDuplicate: false };
      });
    });
    // Update myData with actual course schedule data filtered by department
    this.courseSchedules.forEach(doctorSchedule => {
      const { name, day, time, hall, department } = doctorSchedule;
      if (this.myData[day] && this.myData[day][time]) {

        if (this.myData[day][time].name === '-') {
          // If it's the first occurrence, just update the data
          this.myData[day][time] = { name, hall, department, isDuplicate: false };
        } else {
          // If it's a duplicate occurrence, mark it and append to courseName
          this.myData[day][time].isDuplicate = true;
          this.myData[day][time].name += `, ${name}`;
        }
      }
    });

  }



  toggleCourseDetails(day: string, time: string) {
    const element = document.getElementById(`${day}-${time}-details`);
    if (element) {
      element.classList.toggle('show');
    }
  }
}