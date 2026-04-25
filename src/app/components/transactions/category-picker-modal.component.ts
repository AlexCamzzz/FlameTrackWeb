import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { CategoryDto } from '../../models/transaction.dto';

@Component({
  selector: 'app-category-picker-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in" (click)="close.emit()">
      <div class="bg-[#2C2938] border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up" (click)="$event.stopPropagation()">
        
        <div class="p-8 border-b border-white/5 flex justify-between items-center bg-black/10">
          <div>
            <h2 class="text-2xl font-black text-white">Select Category</h2>
            <p class="text-subtle text-sm font-bold uppercase tracking-widest mt-1">Organize your transaction</p>
          </div>
          <button (click)="close.emit()" class="w-12 h-12 bg-white/5 rounded-2xl hover:bg-white/10 text-white transition-all flex items-center justify-center border border-white/5">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-8 space-y-8">
          <!-- Search Bar -->
          <div class="relative">
            <input type="text" [(ngModel)]="searchTerm" placeholder="Search categories..." 
              class="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-subtle font-bold focus:outline-none focus:border-primary transition-all shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 absolute right-6 top-4 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Category Grid -->
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            <div *ngFor="let cat of filteredCategories()" 
                 (click)="select(cat)"
                 class="group relative p-6 bg-black/20 border border-white/5 rounded-3xl cursor-pointer transition-all hover:bg-white/5 hover:border-white/20 flex flex-col items-center justify-center space-y-3 text-center">
              <div class="w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center text-white transition-transform group-hover:scale-110 group-active:scale-90" 
                   [style.backgroundColor]="cat.color">
                <span class="text-2xl font-black">{{ cat.name.substring(0, 1) }}</span>
              </div>
              <span class="text-sm font-black text-subtle group-hover:text-white transition-colors">{{ cat.name }}</span>
              <div class="absolute top-3 right-3 w-2 h-2 rounded-full opacity-40" [style.backgroundColor]="cat.color"></div>
            </div>

            <!-- Create New Option if no match -->
            <div *ngIf="searchTerm && !exactMatchExists()" 
                 (click)="isCreating = true"
                 class="p-6 bg-primary/10 border-2 border-dashed border-primary/30 rounded-3xl cursor-pointer hover:bg-primary/20 transition-all flex flex-col items-center justify-center space-y-2 text-center group">
              <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:rotate-90 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" /></svg>
              </div>
              <span class="text-xs font-black text-primary uppercase tracking-tighter">Create "{{ searchTerm }}"</span>
            </div>
          </div>

          <!-- Inline Creation Form (Conditional) -->
          <div *ngIf="isCreating || (searchTerm && !exactMatchExists())" class="p-6 bg-black/30 rounded-[2rem] border border-white/5 animate-fade-in">
             <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-black text-white uppercase tracking-widest">New Category Detail</h3>
                <button (click)="isCreating = false" class="text-subtle hover:text-white text-xs font-bold">Cancel</button>
             </div>
             <div class="flex items-center space-x-6">
                <div class="flex flex-col items-center space-y-2">
                   <div class="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl cursor-pointer group">
                      <input type="color" [(ngModel)]="newColor" class="absolute inset-[-10px] w-[80px] h-[80px] cursor-pointer p-0 m-0 border-0 bg-transparent">
                      <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                         <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </div>
                   </div>
                   <span class="text-[10px] font-mono text-subtle">{{ newColor | uppercase }}</span>
                </div>
                <div class="flex-1 space-y-4">
                   <input type="text" [(ngModel)]="searchTerm" placeholder="Category Name" class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white font-bold focus:outline-none focus:border-primary">
                   <button (click)="createNew()" [disabled]="!searchTerm || isSaving" class="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-3 font-black text-sm transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
                      {{ isSaving ? 'Saving...' : 'Save & Select' }}
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CategoryPickerModalComponent implements OnInit {
  @Output() selectCategory = new EventEmitter<CategoryDto>();
  @Output() close = new EventEmitter<void>();

  categoryService = inject(CategoryService);
  
  searchTerm = '';
  isCreating = false;
  isSaving = false;
  newColor = '#FF5722';

  ngOnInit() {
    this.categoryService.loadCategories();
  }

  filteredCategories() {
    return this.categoryService.categories().filter(c => 
      c.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  exactMatchExists() {
    return this.categoryService.categories().some(c => 
      c.name.toLowerCase() === this.searchTerm.toLowerCase()
    );
  }

  select(category: CategoryDto) {
    this.selectCategory.emit(category);
    this.close.emit();
  }

  async createNew() {
    if (!this.searchTerm) return;
    this.isSaving = true;
    try {
      const newCat = await this.categoryService.createCategory(this.searchTerm, this.newColor);
      if (newCat) {
        this.select(newCat);
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.isSaving = false;
    }
  }
}
