import { OrdersService } from './../../../app/services/orders.service';
import { Component, OnInit } from '@angular/core';
import { AllProductsService } from '../../../app/services/all-produtcs.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { OrdersComponent } from '../orders/orders.component';
import { collection, getDocs, Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
})
export class StatisticsComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  orders: any[] = [];
  constructor(
    private fetchAllproducts: AllProductsService,
    private ordersService: OrdersService,
    private Firestore: Firestore
  ) {}
  async ngOnInit(): Promise<void> {
    this.fetchAllProducts();
    this.getAllOrders();
    this.pendingOrdersCount = await this.ordersService.getPendingOrdersCount();
    this.loadOrders();
  }
  async loadOrders() {
    const ordersRef = collection(this.Firestore, 'orders');
    const querySnapshot = await getDocs(ordersRef);
    this.orders = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
    }));

    this.successOrdersCount = this.orders.filter(
      (order) => order.status === 'success'
    ).length;
  }

  async fetchAllProducts(): Promise<void> {
    const allProducts = await this.fetchAllproducts.fetchProducts();
    this.products = allProducts;
    console.log(this.products.length);
  }
  async getAllOrders(): Promise<void> {
    this.orders = await this.ordersService.fetchOrders();
    console.log(this.orders.length);
  }

  pendingOrdersCount = 0;
  successOrdersCount: number = 0;
}
