import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CartServiceService } from '../../../app/services/cart-service.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DesPipePipe } from '../../../pipes/des-pipe.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterLink, DesPipePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  cart: any[] = [];
  subtotal: number = 0;
  shipping: number = 0;
  discount: number = 0;
  total: number = 0;

  constructor(private cartService: CartServiceService) {}

  ngOnInit() {
    this.loadCart();
  }
  private cartItems: any[] = [];

  async clearCart() {
    await this.cartService.clearCart();
    this.cart = [];
  }

  async loadCart() {
    this.cart = await this.cartService.getCart();
    this.calculateTotal();
  }

  async remove(product: any) {
    await this.cartService.removeFromCart(product);
    this.cart = this.cart.filter((item) => item.id !== product.id);
    this.calculateTotal();
  }

  async increaseQuantity(item: any) {
    item.quantity = (item.quantity || 1) + 1;
    await this.cartService.updateItemQuantity(item);
    this.calculateTotal();
  }

  async decreaseQuantity(item: any) {
    if (item.quantity && item.quantity > 1) {
      item.quantity--;
      await this.cartService.updateItemQuantity(item);
      this.calculateTotal();
    }
  }

  calculateTotal() {
    this.subtotal = this.cart.reduce(
      (acc, item) => acc + item.price * (item.quantity || 1),
      0
    );
    this.shipping = 4.99;
    this.discount = 3.99;

    this.total = this.subtotal + this.shipping - this.discount;
    this.cartService.updateSubtotal(this.subtotal);
    this.cartService.updateTotal(this.total);
    this.cartService.updateShipping(this.shipping);
    this.cartService.updateDiscount(this.discount);
  }
}
