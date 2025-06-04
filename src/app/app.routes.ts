import { AdminGuard } from './garuds/admin.guard';
import { Routes } from '@angular/router';
import { LoginComponent } from '../components/Auth/login/login.component';
import { RegisterComponent } from '../components/Auth/register/register.component';
import { OrdersComponent } from '../components/Admin/orders/orders.component';
import { ProductsComponent } from '../components/Admin/products/products.component';
import { CategoriesComponent } from '../components/Admin/categories/categories.component';
import { EditProductComponent } from '../components/Admin/edit-product/edit-product.component';
import { AddProductComponent } from '../components/Admin/add-product/add-product.component';
import { WishlistComponent } from '../components/User/wishlist/wishlist.component';
import { StatisticsComponent } from '../components/Admin/statistics/statistics.component';
import { HomeComponent } from '../components/Home/home/home.component';
import { ViewProductsComponent } from '../components/User/view-products/view-products.component';
import { CartComponent } from '../components/User/cart/cart.component';
import { ProfileComponent } from '../components/User/profile/profile.component';
import { DashboardComponent } from '../components/Admin/dashboard/dashboard.component';
import { DetailsProductComponent } from '../components/User/details-product/details-product.component';
import { NotfoundComponent } from '../components/notfound/notfound.component';
import { UnauthorizedComponent } from '../components/unauthorized/unauthorized.component';
import { AuthGuard } from './garuds/authguard.guard';
import { CheckoutComponent } from '../components/User/checkout/checkout.component';
import { MyOrdersComponent } from '../components/User/my-orders/my-orders.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'products',
    loadComponent: () =>
      import('../components/User/view-products/view-products.component').then(
        (m) => m.ViewProductsComponent
      ),
  },
  { path: 'product/:id', component: DetailsProductComponent },
  {
    path: 'cart',
    canActivate: [AuthGuard],

    loadComponent: () =>
      import('../components/User/cart/cart.component').then(
        (m) => m.CartComponent
      ),
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('../components/User/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard/Products',
    canActivate: [AdminGuard],
    loadComponent: () =>
      import('../components/Admin/products/products.component').then(
        (m) => m.ProductsComponent
      ),
  },
  {
    path: 'dashboard/Categories',
    canActivate: [AdminGuard],

    loadComponent: () =>
      import('../components/Admin/categories/categories.component').then(
        (m) => m.CategoriesComponent
      ),
  },
  {
    path: 'dashboard/Orders',
    canActivate: [AdminGuard],

    loadComponent: () =>
      import('../components/Admin/orders/orders.component').then(
        (m) => m.OrdersComponent
      ),
  },
  {
    path: 'dashboard/AddProduct',
    canActivate: [AdminGuard],

    loadComponent: () =>
      import('../components/Admin/add-product/add-product.component').then(
        (m) => m.AddProductComponent
      ),
  },
  {
    path: 'dashboard/editProduct/:id',
    canActivate: [AdminGuard],

    loadComponent: () =>
      import('../components/Admin/edit-product/edit-product.component').then(
        (m) => m.EditProductComponent
      ),
  },
  {
    path: 'dashboard/statistics',
    canActivate: [AdminGuard],

    loadComponent: () =>
      import('../components/Admin/statistics/statistics.component').then(
        (m) => m.StatisticsComponent
      ),
  },
  {
    path: 'dashboard',
    canActivate: [AdminGuard],

    loadComponent: () =>
      import('../components/Admin/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },

  {
    path: 'wishlist',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('../components/User/wishlist/wishlist.component').then(
        (m) => m.WishlistComponent
      ),
  },
  {
    path: 'checkout',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('../components/User/checkout/checkout.component').then(
        (m) => m.CheckoutComponent
      ),
  },
  {
    path: 'myorders',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('../components/User/my-orders/my-orders.component').then(
        (m) => m.MyOrdersComponent
      ),
  },
  {
    path: 'cart',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('../components/User/cart/cart.component').then(
        (m) => m.CartComponent
      ),
  },

  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', component: NotfoundComponent },
];
