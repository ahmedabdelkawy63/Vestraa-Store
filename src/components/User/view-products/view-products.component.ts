import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Router, RouterLink } from '@angular/router';
import { AllProductsService } from '../../../app/services/all-produtcs.service';
import { DesPipePipe } from '../../../pipes/des-pipe.pipe';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../loader/loader.component';
import { WishlistService } from '../../../app/services/wishlist-service.service';
import { CartServiceService } from '../../../app/services/cart-service.service';

@Component({
  selector: 'app-view-products',
  standalone: true,
  imports: [
    HeaderComponent,
    DesPipePipe,
    FormsModule,
    LoaderComponent,
    CommonModule,
  ],
  templateUrl: './view-products.component.html',
  styleUrl: './view-products.component.css',
})
export class ViewProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: any = [];
  selectedCategory: string = 'All';
  isLoading: boolean = false;

  constructor(
    private AllProducts: AllProductsService,
    private router: Router,
    private wishlist: WishlistService,
    private cart: CartServiceService
  ) {}

  async getProducts(): Promise<void> {
    this.isLoading = true;
    try {
      const allProducts = await this.AllProducts.fetchProducts();
      this.products = allProducts.map((doc: any) => ({
        id: doc.id,
        ...doc,
      }));
      this.filteredProducts = [...this.products];
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      this.isLoading = false;
    }
  }

  filterByCategory(categoryName: string): void {
    this.filteredProducts = this.products.filter(
      (product) =>
        product?.category?.name?.toLowerCase() === categoryName.toLowerCase()
    );
  }

  showAllProducts(): void {
    this.filteredProducts = [...this.products];
  }

  async ngOnInit(): Promise<void> {
    await this.getProducts();
  }

  handleSearch(val: string): void {
    const searchText = val.toLowerCase();
    this.filteredProducts = this.products.filter((product) =>
      product.title.toLowerCase().includes(searchText)
    );
  }

  goToDetails(productId: string) {
    this.router.navigate(['/product', productId]);
  }

  addToWishlist(product: any) {
    this.wishlist.addToWishlist(product);
  }
  addToCart(product: any) {
    this.cart.addToCart(product);
    this.openCartPopup();
  }
  showPopup: boolean = false;
  openCartPopup() {
    this.showPopup = true;

    setTimeout(() => {
      this.showPopup = false;
    }, 3000);
  }
}
