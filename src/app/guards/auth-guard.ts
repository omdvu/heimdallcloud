import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = sessionStorage.getItem('user');
  const token = sessionStorage.getItem('token');
  const isLoggedIn = !!(user && token);

  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};