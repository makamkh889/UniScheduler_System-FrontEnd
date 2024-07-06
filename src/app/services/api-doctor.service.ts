import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { doctorHomeOptions } from '../models/doctorHomeOptions';
import { doctorSchedule } from '../models/doctorSchedule';
import { EnrollDocotrCoruses } from '../models/EnrollDocotrCoruses';
import { currentDoctorData } from '../models/currentDoctorData';
import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class ApiDoctorService {

  constructor(private httpclient: HttpClient) { }

  /* Sends an HTTP GET request to the specified URL to perform a login operation.
     * The expected response is of type UserAuth, which contains username and password fields.
     * @returns {Observable<UserAuth>} An observable that emits the UserAuth object received from the server.
     * component that need this service it will happen subscribe on him
     */
 // baseUrl: string = 'http://localhost:5088';


  currentDoctorData(): Observable<currentDoctorData> {
    return this.httpclient.get<currentDoctorData>(`${environment.baseUrl}/currentDoctorData`);

  }


  GetDoctorCourses(): Observable<doctorHomeOptions[]> {
    return this.httpclient.get<doctorHomeOptions[]>(`${environment.baseUrl}/GetDoctorCourses`);
  }

  GetNumberOfStudent(code :string): Observable<number> {
    return this.httpclient.get<number>(`${environment.baseUrl}/GetNumberOfStudent?Code=${code}`);
  }

  GetDoctorSechdule(): Observable<doctorSchedule[]> {
    return this.httpclient.get<doctorSchedule[]>(`${environment.baseUrl}/GetDoctorSechdule`);

  }

  // take admin type and return Observable from type Admin
  EnrollDocotrCoruses(course: EnrollDocotrCoruses): Observable<any> {
    return this.httpclient.post<any>(`${environment.baseUrl}/EnrollDocotrCoruses`, course)
      .pipe(
        tap(response => {

          console.log(response.message)
        }),
        catchError((error) => {
          return throwError(() => error); // Rethrow the error so it can be handled by the caller
        })
      );
  }


  UpdateOptions(doctor: EnrollDocotrCoruses): Observable<any> {
    return this.httpclient.put<any>(`${environment.baseUrl}/UpdateOptions`, doctor)
      .pipe(
        tap(response => {
        }),
        catchError((error) => {
          console.log(error);
          return throwError(() => error);  // Rethrow the error so it can be handled by the caller
        })
      );
  }
}

