import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserAuthenticationService } from '../../services/user-authentication.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  constructor(private _UserAuthenticationService:UserAuthenticationService,private router: Router, private _activatedRoute: ActivatedRoute) { this.currentRoute = 'normal'; }


  currentRoute: string;
  pageclicked: number = 0;

  private routeMap: { [key: string]: number } = {
    'AdminsDashboard': 1,
    'DoctorDashboard': 2,
    'StudentsDashboard': 3,
    'HallsDashboard': 4,
    'ScheduleDashboard': 5
  };

  private routenavbar: { [key: string]: string } = {
    '/Home/AdminLogin/AdminHome': 'admin',
    '/Home/DoctorLogin/DoctorHome': 'doctor',
    '/Home/StudentLogin/StudentHome': 'student',
    
  };

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = this.determineRoute(event.url);
      }
    });
  }

  private determineRoute(url: string): string {
    for (const route in this.routenavbar) {
      if (url.includes(route)) {
        return this.routenavbar[route];
      }
    }
    return 'normal'; // Default route when none of the specific routes match
  }

  toggleSideBar() {
    // throw new Error('Method not implemented.');
  }

  goHome(go: string) {
    if (go == 'main') {
      this.router.navigate([`/Home`]);
    }
    else if (go == 'logout') {
      this.router.navigate([`/Home`]);
      this._UserAuthenticationService.logout();
    }
    else this.router.navigate([`/Home/AdminLogin/AdminHome`]);
  }

  navigateTo(path: string): void {
    const routePath = `${path}Dashboard`;
    this.pageclicked = this.routeMap[routePath] || 0;
    this.router.navigate([`/Home/AdminLogin/AdminHome/${routePath}`]);
  }

}
