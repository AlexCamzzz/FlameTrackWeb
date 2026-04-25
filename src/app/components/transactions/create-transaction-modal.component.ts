import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { CreateTransactionRequestDto, TransactionTypeDto } from '../../models/transaction.dto';
import { CategorySelectorComponent } from './category-selector.component';

@Component({
  selector: 'app-create-transaction-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, CategorySelectorComponent],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" (click)="close.emit()">
      <div class="bg-surface border border-border/20 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up" (click)="$event.stopPropagation()">
        <div class="p-6 border-b border-border/20 flex justify-between items-center">
          <h2 class="text-xl font-bold">New Transaction</h2>
          <button (click)="close.emit()" class="text-subtle hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-subtle mb-1">Type</label>
            <div class="flex space-x-4">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="type" [value]="0" [(ngModel)]="model.type" class="text-income focus:ring-income">
                <span>Income</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="type" [value]="1" [(ngModel)]="model.type" class="text-primary focus:ring-primary">
                <span>Expense</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-subtle mb-1">Description</label>
            <input type="text" name="description" [(ngModel)]="model.description" required
              class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-subtle/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
          </div>

          <div>
            <label class="block text-sm font-medium text-subtle mb-1">Amount</label>
            <input type="number" name="amount" [(ngModel)]="model.amount" required min="0.01" step="0.01"
              class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-subtle/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
          </div>

          <div>
            <label class="block text-sm font-medium text-subtle mb-1">Category</label>
            <app-category-selector [(selectedCategoryId)]="model.categoryId"></app-category-selector>
          </div>

          <div>
            <label class="block text-sm font-medium text-subtle mb-1">Date</label>
            <input type="date" name="date" [(ngModel)]="model.date" required
              class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-subtle/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" style="color-scheme: dark;">
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
export class CreateTransactionModalComponent {
  @Output() close = new EventEmitter<void>();
  private transactionService = inject(TransactionService);

  isSubmitting = false;

  model: CreateTransactionRequestDto = {
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    type: TransactionTypeDto.Expense
  };

  async onSubmit() {
    if (!this.model.description || this.model.amount <= 0 || !this.model.categoryId || !this.model.date) return;
    
    this.isSubmitting = true;
    try {
      const payload = { ...this.model, date: new Date(this.model.date).toISOString() };
      await this.transactionService.createTransaction(payload);
      this.close.emit();
    } catch (e) {
      console.error(e);
    } finally {
      this.isSubmitting = false;
    }
  }
}
