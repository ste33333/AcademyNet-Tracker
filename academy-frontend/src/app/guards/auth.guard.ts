import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 
import { map, take, tap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    take(1), 
    tap(isLoggedIn => {
      if (!isLoggedIn) {
        console.log('AuthGuard: Access denied, redirecting to login.');
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      } else {
        console.log('AuthGuard: Access granted.');
      }
    }),
    map(isLoggedIn => isLoggedIn)
  );
};