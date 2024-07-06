import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  ShowStudentLogin: boolean = true;

  constructor(private router: Router) {
    this.ShowStudentLogin = true;
  }
  navigateTo(path: string): void {
    this.ShowStudentLogin = false;
    this.router.navigate([`${path}`]);
  }
}
