import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { StudentLoginComponent } from './components/student-login/student-login.component';
import { DoctorLoginComponent } from './components/doctor-login/doctor-login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { StudentHomeComponent } from './components/student-home/student-home.component';
import { DoctorHomeComponent } from './components/doctor-home/doctor-home.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AdminsDashboardControlComponent } from './components/admins-dashboard-control/admins-dashboard-control.component';
import { DoctorDashboardControlComponent } from './components/doctor-dashboard-control/doctor-dashboard-control.component';
import { StudentsDashboardControlComponent } from './components/students-dashboard-control/students-dashboard-control.component';
import { ScheduleCoursesComponent } from './components/schedule-courses/schedule-courses.component';
import { adminAuthGuard } from './guards/admin-auth.guard';
import { studentAuthGuard } from './guards/student-auth.guard';
import { doctorAuthGuard } from './guards/doctor-auth.guard';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { CourseDashboardControlComponent } from './components/course-dashboard-control/course-dashboard-control.component';
//import { provideRouter } from '@angular/router';

export const routes: Routes = [

  { path: '', pathMatch: 'full', redirectTo: 'Home' },
  {
    path: 'Home',
    component: HomeComponent,
    children: [{
      path: 'AdminLogin',
      component: AdminLoginComponent,
      children: [{
        path: 'AdminHome',
        component: AdminHomeComponent,
        canActivate: [adminAuthGuard],
        children: [{
          path: 'AdminsDashboard',
          component: AdminsDashboardControlComponent,
        },
        {
          path: 'DoctorDashboard',
          component: DoctorDashboardControlComponent,
          // canActivate: [studentAuthGuard],
        },
        {
          path: 'StudentsDashboard',
          component: StudentsDashboardControlComponent,
          // canActivate: [studentAuthGuard],
        },
        {
          path: 'CoursesDashboard',
          component: CourseDashboardControlComponent,
          // canActivate: [studentAuthGuard],
        },
        {
          path: 'ScheduleDashboard',
          component: ScheduleCoursesComponent,
          // canActivate: [studentAuthGuard],
        }]
      }]
    },

    { path: '', pathMatch: 'full', redirectTo: 'Home' },
    {
      path: 'StudentLogin',
      component: StudentLoginComponent,
      children: [
        {
          path: 'StudentHome',
          component: StudentHomeComponent,
          canActivate: [studentAuthGuard],
        },
      ],
    },
    {
      path: 'DoctorLogin',
      component: DoctorLoginComponent,
      children: [{ path: 'DoctorHome', component: DoctorHomeComponent, canActivate: [doctorAuthGuard], }],
    },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
