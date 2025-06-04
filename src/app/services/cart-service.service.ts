import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartServiceService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  async addToCart(product: any): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;

    const cartDocRef = doc(this.firestore, 'carts', user.uid);
    const docSnap = await getDoc(cartDocRef);

    if (docSnap.exists()) {
      const items = docSnap.data()?.['items'] || [];
      const existingItem = items.find((item: any) => item.id === product.id);
      let newItems;
      if (existingItem) {
        newItems = items.map((item: any) =>
          item.id === product.id
            ? {
                ...item,
                quantity: (item.quantity || 1) + 1, // فقط نزيد 1 على الموجود
              }
            : item
        );
        await updateDoc(cartDocRef, { items: newItems });
      } else {
        const newProduct = { ...product, quantity: 1 }; // نضيف الكمية هنا بوضوح
        await updateDoc(cartDocRef, {
          items: arrayUnion(newProduct),
        });
      }
    } else {
      const newProduct = { ...product, quantity: 1 }; // في أول مرة، نضيف الكمية أيضًا
      await setDoc(cartDocRef, {
        items: [newProduct],
      });
    }
  }

  async getCart(): Promise<any[]> {
    const user = this.auth.currentUser;
    if (!user) return [];

    const cartDocRef = doc(this.firestore, 'carts', user.uid);
    const docSnap = await getDoc(cartDocRef);

    return docSnap.exists() ? docSnap.data()?.['items'] || [] : [];
  }

  async removeFromCart(product: any): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;

    const cartDocRef = doc(this.firestore, 'carts', user.uid);
    await updateDoc(cartDocRef, {
      items: arrayRemove(product),
    });
  }

  async updateItemQuantity(updatedItem: any): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;

    const cartDocRef = doc(this.firestore, 'carts', user.uid);
    const docSnap = await getDoc(cartDocRef);
    if (!docSnap.exists()) return;

    const items = docSnap.data()?.['items'] || [];

    // استبدل المنتج القديم بالجديد مع تحديث الكمية
    const newItems = items.map((item: any) =>
      item.id === updatedItem.id ? updatedItem : item
    );

    await updateDoc(cartDocRef, {
      items: newItems,
    });
  }
  private subtotalSource = new BehaviorSubject<number>(0);
  private totalSource = new BehaviorSubject<number>(0);
  private shippingSource = new BehaviorSubject<number>(0);
  private discountSource = new BehaviorSubject<number>(0);

  subtotal$ = this.subtotalSource.asObservable();
  total$ = this.totalSource.asObservable();
  shipping$ = this.shippingSource.asObservable();
  discount$ = this.discountSource.asObservable();

  updateSubtotal(value: number) {
    this.subtotalSource.next(value);
  }
  updateTotal(value: number) {
    this.totalSource.next(value);
  }
  updateShipping(value: number) {
    this.shippingSource.next(value);
  }
  updateDiscount(value: number) {
    this.discountSource.next(value);
  }
  async clearCart(): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;

    const cartDocRef = doc(this.firestore, 'carts', user.uid);
    await setDoc(cartDocRef, { items: [] }, { merge: true });

    // حدث القيم المحلية عشان تعكس السلة الفاضية
    this.updateSubtotal(0);
    this.updateTotal(0);
    this.updateShipping(0);
    this.updateDiscount(0);
  }
}
