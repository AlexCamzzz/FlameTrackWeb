import { Component, EventEmitter, Output, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { CategoryDto } from '../../models/transaction.dto';

@Component({
  selector: 'app-category-picker-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in" (click)="close.emit()">
      <div class="card !p-0 w-full max-w-2xl overflow-hidden animate-slide-up border-border shadow-2xl" (click)="$event.stopPropagation()">
        
        <div class="p-8 border-b border-border flex justify-between items-center bg-foreground/[0.02]">
          <div>
            <h2 class="text-2xl font-black text-foreground uppercase tracking-tight">Category Selection</h2>
            <p class="text-subtle text-[10px] font-black uppercase tracking-widest mt-1 opacity-50">Classification // Selection</p>
          </div>
          <button (click)="close.emit()" class="w-12 h-12 bg-foreground/[0.05] rounded-2xl hover:bg-foreground/[0.1] text-foreground transition-all flex items-center justify-center border border-border">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="p-8 space-y-8">
          <!-- Filter -->
          <div class="relative">
            <input type="text" [(ngModel)]="searchTerm" placeholder="Filter parameters..." 
              class="input-premium w-full pl-6 pr-12 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 absolute right-6 top-4 text-subtle opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>

          <!-- Selection Grid -->
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            @for (cat of filteredCategories(); track cat.id) {
               <div (click)="select(cat)"
                    class="group p-6 bg-foreground/[0.03] border border-border rounded-3xl cursor-pointer transition-all hover:border-primary/50 flex flex-col items-center justify-center space-y-3 text-center active:scale-95 shadow-sm">
                 <div class="w-14 h-14 rounded-2xl shadow-md flex items-center justify-center text-white transition-transform group-hover:scale-105" 
                      [style.backgroundColor]="cat.color">
                   <span class="text-2xl font-black">{{ cat.name.substring(0, 1).toUpperCase() }}</span>
                 </div>
                 <span class="text-[11px] font-black text-subtle group-hover:text-foreground uppercase tracking-widest transition-colors">{{ cat.name }}</span>
               </div>
            }

            @if (searchTerm && !exactMatchExists()) {
               <div (click)="isCreating = true"
                    class="p-6 border-2 border-dashed border-primary/20 rounded-3xl cursor-pointer hover:bg-primary/5 transition-all flex flex-col items-center justify-center space-y-2 text-center group active:scale-95">
                 <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary transition-transform group-hover:rotate-90">
                   <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" /></svg>
                 </div>
                 <span class="text-[9px] font-black text-primary uppercase tracking-widest">Add "{{ searchTerm }}"</span>
               </div>
            }
          </div>

          <!-- Creation Flow -->
          @if (isCreating || (searchTerm && !exactMatchExists())) {
             <div class="p-6 bg-foreground/[0.02] rounded-3xl border border-border animate-fade-in shadow-inner">
                <div class="flex items-center justify-between mb-4 px-2">
                   <h3 class="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">Parameter Registry</h3>
                   <button (click)="isCreating = false" class="text-subtle hover:text-foreground text-[10px] font-black uppercase tracking-widest">Abort</button>
                </div>
                <div class="flex items-center space-x-6">
                   <div class="flex flex-col items-center space-y-2">
                      <div class="relative w-14 h-14 rounded-2xl overflow-hidden border border-border shadow-md cursor-pointer group">
                         <input type="color" [(ngModel)]="newColor" class="absolute inset-[-10px] w-[80px] h-[80px] cursor-pointer p-0 m-0 border-0 bg-transparent">
                      </div>
                      <span class="text-[9px] font-mono font-bold text-subtle">{{ newColor | uppercase }}</span>
                   </div>
                   <div class="flex-1 space-y-4">
                      <input type="text" [(ngModel)]="searchTerm" placeholder="Input label..." class="input-premium w-full shadow-inner">
                      <button (click)="createNew()" [disabled]="!searchTerm || isSaving" class="btn-premium w-full">
                         {{ isSaving ? 'SYNCHRONIZING...' : 'SAVE & SELECT' }}
                      </button>
                   </div>
                </div>
             </div>
          }
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
