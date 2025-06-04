import { AuthService } from './../../../app/services/auth.service';
import { AllProductsService } from './../../../app/services/all-produtcs.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoaderComponent } from '../../loader/loader.component';
import { ScrollToDirective } from '../../../directives/scroll-to.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, LoaderComponent, ScrollToDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  count = 0;
  products: any[] = [];
  constructor(
    private allProducts: AllProductsService,
    private router: Router
  ) {}
  private authService = inject(AuthService);
  isloged = this.authService.isLoggedSig;

  isLoading = this.authService.isAuthLoading;

  // ✅ Signal ديناميكية لحالة تسجيل الدخول

  slides = [
    { imageUrl: '/f1.jpg', title: 'Slide 1' },
    { imageUrl: '/f2.jpg', title: 'Slide 2' },
    { imageUrl: '/f3.jpg', title: 'Slide 3' },
    { imageUrl: '/f4.jpg', title: 'Slide 4' },
  ];

  async ngOnInit(): Promise<void> {
    await this.fetchProducts();
  }

  async fetchProducts(): Promise<void> {
    const allProducts = await this.allProducts.fetchProducts();
    this.products = allProducts.slice(0, 12);
  }

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
