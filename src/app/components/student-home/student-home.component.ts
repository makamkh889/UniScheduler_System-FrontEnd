import { Component, OnInit } from '@angular/core';
import { RegisterCourses } from '../../models/RegisterCourses';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core'; // MatOptionModule is part of @angular/material/core
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Schedule } from '../../models/Schedule';
import { ApiStudentService } from '../../services/api-student.service';
import { currentStudentData } from '../../models/currentStudentData';
import { AlertService } from '../../services/alert.service';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'


// import { ActivatedRoute, NavigationEnd } from '@angular/router';
// import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-student-home',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatOptionModule, ReactiveFormsModule, CommonModule],
  templateUrl: './student-home.component.html',
  styleUrl: './student-home.component.css',

})
export class StudentHomeComponent implements OnInit {

  currentStudent: currentStudentData = {} as currentStudentData;
  courseSchedules: Schedule[] = [];
  TimeData: string[] = ['08:00', '10:00', '12:00', '02:00', '04:00', '06:00'];
  DayData: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  myData: any = {}; // You can define a TypeScript interface for better type safety
  Showtable: boolean = false;
  RegisterCourses: string[] = [];
  courses: RegisterCourses[] = [];
  dat: string[] = ['student', 'course', 'course', 'course', 'course', 'course', 'course', 'course', 'course'];

  abbreviationMapping: { [key: string]: string } = {
    "sun": "Sunday",
    "mon": "Monday",
    "teus": "Tuesday",
    "wed": "Wednesday",
    "thurs": "Thursday"
  };

  filteredCourses: RegisterCourses[] = [...this.courses];
  addedCourses: RegisterCourses[] = [];
  selectedCourseCode: string = '';
  courseInput: string = '';
  RegisterMode: boolean = false;

  constructor(private _ApiStudentService: ApiStudentService, private _AlertService: AlertService) {
    this.RegisterMode = false;
  }

  ngOnInit(): void {
    this._ApiStudentService.currentStudentData().subscribe({
      next: (response: currentStudentData) => {
        this.currentStudent = response;
      },
      error: (error) => {
        console.error('Error fetching doctors:', error);
      }
    });
  }


  downloadPDF() {
    const doc = new jsPDF();
    interface Entry {
      doctorName: string;
      courseName: string;
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
        let doctorName = entry.doctorName + "\n" || '';
        let courseName = entry.courseName + "\n" || '';
        let hall = entry.hall || '';
        if (doctorName[0] == '-') {
          doctorName = "\n";
          courseName = "\n";
          hall = " ";
        }
        let cellContent = "";
        if (doctorName[0] == '\n') {
          cellContent = `${doctorName} ${courseName} ${hall}`;
        }
        else
          cellContent = `Dr.${doctorName} ${courseName} ${hall}`;

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

    doc.save(`schedule ${this.currentStudent.name} ${this.currentStudent.department}.pdf`);
  }




  filterCourses() {
    this.filteredCourses = this.courses.filter(course =>
      course.courseName.toLowerCase().includes(this.courseInput.toLowerCase()) &&
      !this.addedCourses.includes(course)
    );
  }

  Register() {

    this._ApiStudentService.StuedntAcademicRecordCourses().subscribe({
      next: (schedule: RegisterCourses[]) => {

        this.RegisterMode = true;
        this.courses = schedule;
        //هنادم الapi get scudle هنا وبس
      },
      error: (error) => {
        console.error('Error fetching doctors:', error);
      }
    });
  }

  CancelRegister() {
    this.RegisterMode = false;
    this.selectedCourseCode = '';
    this.RegisterCourses = [];
  }

  AddCourseOption() {
    if (this.selectedCourseCode) {
      this.RegisterCourses.push(this.selectedCourseCode);
      this.courses = this.courses.filter(course => course.courseCode !== this.selectedCourseCode);
      this.selectedCourseCode = '';  // Reset the selected course code
    }
  }

  SaveCourse() {
    // هنادم الapi الى هبعتله الكورسات هنا
    this._ApiStudentService.StudentRecord(this.RegisterCourses).subscribe({
      next: () => {
        this.RegisterCourses = [];
        this._AlertService.showSuccessAlert("Registered ok");

      },
      error: (error) => {
        console.error('Error Record Cources:', error.message);
      }
    });
  }


  filterData() {
    // Initialize myData with placeholder values
    this.DayData.forEach(day => {
      this.myData[day] = {};
      this.TimeData.forEach(time => {
        this.myData[day][time] = {
          courseName: '-', doctorName: '-', hall: '-',
          courseCode: '-', isDuplicate: false // Add isDuplicate flag
        }; // Initialize with placeholders
      });
    });

    // Update myData with actual course schedule data filtered by department
    this.courseSchedules.forEach(schedule => {
      const { courseName, doctorName, day, time, hall, courseCode } = schedule;
      if (this.myData[day] && this.myData[day][time]) {
        // Check if there's already a course at this time and day
        if (this.myData[day][time].courseName === '-') {
          // If it's the first occurrence, just update the data
          this.myData[day][time] = { courseName, doctorName, hall, courseCode, isDuplicate: false };
        } else {
          // If it's a duplicate occurrence, mark it and append to courseName
          this.myData[day][time].isDuplicate = true;
          this.myData[day][time].courseName += `, ${courseName}`;
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

  GetSchedule() {

    this._ApiStudentService.GetStudentSchedule().subscribe({
      next: (responce: Schedule[]) => {
        this.courseSchedules = responce.map(course => ({
          courseCode: course.courseCode,
          courseName: course.courseName,
          department: course.department,
          hall: course.hall,
          time: course.time,
          level: course.level,
          day: this.abbreviationMapping[course.day],
          doctorName: course.doctorName
        }))
        console.log(this.courseSchedules)
        this.Showtable = true;
        this.filterData();
      },
      error: (error) => {
        console.error('Error fetching doctors:', error.message);
      }
    });


  }

  CancelSchedule() {
    this.Showtable = false;
  }

}