import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative">
      <div class="flex flex-wrap gap-2 p-2 min-h-[44px] bg-black/20 border border-white/10 rounded-xl items-center cursor-text transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary" (click)="openSelector()">
        <span *ngIf="selectedCategoryId" class="flex items-center px-2 py-1 rounded-md text-sm font-medium text-white shadow-sm" [style.backgroundColor]="categoryService.getCategoryColor(selectedCategoryId)">
          {{ categoryService.getCategoryName(selectedCategoryId) }}
          <button type="button" (click)="removeCategory(); $event.stopPropagation()" class="ml-2 hover:text-white/70 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </span>
        <input *ngIf="!selectedCategoryId" #searchInput type="text" [(ngModel)]="searchTerm" (ngModelChange)="isOpen = true" (focus)="isOpen = true" placeholder="Select category..." class="bg-transparent border-none focus:outline-none focus:ring-0 text-sm flex-1 min-w-[100px] text-white placeholder-subtle/50">
      </div>

      <div *ngIf="isOpen" class="absolute z-50 w-full mt-2 bg-surface border border-border/20 rounded-xl shadow-2xl overflow-hidden animate-slide-up">
        <div class="fixed inset-0 z-[-1]" (click)="isOpen = false"></div>
        
        <div class="max-h-60 overflow-y-auto p-2 space-y-1 relative z-10">
          <div *ngFor="let cat of filteredCategories()" (click)="selectCategory(cat.id)" class="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
            <div class="flex items-center space-x-3">
              <div class="w-3 h-3 rounded-full shadow-inner shadow-black/20" [style.backgroundColor]="cat.color"></div>
              <span class="text-sm font-medium group-hover:text-white transition-colors" [ngClass]="{'text-white': selectedCategoryId === cat.id, 'text-subtle': selectedCategoryId !== cat.id}">{{ cat.name }}</span>
            </div>
            <svg *ngIf="selectedCategoryId === cat.id" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <div *ngIf="searchTerm && !exactMatchExists()" class="p-3 border-t border-border/20 mt-2 bg-black/10 rounded-lg">
            <p class="text-xs text-subtle mb-3">Create custom category: <span class="text-white font-medium">"{{ searchTerm }}"</span></p>
            <div class="flex items-center space-x-3">
              <div class="relative w-8 h-8 rounded-lg overflow-hidden border border-white/20 flex-shrink-0 cursor-pointer" title="Pick color">
                 <input type="color" [(ngModel)]="newCategoryColor" class="absolute inset-[-10px] w-[50px] h-[50px] cursor-pointer p-0 m-0 border-0">
              </div>
              <button type="button" (click)="createNewCategory()" [disabled]="isCreating" class="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-lg py-1.5 text-xs font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
                {{ isCreating ? 'Creating...' : 'Create & Select' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CategorySelectorComponent implements OnInit {
  categoryService = inject(CategoryService);
  
  @Input() selectedCategoryId: string = '';
  @Output() selectedCategoryIdChange = new EventEmitter<string>();

  isOpen = false;
  searchTerm = '';
  newCategoryColor = '#FF5722';
  isCreating = false;

  ngOnInit() {
    this.categoryService.loadCategories();
  }

  openSelector() {
    this.isOpen = true;
    this.searchTerm = '';
  }

  filteredCategories() {
    const cats = this.categoryService.categories();
    if (!this.searchTerm) return cats;
    return cats.filter(c => c.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  exactMatchExists() {
    return this.categoryService.categories().some(c => c.name.toLowerCase() === this.searchTerm.toLowerCase());
  }

  selectCategory(id: string) {
    this.selectedCategoryId = id;
    this.selectedCategoryIdChange.emit(this.selectedCategoryId);
    this.isOpen = false;
  }

  removeCategory() {
    this.selectedCategoryId = '';
    this.selectedCategoryIdChange.emit(this.selectedCategoryId);
    setTimeout(() => this.isOpen = true, 50); // Re-open so they can select a new one
  }

  async createNewCategory() {
    if (!this.searchTerm) return;
    this.isCreating = true;
    try {
      const newCat = await this.categoryService.createCategory(this.searchTerm, this.newCategoryColor);
      if (newCat) {
        this.selectCategory(newCat.id);
        this.searchTerm = '';
        this.newCategoryColor = '#FF5722';
      }
    } finally {
      this.isCreating = false;
    }
  }
}
