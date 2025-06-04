import { Injectable } from '@angular/core';
import {
  collection,
  getDocs,
  Firestore,
  doc,
  deleteDoc,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private firestore: Firestore) {}
  async fetchOrders() {
    try {
      const querySnapshot = await getDocs(collection(this.firestore, 'orders'));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }
  async updateOrderStatus(
    orderId: string,
    status: 'success' | 'rejected'
  ): Promise<void> {
    try {
      const orderRef = doc(this.firestore, 'orders', orderId);
      await updateDoc(orderRef, { status });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
  async getPendingOrdersCount(): Promise<number> {
    const ordersRef = collection(this.firestore, 'orders');
    const snapshot = await getDocs(ordersRef);
    const pendingOrders = snapshot.docs.filter(
      (doc) => doc.data()['status'] === 'pending'
    );
    return pendingOrders.length;
  }
}
