import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CartServiceService } from '../../../app/services/cart-service.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  Firestore,
  collection,
  addDoc,
  Timestamp,
} from '@angular/fire/firestore';
import { RouterLink } from '@angular/router';
import { Auth, user } from '@angular/fire/auth';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [HeaderComponent, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  cart: any[] = [];
  subtotal: number = 0;
  total: number = 0;
  shipping: number = 0;
  discount: number = 0;
  myForm!: FormGroup;
  isOrder: boolean = false;

  constructor(
    private cartService: CartServiceService,
    private firestore: Firestore,
    private auth: Auth
  ) {
    this.cartService.subtotal$.subscribe((value) => (this.subtotal = value));
    this.cartService.total$.subscribe((value) => (this.total = value));
    this.cartService.shipping$.subscribe((value) => (this.shipping = value));
    this.cartService.discount$.subscribe((value) => (this.discount = value));
  }
  ngOnInit(): void {
    this.loadCart();
    this.myForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9\-\+\s]*$/),
        Validators.minLength(7),
        Validators.maxLength(15),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      city: new FormControl(''),
      zip: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{5}$/),
      ]),
      address: new FormControl(''),
    });
  }
  async onSubmit() {
    if (this.myForm.valid) {
      const currentUser = await this.auth.currentUser;
      if (!currentUser) {
        alert('User not authenticated.');
        return;
      }
      const now = new Date();
      console.log('🚀 Order Timestamp:', now);

      const orderData = {
        customer: {
          ...this.myForm.value,
          userId: currentUser.uid,
        },
        cart: this.cart,
        subtotal: this.subtotal,
        shipping: this.shipping,
        discount: this.discount,
        total: this.total,
        createdAt: Timestamp.fromDate(new Date()),
        status: 'pending',
      };

      try {
        const ordersRef = collection(this.firestore, 'orders');
        await addDoc(ordersRef, orderData);
        this.isOrder = true;

        this.myForm.reset();
        await this.cartService.clearCart();
        this.cart = [];
      } catch (error) {
        console.error('Error adding order: ', error);
        alert('Something went wrong while submitting the order.');
      }
    } else {
      this.myForm.markAllAsTouched();
    }
  }

  async loadCart() {
    this.cart = await this.cartService.getCart();
    console.log(this.cart);
  }
}
