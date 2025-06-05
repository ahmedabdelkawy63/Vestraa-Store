import { AllProductsService } from './../../../app/services/all-produtcs.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CloudinaryService } from '../../../app/services/services/cloudinary.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent implements OnInit {
  addProductForm!: FormGroup;
  selectedFile!: File;
  isUploading: boolean = false;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cloud: CloudinaryService,
    private AllProductsService: AllProductsService
  ) {}

  ngOnInit(): void {
    this.addProductForm = this.fb.nonNullable.group({
      id: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(3)]],
      price: [
        '',
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      ],
      quantity: ['', [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      imageCover: ['', Validators.required],
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  submitProduct() {
    if (!this.selectedFile) {
      alert('Please select an image first.');
      return;
    }

    this.isUploading = true;

    this.cloud.uploadImage(this.selectedFile).subscribe({
      next: (res: any) => {
        const imageUrl = res.secure_url;

        const productData = {
          ...this.addProductForm.getRawValue(),
          imageCover: imageUrl,
        };

        this.AllProductsService.addProduct(productData)
          .then(() => {
            console.log('✅ Product added successfully');
            this.router.navigate(['/dashboard/Products']);
          })
          .catch((error) => {
            console.error('❌ Error adding product: ', error);
            alert('Failed to add product. Please try again.');
          })
          .finally(() => {
            this.isUploading = false;
          });
      },
      error: (err) => {
        console.error(
          '❌ Image upload failed:',
          err.error || err.message || err
        );
        alert('Image upload failed. Please try again.');
        this.isUploading = false;
      },
    });
  }
}
