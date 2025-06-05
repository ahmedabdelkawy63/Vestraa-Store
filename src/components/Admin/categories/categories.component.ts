import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AllProductsService } from '../../../app/services/all-produtcs.service';
import { AllCategoriesService } from '../../../app/services/allcategories.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [SidebarComponent, CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  isEditing: boolean = false;
  selectedCategory: any = null;
  editedCategoryName: string = '';

  categories: any[] = [];
  constructor(private cate: AllCategoriesService) {}
  ngOnInit(): void {
    this.getAllCategories();
  }

  async getAllCategories(): Promise<void> {
    const allcate = await this.cate.fetchCategories();
    this.categories = allcate.map((doc: any) => ({
      id: doc.id,
      ...doc,
    }));
    console.log(this.categories);
  }
  editCate(cat: any) {
    this.isEditing = true;
    this.editedCategoryName = cat.name;
    this.selectedCategory = cat;
  }
  async updateCategory(): Promise<void> {
    if (this.selectedCategory) {
      await this.cate.updateCategory(this.selectedCategory.id, {
        name: this.editedCategoryName,
      });
      this.isEditing = false;
      this.getAllCategories();
    }
  }

  async deleteCategory(cat: any): Promise<void> {
    await this.cate.deleteCategory(cat.id);
    this.getAllCategories();
  }
}
