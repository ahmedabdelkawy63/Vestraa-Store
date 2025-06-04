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

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  async addToWishlist(product: any): Promise<void> {
    const user = this.auth.currentUser; // استخدم currentUser من الكائن auth
    if (user) {
      const wishlistDocRef = doc(this.firestore, 'wishlists', user.uid);
      const docSnap = await getDoc(wishlistDocRef);
      if (docSnap.exists()) {
        await updateDoc(wishlistDocRef, {
          items: arrayUnion(product),
        });
      } else {
        await setDoc(wishlistDocRef, {
          items: [product],
        });
      }
    }
  }

  async getWishlist(): Promise<any[]> {
    const user = this.auth.currentUser;
    if (user) {
      const wishlistDocRef = doc(this.firestore, 'wishlists', user.uid);
      const docSnap = await getDoc(wishlistDocRef);
      return docSnap.exists() ? docSnap.data()?.['items'] || [] : [];
    }
    return [];
  }

  async removeFromWishlist(product: any): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      const wishlistDocRef = doc(this.firestore, 'wishlists', user.uid);
      await updateDoc(wishlistDocRef, {
        items: arrayRemove(product),
      });
    }
  }
}
