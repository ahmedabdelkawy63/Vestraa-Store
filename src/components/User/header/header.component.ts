import { Component, inject, computed, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../app/services/auth.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, LoaderComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private authService = inject(AuthService);
  isloged = this.authService.isLoggedSig;
  isLoading = this.authService.isAuthLoading;

  private router = inject(Router);

  // ✅ Signal لحالة تسجيل الدخول، مربوطة بالـ AuthService

  logout() {
    this.authService.logout().subscribe(() => {
      localStorage.removeItem('uid'); // 🧹 امسح uid

      this.router.navigate(['/login']);
    });
  }

  login() {
    this.router.navigate(['/login']);
  }

  register() {
    this.router.navigate(['/register']);
  }
}
