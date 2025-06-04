import { Injectable, inject } from '@angular/core';
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
export class AllCategoriesService {
  private firestore = inject(Firestore);

  constructor() {}

  async fetchCategories() {
    try {
      const querySnapshot = await getDocs(
        collection(this.firestore, 'categories')
      );
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
  async updateCategory(id: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, 'categories', id);
    await updateDoc(docRef, data);
  }

  async deleteCategory(id: string): Promise<void> {
    const docRef = doc(this.firestore, 'categories', id);
    await deleteDoc(docRef);
  }
}
