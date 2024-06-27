import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserAuthenticationService } from '../services/user-authentication.service';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  let _UserAuthService = inject(UserAuthenticationService);
 
  const router = inject(Router);
  console.log(_UserAuthService.getUserLoged(), "adminAuthGuard")
  console.log(_UserAuthService.getToken())
  if (_UserAuthService.getUserLoged()) {
    return true;
  } else {
    router.navigate(['/Home/AdminLogin']);
    return false;
  }
  
};


