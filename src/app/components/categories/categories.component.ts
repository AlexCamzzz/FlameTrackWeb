import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { TutorialService } from '../../services/tutorial.service';
import { CategoryDto } from '../../models/transaction.dto';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <header class="flex justify-between items-end border-b border-border pb-6">
        <div class="flex items-center space-x-3">
          <h1 class="text-2xl font-black text-foreground uppercase tracking-widest">Categories</h1>
          <button (click)="tutorial.start()" class="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all text-[10px] font-black border border-primary/20">?</button>
          <div class="h-1 w-8 bg-primary mt-2"></div>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- List -->
        <div class="space-y-4" data-tutorial="category-list">
           <h2 class="text-[10px] font-black uppercase tracking-widest text-subtle ml-2">Active Classifications</h2>
           <div class="card !p-2 divide-y divide-border/20 shadow-sm">
              @for (cat of categoryService.categories(); track cat.id) {
                <div class="flex items-center justify-between p-4 group">
                   <div class="flex items-center space-x-4">
                      <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-inner opacity-90 group-hover:opacity-100 transition-opacity" [style.backgroundColor]="cat.color">
                        {{ cat.name.substring(0, 1).toUpperCase() }}
                      </div>
                      <span class="text-sm font-bold text-foreground/90 uppercase tracking-tight">{{ cat.name }}</span>
                   </div>
                   @if (!cat.isStandard) {
                      <button (click)="deleteCategory(cat.id)" class="w-8 h-8 rounded-lg flex items-center justify-center text-subtle hover:bg-expense/10 hover:text-expense transition-all opacity-0 group-hover:opacity-100">
                         <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                   } @else {
                      <span class="text-[8px] font-black uppercase tracking-widest text-subtle opacity-30 px-2">System</span>
                   }
                </div>
              }
           </div>
        </div>

        <!-- Create -->
        <div class="space-y-4" data-tutorial="category-create-form">
           <h2 class="text-[10px] font-black uppercase tracking-widest text-subtle ml-2">New Classification</h2>
           <div class="card !p-8 space-y-6 shadow-sm">
              <div>
                <label class="block text-[9px] font-black text-subtle uppercase tracking-widest mb-2 ml-1">Label Name</label>
                <input type="text" [(ngModel)]="newName" placeholder="E.g. Entertainment" class="input-premium w-full">
              </div>

              <div>
                <label class="block text-[9px] font-black text-subtle uppercase tracking-widest mb-2 ml-1">Visual Marker</label>
                <div class="flex items-center space-x-4 bg-foreground/[0.03] border border-border rounded-xl px-4 py-3">
                   <input type="color" [(ngModel)]="newColor" class="w-10 h-10 rounded-lg bg-transparent border-0 cursor-pointer">
                   <span class="text-xs font-mono font-bold text-subtle">{{ newColor | uppercase }}</span>
                </div>
              </div>

              <button (click)="create()" [disabled]="!newName || isSaving" class="btn-premium w-full py-4">
                {{ isSaving ? 'Establishing...' : 'Save Category' }}
              </button>
           </div>
        </div>
      </div>
    </div>
  `
})
export class CategoriesComponent implements OnInit {
  categoryService = inject(CategoryService);
  protected tutorial = inject(TutorialService);
  newName = '';
  newColor = '#FF5722';
  isSaving = false;

  ngOnInit() {
    this.categoryService.loadCategories();
  }

  async create() {
    if (!this.newName) return;
    this.isSaving = true;
    try {
      await this.categoryService.createCategory(this.newName, this.newColor);
      this.newName = '';
    } finally {
      this.isSaving = false;
    }
  }

  async deleteCategory(id: string) {
    if (confirm('Permanently remove this category? Ensure it has no linked transactions.')) {
      try {
        await this.categoryService.deleteCategory(id);
      } catch (e: any) {
        alert(e.error?.message || 'Failed to remove category.');
      }
    }
  }
}
