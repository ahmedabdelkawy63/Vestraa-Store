import { AuthService } from './../services/auth.service';
// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLogged()) {
      return true;
    }
    this.router.navigate(['/unauthorized']);
    return false;
  }
}

// export class AuthGuard implements CanActivate {
//   private authService = inject(AuthService);
//   private router = inject(Router);

//   canActivate(): boolean | UrlTree {
//     if (this.authService.currentUserSig()) {
//       return true;
//     } else {
//       this.router.navigate(['/unauthorized']);
//       return false;
//     }
//   }
// }
