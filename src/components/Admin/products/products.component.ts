import { AllProductsService } from './../../../app/services/all-produtcs.service';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Iproduct } from '../../../app/model/iproduct';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterLink, SidebarComponent, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  products: any[] = [];

  constructor(
    private fetchProducts: AllProductsService,
    private router: Router
  ) {}
  async fetchallProducts(): Promise<void> {
    const allProducts = await this.fetchProducts.fetchProducts();
    this.products = allProducts.map((doc: any) => ({
      id: doc.id,
      ...doc,
    }));

    console.log(this.products);
  }
  ngOnInit(): void {
    this.fetchallProducts();
  }

  showDeleteModal: boolean = false;
  pendingDeleteDocId: string | null = null;
  pendingDeleteIndex: number | null = null;

  openDeleteModal(docId: string, index: number) {
    console.log('✅', docId, index);

    this.pendingDeleteDocId = docId;
    this.pendingDeleteIndex = index;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.pendingDeleteDocId = null;
    this.pendingDeleteIndex = null;
    this.showDeleteModal = false;
  }

  async confirmDelete() {
    if (this.pendingDeleteDocId !== null && this.pendingDeleteIndex !== null) {
      try {
        await this.fetchProducts.deleteProduct(this.pendingDeleteDocId);
        this.products.splice(this.pendingDeleteIndex, 1);
      } catch (error) {
        console.error('❌ ', error);
      }
      this.cancelDelete();
    }
  }

  editProduct(docId: string) {
    this.router.navigate(['/dashboard/editProduct', docId]);
  }
}
