import { inject, PLATFORM_ID } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './services/auth.service';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    if (authService.isAuthenticated()) {
      return true;
    } else {
      return router.createUrlTree(['/login']);
    }
  }
  return true; // Let SSR pass through
};
