import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RouterLink } from '@angular/router';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import {
  collection,
  Firestore,
  query,
  where,
  onSnapshot,
} from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [HeaderComponent, RouterLink, CommonModule, FormsModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css',
})
export class MyOrdersComponent {
  myOrders: any[] = [];

  constructor(private auth: Auth, private firestore: Firestore) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (!user) return;

      const ordersRef = collection(this.firestore, 'orders');
      const q = query(ordersRef, where('customer.userId', '==', user.uid));
      onSnapshot(q, (snapshot) => {
        this.myOrders = snapshot.docs.map((doc) => {
          const data = doc.data();

          let createdAtDate: Date | null = null;

          // ✅ دعم كل الحالات: Timestamp أو ISO string
          if (data['createdAt']?.toDate) {
            createdAtDate = data['createdAt'].toDate();
          } else if (typeof data['createdAt'] === 'string') {
            createdAtDate = new Date(data['createdAt']);
          }

          const formattedDate = createdAtDate
            ? createdAtDate.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : 'N/A';

          return {
            id: doc.id,
            ...data,
            createdAt: formattedDate,
          };
        });

        console.log('Updated Orders:', this.myOrders);
      });
    });
  }
}
