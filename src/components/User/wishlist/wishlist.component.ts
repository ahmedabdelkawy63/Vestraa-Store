import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../../app/services/wishlist-service.service';
import { DesPipePipe } from '../../../pipes/des-pipe.pipe';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [HeaderComponent, RouterLink, DesPipePipe],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent {
  wishlist: any[] = [];

  constructor(private wishlistservice: WishlistService) {}
  ngOnInit() {
    this.loadWishlist();
  }

  async loadWishlist() {
    this.wishlist = await this.wishlistservice.getWishlist();
  }
  remove(product: any) {
    this.wishlistservice.removeFromWishlist(product).then(() => {
      this.loadWishlist();
    });
  }
}
