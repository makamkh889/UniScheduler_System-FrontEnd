import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserAuthenticationService } from '../services/user-authentication.service';

export const studentAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(UserAuthenticationService);
  const router = inject(Router);

  if (authService.getUserLoged()) {
    return true;
  } else {
    router.navigate(['/Home/StudentLogin/StudentHome']);
    return false;
  }
};

