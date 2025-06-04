import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  private cloudName = 'dzmtecyh9';
  private uploadPreset = 'vestraa';

  constructor(private http: HttpClient) {}

  uploadImage(file: File) {
    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
    const formData = new FormData();

    formData.append('file', file); // ✅ لازم يكون File مش فاضي
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', 'samples/ecommerce'); // ✅ مهم جدًا لو محدد folder في الإعدادات

    return this.http.post(url, formData);
  }
}
