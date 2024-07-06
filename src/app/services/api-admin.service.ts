import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { UserAuth } from '../models/user-auth';
import { Admin } from '../models/admin';
import { NationalID } from '../models/national-id';
import { User } from '../models/user';
import { Doctor } from '../models/doctor';
import { DoctorOptions } from '../models/doctor-options';
import { DoctorMainInfo } from '../models/doctor-main-info';
import { AddEditDoctorOptions } from '../models/add-edit-doctor-options';
import { Student } from '../models/student';
import { StudentData } from '../models/student-data';
import { Email } from '../models/email';
import { Schedule } from '../models/Schedule';
import { InValidCourses } from '../models/InValidCourses';
import { UserAuthenticationService } from './user-authentication.service';
import { currentAdminData } from '../models/currentAdminData';
import { environment } from '../../environments/environment.development';
import { CourseInfo } from '../models/CourseInfo';
import { CourseInDepartment } from '../models/CourseInDepartment';


@Injectable({
  providedIn: 'root',
})
export class ApiAdminService {
  constructor(private httpclient: HttpClient, private _UserAuthService:UserAuthenticationService) { }

  /* Sends an HTTP GET request to the specified URL to perform a login operation.
   * The expected response is of type UserAuth, which contains username and password fields.
   * @returns {Observable<UserAuth>} An observable that emits the UserAuth object received from the server.
   * component that need this service it will happen subscribe on him
   */

  //baseUrl: string = 'http://unischedulermaker.runasp.net';


  currentAdminData(): Observable<currentAdminData> {
    return this.httpclient.get<currentAdminData>(`${environment.baseUrl}/currentAdminData`);
  }

  GetAllAdmins(): Observable<Admin[]> {
    return this.httpclient.get<Admin[]>(`${environment.baseUrl}/GetAdmins`);
  }
  // take admin type and return Observable from type Admin
  AddNewAdmin(admin: User): Observable<any> {
    return this.httpclient.post<any>(`${environment.baseUrl}/AddAdmin`, admin)
      .pipe(
        tap(response => {

          console.log(response.message)
        }),
        catchError((error) => {
          return throwError(() => error); // Rethrow the error so it can be handled by the caller
        })
      );
  }

  // take admin type and return Observable from type Admin
  DeleteAdmin(nationalId: string): Observable<any> {
    return this.httpclient.delete<any>(`${environment.baseUrl}/DeleteAdmin`, { body: { nationalId: nationalId } }).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error); // Rethrow the error so it can be handled by the caller
      })
    );
  }

  EditAdmin(admin: User): Observable<any> {
    return this.httpclient.put<any>(`${environment.baseUrl}/EditAdmin`, admin)
      .pipe(
        tap(response => {
        }),
        catchError((error) => {
          return throwError(() => error);  // Rethrow the error so it can be handled by the caller
        })
      );
  }

  CourseInfo(): Observable<CourseInfo[]> {
    return this.httpclient.get<CourseInfo[]>(`${environment.baseUrl}/CourseInfo`).pipe(
      tap(response => {
      }),
      catchError((error) => {
        return throwError(() => error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }

  DeleteDepartmentCourse(CourseCode: string, DepartmentName : string): Observable<any> {
    return this.httpclient.delete<any>(`${environment.baseUrl}/DeleteDepartmentCourse?CourseCode=${CourseCode}&DepartmentName=${DepartmentName}`).pipe(
      tap(response => {
      }),
      catchError((error) => {
        return throwError(() => error); // Rethrow the error so it can be handled by the caller
      })
    );
  }

  DeleteCourse(CourseCode: string): Observable<any> {
    return this.httpclient.delete<any>(`${environment.baseUrl}/DeleteCourse?CourseCode=${CourseCode}`).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error); // Rethrow the error so it can be handled by the caller
      })
    );
  }


  AddnewCourse(course: CourseInfo): Observable<any> {
    return this.httpclient.post<any>(`${environment.baseUrl}/AddnewCourse`, course)
      .pipe(
        tap(response => {

          console.log(response.message)
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  AddnewDepartmentCourse(course: CourseInDepartment): Observable<any> {
    return this.httpclient.post<any>(`${environment.baseUrl}/AddnewDepartmentCourse`, course)
      .pipe(
        tap(response => {

          console.log(response.message)
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  ////////////////////////////////////Admin Mange Doctor///////////////////


  GetAllDocotrs(): Observable<Doctor[]> {
    return this.httpclient.get<Doctor[]>(`${environment.baseUrl}/GetAllDocotrs`).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }

  //I will give back doctor from type DoctorMainInfo and I will take from it message from type any
  AddDoctor(doctor: DoctorMainInfo): Observable<any> {
    return this.httpclient.post<any>(`${environment.baseUrl}/AddDoctor`, doctor).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }

  // update  docotr options for courses
  UpdateDoctorOptions(Options: AddEditDoctorOptions): Observable<any> {
    console.log(Options)
    return this.httpclient.put<any>(`${environment.baseUrl}/UpdateDoctorOptions`, Options).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }

  // update  docotr options for courses
  AddDoctorOptions(Options: AddEditDoctorOptions): Observable<any> {
    return this.httpclient.post<any>(`${environment.baseUrl}/AddDoctorOptions`, Options).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }


  DeleteDoctor(NationalID: string): Observable<any> {
    return this.httpclient.delete<any>(`${environment.baseUrl}/DeleteDoctor`, { body: { nationalId: NationalID } }).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }

  DeleteDoctoroption(NationalID: string, courseCode: string, department: string): Observable<any> {
    return this.httpclient.delete<any>(`${environment.baseUrl}/DeleteDoctoroption?courseCode=${courseCode}&department=${department}`,
      { body: { nationalId: NationalID } }).pipe(
        tap(response => {
        }),
        catchError((error) => {
          console.log(error);
          return throwError(() => error);  // Rethrow the error so it can be handled by the caller
        })
      );
  }
  ///////////////////////////////student/////////////////////////////////////////

  AddStudent(student: Student): Observable<any> {
    return this.httpclient.post<any>(`${environment.baseUrl}/AddStudent`, student).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }


  GetStudents(Semster: number, Department: string): Observable<StudentData[]> {
    return this.httpclient.get<StudentData[]>(`${environment.baseUrl}/GetStudents?Semster=${Semster}&Department=${Department}`).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }

  GetStudent(AcademicNumber: string): Observable<Student> {
    return this.httpclient.get<Student>(`${environment.baseUrl}/GetStudents?AcademicNumber=${AcademicNumber}`).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }
  
  uploadExcelsheetForStudent(file: FormData): Observable<any> {
    const formData = new FormData();
    console.log(this.httpclient.post<any>(`${environment.baseUrl}/uploadExcelsheetForStudent`, file));
    return this.httpclient.post<any>(`${environment.baseUrl}/uploadExcelsheetForStudent`, file).pipe(
      tap(response => {
      }),
      catchError((error) => {
        return throwError(() => error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }

  DeleteStudent(AcademicNumber: string): Observable<any> {
    console.log(this.httpclient.delete<any>(`${environment.baseUrl}/DeleteStudent?AcademicNumber=${AcademicNumber}`));
    return this.httpclient.delete<any>(`${environment.baseUrl}/DeleteStudent?AcademicNumber=${AcademicNumber}`).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }


  ///////////////////////////////////////////Settings////////////////////////////////
  SendEmail(email: string, subject: string, body: string): Observable<any> {
    return this.httpclient.post<any>(`${environment.baseUrl}/SendEmail?email=${email}&subject=${subject}&body=${body}`, '').pipe(
      tap(response => {
      }),
      catchError((error) => {
        return throwError(() => error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }

  AddNewHall(HallName: string, Capacity: number): Observable<any> {
    return this.httpclient.post<any>(`${environment.baseUrl}/AddNewHall?HallName=${HallName}&Capacity=${Capacity}`, '').pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }



  AddNewDepartmentOrGroup(Name: string, Level: string): Observable<any> {
    return this.httpclient.post<any>(`${environment.baseUrl}/AddNewDepartmentOrGroup?Name=${Name}&Level=${Level}`, null).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }
  ////////////////////////////Schule//////////////////////////////////
  GetSchedule(): Observable<Schedule[]> {

    return this.httpclient.get<Schedule[]>(`${environment.baseUrl}/GetSchedule`).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }

  Schedule(): Observable<InValidCourses[]> {
    return this.httpclient.get<InValidCourses[]>(`${environment.baseUrl}/Schedule`).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }

  UpdataHall(couseCode: string, hallName: string, department: string): Observable<any> {
    return this.httpclient.put<any>(`${environment.baseUrl}/UpdataHall?couseCode=${couseCode}&hallName=${hallName}&department=${department}`, null).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }


  GetGroupBerLevel(): Observable<{ [key: number]: string[] }> {
    console.log(this.httpclient.get<{ [key: number]: string[] }>(`${environment.baseUrl}/GetGroupBerLevel`))
    return this.httpclient.get<{ [key: number]: string[] }>(`${environment.baseUrl}/GetGroupBerLevel`).pipe(
      tap(response => {
        console.log('Response:', response);
      }),
      catchError((error) => {
        console.error('Error:', error);
        return throwError(() => new Error(error || 'Server error'));
      })
    );
  }

}
