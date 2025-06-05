import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  private auth = inject(Auth);
  private router = inject(Router);

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user && user.email === 'owner@admin.com') {
          resolve(true);
        } else {
          this.router.navigate(['/unauthorized']);
          resolve(false);
        }
      });
    });
  }
}
