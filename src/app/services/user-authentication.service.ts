import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserAuth } from '../models/user-auth';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserAuthenticationService {


  private UserAuthSubject: BehaviorSubject<boolean>;
  //baseUrl: string = 'http://unischedulermaker.runasp.net';
  private isAdminLoggedIn = false;
  private isDoctorLoggedIn = false;
  private isStudentLoggedIn = false;

  constructor(private router: Router, private httpclient: HttpClient) {
    // To make all subscriber know if changed happened
    this.UserAuthSubject = new BehaviorSubject<boolean>(false);
  }


  login(role: 'admin' | 'doctor' | 'student', UserAuth: UserAuth): Observable<any> {
    this.logout();
    let loginObservable: Observable<any>

    loginObservable = this.LoginAPI(UserAuth);


    return loginObservable.pipe(
      tap(response => {
        sessionStorage.setItem('token', response.token);
        if (role === 'admin') {
          this.isAdminLoggedIn = true;
        } else if (role === 'doctor') {
          this.isDoctorLoggedIn = true;
        } else if (role === 'student') {
          this.isStudentLoggedIn = true;
        }
        console.log(`${role} login successful`);
      }),
      catchError(error => {
        // console.error('Login error:', error);
        return error;
      })
    );


  }



  logout(): void {
    this.isAdminLoggedIn = false;
    this.isDoctorLoggedIn = false;
    this.isStudentLoggedIn = false;
    sessionStorage.removeItem('token');
  }

  isAdminAuthenticated(): boolean {
    return this.isAdminLoggedIn;
  }

  isDoctorAuthenticated(): boolean {
    return this.isDoctorLoggedIn;
  }

  isStudentAuthenticated(): boolean {
    return this.isStudentLoggedIn;
  }


  getUserLoged(): boolean {
    return sessionStorage.getItem('token') ? true : false;
  }

  getToken() {
    return sessionStorage.getItem('token') ? sessionStorage.getItem('token') : null;
  }

  getAuthSubject(): BehaviorSubject<boolean> {
    return this.UserAuthSubject;
  }


  LoginAPI(UserAuth: UserAuth): Observable<any> {
    console.log(this.httpclient.post<any>(`${environment.baseUrl}/Login`, UserAuth))
    return this.httpclient.post<any>(`${environment.baseUrl}/Login`, UserAuth);
  }
}
