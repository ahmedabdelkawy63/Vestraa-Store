import { User } from './model/user';
import { Component, inject, OnInit } from '@angular/core';
import { DetailsProductComponent } from '../components/User/details-product/details-product.component';
import { ViewProductsComponent } from '../components/User/view-products/view-products.component';
import { HomeComponent } from '../components/Home/home/home.component';
import { ProductsComponent } from '../components/Admin/products/products.component';
import { WishlistComponent } from '../components/User/wishlist/wishlist.component';
import { HeaderComponent } from '../components/User/header/header.component';
import { ProfileComponent } from '../components/User/profile/profile.component';
import { CartComponent } from '../components/User/cart/cart.component';
import { LoginComponent } from '../components/Auth/login/login.component';
import { Router, RouterOutlet } from '@angular/router';
import { DashboardComponent } from '../components/Admin/dashboard/dashboard.component';
import { StatisticsComponent } from '../components/Admin/statistics/statistics.component';
import { NotfoundComponent } from '../components/notfound/notfound.component';
import { RegisterComponent } from '../components/Auth/register/register.component';
import { CategoriesComponent } from '../components/Admin/categories/categories.component';
import { SidebarComponent } from '../components/Admin/sidebar/sidebar.component';
import { AuthService } from './services/auth.service';
import { UnauthorizedComponent } from '../components/unauthorized/unauthorized.component';
import { AddProductComponent } from '../components/Admin/add-product/add-product.component';
import { CheckoutComponent } from '../components/User/checkout/checkout.component';
import { MyOrdersComponent } from '../components/User/my-orders/my-orders.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    DetailsProductComponent,
    ViewProductsComponent,
    HomeComponent,
    ProductsComponent,
    WishlistComponent,
    HeaderComponent,
    ProfileComponent,
    CartComponent,
    LoginComponent,
    RouterOutlet,
    DashboardComponent,
    StatisticsComponent,
    NotfoundComponent,
    RegisterComponent,
    CategoriesComponent,
    SidebarComponent,
    UnauthorizedComponent,
    AddProductComponent,
    CheckoutComponent,
    MyOrdersComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private router = inject(Router);

  ngOnInit(): void {
    // this.myAuth.user$.subscribe((user) => {
    //   if (user) {
    //     this.myAuth.currentUserSig.set({
    //       email: user.email!,
    //       name: user.displayName!,
    //     });
    //     if (user.email === 'owner@admin.com') {
    //       this.router.navigate(['/dashboard/statistics']);
    //     } else {
    //       this.router.navigate(['/home']);
    //     }
    //   } else {
    //     this.myAuth.currentUserSig.set(null);
    //     this.router.navigate(['/login']);
    //   }
    //   console.log(this.myAuth.currentUserSig());
    // });
  }

  title = 'vestraa';
  // constructor(private myAuthService: AuthService) {}

  // ngOnInit(): void {
  //   this.myAuthService.user$.subscribe((user) => {
  //     if (user) {
  //       this.myAuthService.currentUserSig.set({
  //         email: user.email!,
  //         name: user.displayName!,
  //       });
  //     } else {
  //       this.myAuthService.currentUserSig.set(null);
  //     }
  //   });
  //   console.log(this.myAuthService.currentUserSig());
  // }

  myAuth = inject(AuthService);
  logout(): void {
    localStorage.removeItem('uid'); // 🧹 امسح uid

    this.myAuth.logout();
  }
}
