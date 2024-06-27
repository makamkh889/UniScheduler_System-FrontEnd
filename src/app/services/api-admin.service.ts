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

  baseUrl: string = 'http://localhost:5088';


  currentAdminData(): Observable<currentAdminData> {
    return this.httpclient.get<currentAdminData>(`${this.baseUrl}/currentAdminData`);
  }

  GetAllAdmins(): Observable<Admin[]> {
    return this.httpclient.get<Admin[]>(`${this.baseUrl}/GetAdmins`);
  }
  // take admin type and return Observable from type Admin
  AddNewAdmin(admin: User): Observable<any> {
    return this.httpclient.post<any>(`${this.baseUrl}/AddAdmin`, admin)
      .pipe(
        tap(response => {

          console.log(response.message)
        }),
        catchError((error) => {
          return throwError(() => error.error); // Rethrow the error so it can be handled by the caller
        })
      );
  }

  // take admin type and return Observable from type Admin
  DeleteAdmin(nationalId: string): Observable<any> {
    return this.httpclient.delete<any>(`${this.baseUrl}/DeleteAdmin`, { body: { nationalId: nationalId } }).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error.error); // Rethrow the error so it can be handled by the caller
      })
    );
  }

  EditAdmin(admin: User): Observable<any> {
    return this.httpclient.put<any>(`${this.baseUrl}/EditAdmin`, admin)
      .pipe(
        tap(response => {
        }),
        catchError((error) => {
          console.log(error);
          return throwError(() => error.error);  // Rethrow the error so it can be handled by the caller
        })
      );
  }
  ////////////////////////////////////Admin Mange Doctor///////////////////


  GetAllDocotrs(): Observable<Doctor[]> {
    return this.httpclient.get<Doctor[]>(`${this.baseUrl}/GetAllDocotrs`).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error.error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }

  //I will give back doctor from type DoctorMainInfo and I will take from it message from type any
  AddDoctor(doctor: DoctorMainInfo): Observable<any> {
    return this.httpclient.post<any>(`${this.baseUrl}/AddDoctor`, doctor).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error.error);
        return throwError(() => error.error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }

  // update  docotr options for courses
  UpdateDoctorOptions(Options: AddEditDoctorOptions): Observable<any> {
    console.log(Options)
    return this.httpclient.put<any>(`${this.baseUrl}/UpdateDoctorOptions`, Options).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error.error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }

  // update  docotr options for courses
  AddDoctorOptions(Options: AddEditDoctorOptions): Observable<any> {
    return this.httpclient.post<any>(`${this.baseUrl}/AddDoctorOptions`, Options).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error.error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }


  DeleteDoctor(NationalID: string): Observable<any> {
    return this.httpclient.delete<any>(`${this.baseUrl}/DeleteDoctor`, { body: { nationalId: NationalID } }).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error.error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }

  DeleteDoctoroption(NationalID: string, courseCode: string, department: string): Observable<any> {
    return this.httpclient.delete<any>(`${this.baseUrl}/DeleteDoctoroption?courseCode=${courseCode}&department=${department}`,
      { body: { nationalId: NationalID } }).pipe(
        tap(response => {
        }),
        catchError((error) => {
          console.log(error);
          return throwError(() => error.error);  // Rethrow the error so it can be handled by the caller
        })
      );
  }
  ///////////////////////////////student/////////////////////////////////////////

  AddStudent(student: Student): Observable<any> {
    return this.httpclient.post<any>(`${this.baseUrl}/AddStudent`, student).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error.error);
        return throwError(() => error.error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }


  GetStudents(Semster: string, Department: string): Observable<StudentData[]> {
    return this.httpclient.get<StudentData[]>(`${this.baseUrl}/GetStudents?Semster=${Semster}&Department=${Department}`).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error.error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }

  GetStudent(AcademicNumber: string): Observable<Student> {
    return this.httpclient.get<Student>(`${this.baseUrl}/GetStudents?AcademicNumber=${AcademicNumber}`).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error.error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }

  uploadExcelsheetForStudent(file: FormData): Observable<any> {
    const formData = new FormData();
    console.log(this.httpclient.post<any>(`${this.baseUrl}/uploadExcelsheetForStudent`, file));
    return this.httpclient.post<any>(`${this.baseUrl}/uploadExcelsheetForStudent`, file).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error.error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }

  DeleteStudent(AcademicNumber: string): Observable<any> {
    console.log(this.httpclient.delete<any>(`${this.baseUrl}/DeleteStudent?AcademicNumber=${AcademicNumber}`));
    return this.httpclient.delete<any>(`${this.baseUrl}/DeleteStudent?AcademicNumber=${AcademicNumber}`).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error.error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }


  ///////////////////////////////////////////Settings////////////////////////////////
  SendEmail(email: string, subject: string, body: string): Observable<any> {
    return this.httpclient.post<any>(`${this.baseUrl}/SendEmail?email=${email}&subject=${subject}&body=${body}`, '').pipe(
      tap(response => {
      }),
      catchError((error) => {
        return throwError(() => error.error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }

  AddNewHall(HallName: string, Capacity: number): Observable<any> {
    return this.httpclient.post<any>(`${this.baseUrl}/AddNewHall?HallName=${HallName}&Capacity=${Capacity}`, '').pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error.error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }



  AddNewDepartmentOrGroup(Name: string, Level: string): Observable<any> {
    return this.httpclient.post<any>(`${this.baseUrl}/AddNewDepartmentOrGroup?Name=${Name}&Level=${Level}`, null).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error.error);
        return throwError(() => error.error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }
  ////////////////////////////Schule//////////////////////////////////
  GetSchedule(): Observable<Schedule[]> {

    return this.httpclient.get<Schedule[]>(`${this.baseUrl}/GetSchedule`).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error.error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }

  Schedule(): Observable<InValidCourses[]> {
    return this.httpclient.get<InValidCourses[]>(`${this.baseUrl}/Schedule`).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error.error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }

  UpdataHall(couseCode: string, hallName: string, department: string): Observable<any> {
    return this.httpclient.put<any>(`${this.baseUrl}/UpdataHall?couseCode=${couseCode}&hallName=${hallName}&department=${department}`, null).pipe(
      tap(response => {
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error.error);  // Rethrow the error so it can be handled by the caller
      })
    );
  }


  GetGroupBerLevel(): Observable<{ [key: number]: string[] }> {
    console.log(this.httpclient.get<{ [key: number]: string[] }>(`${this.baseUrl}/GetGroupBerLevel`))
    return this.httpclient.get<{ [key: number]: string[] }>(`${this.baseUrl}/GetGroupBerLevel`).pipe(
      tap(response => {
        console.log('Response:', response);
      }),
      catchError((error) => {
        console.error('Error:', error);
        return throwError(() => new Error(error.error || 'Server error'));
      })
    );
  }

}
