import { Injectable, inject } from '@angular/core';
import {
  collection,
  getDocs,
  Firestore,
  CollectionReference,
  DocumentData,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AllProductsService {
  private firestore = inject(Firestore);
  private productCollection: CollectionReference<DocumentData>;

  constructor() {
    this.productCollection = collection(this.firestore, 'products');
  }
  addProduct(productData: any) {
    const { id, ...cleanedData } = productData;

    return addDoc(this.productCollection, cleanedData);
  }
  async fetchProducts() {
    try {
      const querySnapshot = await getDocs(
        collection(this.firestore, 'products')
      );
      return querySnapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
  deleteProduct(id: string) {
    const productDocRef = doc(this.firestore, `products/${id}`);
    return deleteDoc(productDocRef);
  }

  getProductById(docId: string) {
    const docRef = doc(this.firestore, 'products', docId);
    return getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        throw new Error('No such document!');
      }
    });
  }

  updateProduct(docId: string, data: any) {
    const docRef = doc(this.firestore, 'products', docId);
    return updateDoc(docRef, data);
  }
}
