import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { OrdersService } from '../../../app/services/orders.service';
import { doc, Firestore } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [SidebarComponent, CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  confirmStatus = false;
  orders: any[] = [];
  constructor(
    private ordersService: OrdersService,
    private firestore: Firestore
  ) {}
  ngOnInit(): void {
    this.getAllOrders();
  }

  confimOrder() {
    this.confirmStatus = true;
    console.log('wwwwwww');
  }
  async getAllOrders(): Promise<void> {
    const allOrders = await this.ordersService.fetchOrders();
    this.orders = allOrders.map((doc: any) => ({
      id: doc.id,
      ...doc,
    }));
    console.log(this.orders);
  }
  async confirmOrder(orderId: string) {
    try {
      await this.ordersService.updateOrderStatus(orderId, 'success');
      this.getAllOrders();
    } catch (err) {
      console.error('Error confirming order', err);
    }
  }

  async rejectOrder(orderId: string) {
    try {
      await this.ordersService.updateOrderStatus(orderId, 'rejected');
      this.getAllOrders();
    } catch (err) {
      console.error('Error rejecting order', err);
    }
  }
}
