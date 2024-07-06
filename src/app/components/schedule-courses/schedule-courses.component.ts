import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatButtonModule } from '@angular/material/button';  // Add this for buttons
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { User } from '../../models/user';
import { ApiAdminService } from '../../services/api-admin.service';
import { Schedule } from '../../models/Schedule';
import { CourseSchedulaViewModel } from '../../models/CourseSchedulaViewModel';
import { scheduled } from 'rxjs';
import { Hall } from '../../models/Hall';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { InValidCourses } from '../../models/InValidCourses';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { currentGroups } from '../../models/currentGroups';
import { AlertService } from '../../services/alert.service';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'


@Component({
  selector: 'app-schedule-courses',
  standalone: true,
  imports: [MatTableModule, CdkTableModule, MatButtonModule, MatTableModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, CommonModule, MatTableModule, FormsModule],  // Ensure all necessary modules are imported
  templateUrl: './schedule-courses.component.html',
  styleUrls: ['./schedule-courses.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ScheduleCoursesComponent implements OnInit {

  courseSchedules: Schedule[] = [];
  invalidCoursesData: InValidCourses[] = [];
  displayedColumns: string[] = ['time', 'Sunday', 'Monday', "Tuesday", 'Wednesday', 'Thursday'];
  myData: any = {}; // You can define a TypeScript interface for better type safety
  CurrentLevel: boolean = false;
  SelectedDepartment: string = {} as string;
  showTableBoll: boolean = false;
  ShowLevel: boolean = false;
  ShowLevelButtons: boolean = false;
  showloading: boolean = false;
  CurrentLevelGroup: number = 0;
  newHall: Hall = {} as Hall;
  abbreviationMapping: { [key: string]: string } = {
    "sun": "Sunday",
    "mon": "Monday",
    "teus": "Tuesday",
    "wed": "Wednesday",
    "thurs": "Thursday"
  };

  TimeData: string[] = ['08:00', '10:00', '12:00', '02:00', '04:00', '06:00'];
  DayData: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];


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

    doc.save(`schedule ${this.CurrentLevelGroup} ${this.SelectedDepartment}.pdf`);
  }






  displayedColumnsCourses: string[] = [
    'courseName',
    'courseCode',
    'doctorName',
    'doctorEmail',
    'department',
    'option1',
    'option2',
    'option3',
  ];
  dataSource = new MatTableDataSource(this.invalidCoursesData);
  currentGroup: currentGroups[] = [];
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.get();


    this._ApiAdminService.GetGroupBerLevel().subscribe({
      next: (response) => {
        this.currentGroup = this.transformResponse(response);
      },
      error: (error) => {
        console.error('Error fetching grouped levels:', error);
      }
    });
  }

  private transformResponse(response: { [key: number]: string[] }): currentGroups[] {
    const transformedData: currentGroups[] = [];

    for (const [level, groups] of Object.entries(response)) {
      transformedData.push({
        Level: Number(level),
        Group: groups
      });
    }

    return transformedData;
  }


  constructor(private _ApiAdminService: ApiAdminService, private _AlertService: AlertService) {

    this.CurrentLevelGroup = 0;
    this.newHall.courseCode = '';
    this.newHall.hallName = '';
    this.newHall.hallName = '';
  }
  ShowLevelButton() {
    this.showloading = true;
    this.ShowLevel = true;
    //this.ShowLevel
    this.RunSechdule();
  }
  ChangeMode(hall: any) {
    hall.editMode = true;
    this.EditHall(hall);
  }
  canselEdit(hall: any) {
    hall.editMode = false;
    this.newHall = {} as Hall;
  }

  SaveHall(hall: any) {
    if (hall.courseCode == "" || hall.hallName == "" || hall.department == "") {
      this._AlertService.showWarningAlert("Please fill all the fields");
    } else {
      console.log(hall);
      this._ApiAdminService.UpdataHall(hall.courseCode, hall.hallName, hall.department).subscribe({
        next: (response) => {
          hall.hall = hall.EditNewHall;
          hall.editMode = false;
          hall.EditNewHall = '';
          this._AlertService.showSuccessAlert(response.message);
        },
        error: (err) => {
          this._AlertService.showErrorAlert(err.message);
        }
      });
    }
  }

  RunSechdule() {
    this._ApiAdminService.Schedule().subscribe({
      next: (response: InValidCourses[]) => {
        this.invalidCoursesData = response;
        this.showloading = false;
        this.ShowLevelButtons = true;
        this.get();
        this.dataSource.data = this.invalidCoursesData;
      },
      error: (error) => {
        console.error('Error fetching admins:', error);
      }
    });

  }

  get() {
    this._ApiAdminService.GetSchedule().subscribe({
      next: (schedule: Schedule[]) => {

        this.courseSchedules = schedule.map(course => ({
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
      },
      error: (error) => {
        console.error('Error fetching Schedule:', error.message);
      }
    });
  }

  CancelSechdule() {
    this.ShowLevelButtons = false;
    this.ShowLevel = false;
    this.CurrentLevelGroup = 0;
    this.showTableBoll = false;
  }

  EditHall(hall: any) {
    this.newHall.courseCode = hall.courseCode;
    this.newHall.hallName = hall.hall;
    this.newHall.courseCode = hall.courseCode;
  }

  ShowSechdule(level: number) {
    if (!this.ShowLevel) {
      this.CurrentLevelGroup = level;
      this.ShowLevel = true;

    }
  }

  cancelShowing() {
    this.ShowLevel = false;
    this.CurrentLevelGroup = 0;
    this.showTableBoll = false;
    // this.editMode = true;
  }
  showTable(department: string, schedulelevel: number) {
    this.showTableBoll = true;
    this.SelectedDepartment = department;
    this.filterData(department, schedulelevel);
    console.log(department, schedulelevel);
  }
  filterData(scheduleDepartment: string, schedulelevel: number) {
    // Initialize myData with placeholder values
    this.DayData.forEach(day => {
      this.myData[day] = {};
      this.TimeData.forEach(time => {
        this.myData[day][time] = {
          courseName: '-', doctorName: '-', hall: '-', level: schedulelevel,
          courseCode: '-', department: scheduleDepartment, editMode: false, EditNewHall: ''
        }; // Initialize with placeholders
      });
    });

    // Update myData with actual course schedule data filtered by department
    this.courseSchedules.forEach(schedule => {
      const { courseName, doctorName, day, time, hall, department, courseCode, level } = schedule;
      if (level == schedulelevel && scheduleDepartment === department && this.myData[day] && this.myData[day][time]) {
        this.myData[day][time] = { courseName, doctorName, hall, courseCode, department, level };
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
