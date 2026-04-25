import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../services/budget.service';
import { CategorySelectorComponent } from '../transactions/category-selector.component';

@Component({
  selector: 'app-create-budget-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, CategorySelectorComponent],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" (click)="close.emit()">
      <div class="bg-surface border border-border/20 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up" (click)="$event.stopPropagation()">
        <div class="p-6 border-b border-border/20 flex justify-between items-center">
          <h2 class="text-xl font-bold">Set Budget</h2>
          <button (click)="close.emit()" class="text-subtle hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-subtle mb-1">Category</label>
            <app-category-selector [(selectedCategoryId)]="model.categoryId"></app-category-selector>
          </div>

          <div>
            <label class="block text-sm font-medium text-subtle mb-1">Monthly Limit (MXN)</label>
            <input type="number" name="limit" [(ngModel)]="model.limit" required min="1" step="1"
              class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-subtle/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-subtle mb-1">Month</label>
              <input type="number" name="month" [(ngModel)]="model.month" required min="1" max="12"
                class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-subtle/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
            </div>
            <div>
              <label class="block text-sm font-medium text-subtle mb-1">Year</label>
              <input type="number" name="year" [(ngModel)]="model.year" required min="2000"
                class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-subtle/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
            </div>
          </div>

          <div class="pt-4 flex justify-end space-x-3">
            <button type="button" (click)="close.emit()" class="px-4 py-2 text-subtle hover:text-white transition-colors font-medium">Cancel</button>
            <button type="submit" [disabled]="isSubmitting" class="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl px-6 py-2 font-bold transition-all disabled:opacity-50 shadow-lg shadow-primary/20">
              {{ isSubmitting ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CreateBudgetModalComponent {
  @Output() close = new EventEmitter<void>();
  private budgetService = inject(BudgetService);

  isSubmitting = false;

  model = {
    categoryId: '',
    limit: 0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  };

  async onSubmit() {
    if (!this.model.categoryId || this.model.limit <= 0) return;
    
    this.isSubmitting = true;
    try {
      await this.budgetService.createBudget(this.model);
      this.close.emit();
    } catch (e) {
      console.error(e);
    } finally {
      this.isSubmitting = false;
    }
  }
}
