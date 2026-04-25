import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 space-y-8 animate-fade-in">
      <header class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl shadow flex items-center justify-center shadow-primary/20">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold">Categories Management</h1>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Create new category -->
        <div class="card lg:col-span-1 h-fit">
          <h2 class="text-lg font-semibold mb-6">Create Custom Category</h2>
          <form (ngSubmit)="createNewCategory()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-subtle mb-1">Category Name</label>
              <input type="text" name="name" [(ngModel)]="newCategoryName" required placeholder="e.g. Subscriptions"
                class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-subtle/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
            </div>

            <div>
              <label class="block text-sm font-medium text-subtle mb-1">Color</label>
              <div class="flex items-center space-x-4">
                <div class="relative w-10 h-10 rounded-xl overflow-hidden border border-white/20 shadow-inner flex-shrink-0">
                  <input type="color" name="color" [(ngModel)]="newCategoryColor" class="absolute inset-[-10px] w-[60px] h-[60px] cursor-pointer p-0 m-0 border-0">
                </div>
                <div class="text-sm text-subtle font-mono">{{ newCategoryColor | uppercase }}</div>
              </div>
            </div>

            <div class="pt-2">
              <button type="submit" [disabled]="isSubmitting || !newCategoryName" class="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl px-4 py-2.5 font-bold transition-all disabled:opacity-50 shadow-lg shadow-primary/20">
                {{ isSubmitting ? 'Creating...' : 'Create Category' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Category list -->
        <div class="card lg:col-span-2">
          <h2 class="text-lg font-semibold mb-6">Your Categories</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div *ngFor="let cat of categoryService.categories()" class="flex items-center justify-between p-3 bg-black/20 border border-white/5 rounded-xl hover:border-white/10 transition-colors group">
              <div class="flex items-center space-x-3">
                <div class="w-4 h-4 rounded-full shadow-inner shadow-black/20" [style.backgroundColor]="cat.color"></div>
                <div>
                  <div class="font-medium group-hover:text-white transition-colors">{{ cat.name }}</div>
                  <div class="text-xs text-subtle">{{ cat.isStandard ? 'Standard Category' : 'Custom Category' }}</div>
                </div>
              </div>
              <button *ngIf="!cat.isStandard" (click)="deleteCategory(cat.id)" class="text-subtle hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-all" title="Delete custom category">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          
          <div *ngIf="categoryService.categories().length === 0" class="p-8 text-center text-subtle">
            No categories found.
          </div>
        </div>

      </div>
    </div>
  `
})
export class CategoriesComponent implements OnInit {
  protected categoryService = inject(CategoryService);
  
  newCategoryName = '';
  newCategoryColor = '#FF5722';
  isSubmitting = false;

  ngOnInit() {
    this.categoryService.loadCategories();
  }

  async createNewCategory() {
    if (!this.newCategoryName) return;
    this.isSubmitting = true;
    try {
      await this.categoryService.createCategory(this.newCategoryName, this.newCategoryColor);
      this.newCategoryName = '';
      this.newCategoryColor = '#FF5722';
    } finally {
      this.isSubmitting = false;
    }
  }

  async deleteCategory(id: string) {
    if (confirm('Are you sure you want to delete this custom category?')) {
      await this.categoryService.deleteCategory(id);
    }
  }
}
