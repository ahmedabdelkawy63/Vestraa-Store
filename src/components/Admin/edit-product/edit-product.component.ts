import { CloudinaryService } from './../../../app/services/services/cloudinary.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { doc, Firestore, getDoc, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent {
  imagePreviewUrl: string = '';

  productId!: string;
  editProductForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private fb: FormBuilder,
    private router: Router,
    private cloud: CloudinaryService
  ) {}

  ngOnInit() {
    this.initForm();

    this.editProductForm.valueChanges.subscribe(() => {
      console.log('Form valid?', this.editProductForm.valid);
      console.log('Form dirty?', this.editProductForm.dirty);
    });

    this.productId = this.route.snapshot.paramMap.get('id')!;
    if (this.productId) {
      this.loadProductData(this.productId);
    }
  }

  initForm() {
    this.editProductForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', [Validators.required]],
      title: ['', [Validators.required, Validators.minLength(3)]],
      price: [
        '',
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      ],
      quantity: ['', [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      imageCover: ['', [Validators.required]],
    });
  }

  async loadProductData(id: string) {
    const docRef = doc(this.firestore, 'products', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      this.editProductForm.patchValue({
        id,
        category: data['category'],
        title: data['title'],
        price: data['price'],
        quantity: data['quantity'],
        description: data['description'],
        imageCover: data['imageCover'] || '',
      });
      this.imagePreviewUrl = data['imageCover'];
    } else {
      console.warn('Product not found!');
    }
  }

  async updateProduct() {
    if (this.editProductForm.valid) {
      const updatedProduct = this.editProductForm.value;

      try {
        const docRef = doc(this.firestore, 'products', this.productId);
        await updateDoc(docRef, updatedProduct);
        this.router.navigate(['/dashboard/Products']);

        console.log('Product updated successfully:', updatedProduct);
      } catch (error) {
        console.error('Error updating product:', error);
      }
    } else {
      console.warn('Form is invalid');
    }
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];

      this.cloud.uploadImage(file).subscribe({
        next: (res: any) => {
          const imageUrl = res.secure_url;
          this.imagePreviewUrl = imageUrl;
          this.editProductForm.patchValue({ imageCover: imageUrl });
        },
        error: (err: any) => {
          console.error('Error uploading image to Cloudinary:', err);
        },
      });
    }
  }
  cancle() {
    this.router.navigate(['dashboard/Products']);
  }
}
