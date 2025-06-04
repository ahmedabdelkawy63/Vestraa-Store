import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ActivatedRoute } from '@angular/router';
import { AllProductsService } from '../../../app/services/all-produtcs.service';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { CartServiceService } from '../../../app/services/cart-service.service';

@Component({
  selector: 'app-details-product',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './details-product.component.html',
  styleUrl: './details-product.component.css',
})
export class DetailsProductComponent {
  productId!: string;

  product: any;

  constructor(
    private route: ActivatedRoute,
    private productService: AllProductsService,
    private firestore: Firestore,
    private cartService: CartServiceService
  ) {}

  async ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id')!;

    const docRef = doc(this.firestore, 'products', this.productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.product = docSnap.data();
    } else {
      console.log('No such document!');
    }
  }
  addToCart() {
    this.cartService.addToCart(this.product);
  }
}
