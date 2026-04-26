import { Component, EventEmitter, Output, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../services/budget.service';
import { CategoryService } from '../../services/category.service';
import { TutorialService } from '../../services/tutorial.service';
import { CreateBudgetRequestDto, CategoryDto } from '../../models/transaction.dto';
import { CategoryPickerModalComponent } from '../transactions/category-picker-modal.component';

@Component({
  selector: 'app-create-budget-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, CategoryPickerModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in px-4" (click)="close.emit()">
      <div class="card !p-0 w-full max-w-md overflow-hidden animate-slide-up border-border shadow-2xl" (click)="$event.stopPropagation()">
        
        <div class="p-8 border-b border-border flex justify-between items-center bg-foreground/[0.02]">
          <div class="flex items-center space-x-3">
            <h2 class="text-xl font-black text-foreground uppercase tracking-tight">Configure Allocation</h2>
            <button (click)="tutorial.start('modal-budget')" class="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all text-[10px] font-black border border-primary/20">?</button>
          </div>
          <button (click)="close.emit()" class="w-10 h-10 bg-foreground/[0.05] rounded-2xl hover:bg-foreground/[0.1] text-foreground transition-all flex items-center justify-center border border-border">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" class="p-8 space-y-6">
          <div>
            <label class="block text-[10px] font-black text-subtle uppercase tracking-widest mb-2 ml-1">Target Classification</label>
            <button type="button" (click)="isPickerOpen = true" 
              data-tutorial="select-category"
              class="w-full flex items-center justify-between bg-foreground/[0.03] border border-border rounded-2xl px-5 py-4 text-left transition-all hover:bg-foreground/[0.05] group overflow-hidden shadow-inner">
              <div class="flex items-center space-x-3 min-w-0">
                @if (model.categoryId) {
                  <div class="w-2.5 h-2.5 rounded-full shadow-md" [style.backgroundColor]="categoryService.getCategoryColor(model.categoryId)"></div>
                  <span class="font-bold text-foreground text-sm truncate uppercase tracking-tighter">{{ categoryService.getCategoryName(model.categoryId) }}</span>
                } @else {
                  <span class="text-subtle font-bold italic text-sm opacity-40">Select category...</span>
                }
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-subtle transition-transform group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>

          <div>
            <label class="block text-[10px] font-black text-subtle uppercase tracking-widest mb-2 ml-1">Monthly Expenditure Limit</label>
            <input type="number" name="limit" [(ngModel)]="model.limit" required min="1"
              data-tutorial="input-budget-limit"
              class="input-premium w-full text-2xl font-black text-center tracking-tighter shadow-inner">
          </div>

          <div class="pt-6">
            <button type="submit" [disabled]="!model.categoryId || model.limit <= 0 || isSaving" 
               class="btn-premium w-full py-5 shadow-lg shadow-primary/10">
              {{ isSaving ? 'Synchronizing...' : 'Establish Provision' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    @if (isPickerOpen) {
       <app-category-picker-modal
         (selectCategory)="onCategorySelect($event)" 
         (close)="isPickerOpen = false">
       </app-category-picker-modal>
    }
  `
})
export class CreateBudgetModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  
  budgetService = inject(BudgetService);
  categoryService = inject(CategoryService);
  protected tutorial = inject(TutorialService);

  isSaving = false;
  isPickerOpen = false;

  model: CreateBudgetRequestDto = {
    categoryId: '',
    limit: 0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  };

  ngOnInit() {
    this.categoryService.loadCategories();
  }

  onCategorySelect(cat: CategoryDto) {
    this.model.categoryId = cat.id;
  }

  async onSubmit() {
    if (!this.model.categoryId || this.model.limit <= 0) return;
    this.isSaving = true;
    try {
      await this.budgetService.createBudget(this.model);
      this.close.emit();
    } finally {
      this.isSaving = false;
    }
  }
}
