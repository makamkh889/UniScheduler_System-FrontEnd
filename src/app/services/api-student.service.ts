import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { currentStudentData } from '../models/currentStudentData';
import { Schedule } from '../models/Schedule';
import { RegisterCourses } from '../models/RegisterCourses';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiStudentService {

  constructor(private httpclient: HttpClient) {
  }

  //baseUrl: string = 'http://localhost:5088';


  currentStudentData(): Observable<currentStudentData> {
    return this.httpclient.get<currentStudentData>(`${environment.baseUrl}/currentStudentData`);

  }

  StuedntAcademicRecordCourses(): Observable<RegisterCourses[]> {
    return this.httpclient.get<RegisterCourses[]>(`${environment.baseUrl}/StuedntAcademicRecordCourses`);
  }

  /////////////////Do not sure of this Observable<Schedule[]> 
  GetStudentSchedule(): Observable<Schedule[]> {
    return this.httpclient.get<Schedule[]>(`${environment.baseUrl}/GetStudentSchedule`);

  }

  // take admin type and return Observable from type Admin
  StudentRecord(courseCode: string[]): Observable<any> {
    return this.httpclient.post<any>(`${environment.baseUrl}/StudentRecord`, courseCode )
      .pipe(
        tap(response => {
          console.log(response.message)
        }),
        catchError((error) => {
          return throwError(() => error); // Rethrow the error so it can be handled by the caller
        })
      );
  }


}
