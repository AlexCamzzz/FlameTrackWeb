import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { CreateTransactionRequestDto, TransactionTypeDto, CategoryDto } from '../../models/transaction.dto';
import { CategoryPickerModalComponent } from './category-picker-modal.component';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-create-transaction-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, CategoryPickerModalComponent],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" (click)="close.emit()">
      <div class="bg-surface border border-border/20 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up" (click)="$event.stopPropagation()">
        <div class="p-6 border-b border-border/20 flex justify-between items-center bg-black/10">
          <h2 class="text-xl font-bold">New Transaction</h2>
          <button (click)="close.emit()" class="text-subtle hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" class="p-8 space-y-5">
          <div>
            <label class="block text-xs font-black text-subtle uppercase tracking-widest mb-2 ml-1">Transaction Type</label>
            <div class="flex p-1.5 bg-black/20 rounded-2xl border border-white/5">
              <button type="button" (click)="model.type = 0" 
                [ngClass]="model.type === 0 ? 'bg-income text-white shadow-lg' : 'text-subtle hover:text-white'"
                class="flex-1 py-2 rounded-xl text-xs font-black transition-all">INCOME</button>
              <button type="button" (click)="model.type = 1"
                [ngClass]="model.type === 1 ? 'bg-primary text-white shadow-lg' : 'text-subtle hover:text-white'"
                class="flex-1 py-2 rounded-xl text-xs font-black transition-all">EXPENSE</button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-black text-subtle uppercase tracking-widest mb-2 ml-1">Description</label>
            <input type="text" name="description" [(ngModel)]="model.description" required
              class="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-subtle/50 focus:outline-none focus:border-primary transition-all shadow-inner" placeholder="What was this for?">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
               <label class="block text-xs font-black text-subtle uppercase tracking-widest mb-2 ml-1">Amount</label>
               <input type="number" name="amount" [(ngModel)]="model.amount" required min="0.01" step="0.01"
                 class="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-subtle/50 focus:outline-none focus:border-primary transition-all shadow-inner">
            </div>
            <div>
               <label class="block text-xs font-black text-subtle uppercase tracking-widest mb-2 ml-1">Date</label>
               <input type="date" name="date" [(ngModel)]="model.date" required
                 class="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all shadow-inner" style="color-scheme: dark;">
            </div>
          </div>

          <div>
            <label class="block text-xs font-black text-subtle uppercase tracking-widest mb-2 ml-1">Category</label>
            <button type="button" (click)="isPickerOpen = true" 
              class="w-full flex items-center justify-between bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-left transition-all hover:bg-white/5">
              <div class="flex items-center space-x-3" *ngIf="model.categoryId; else noCat">
                <div class="w-3 h-3 rounded-full shadow-lg" [style.backgroundColor]="categoryService.getCategoryColor(model.categoryId)"></div>
                <span class="font-bold text-white">{{ categoryService.getCategoryName(model.categoryId) }}</span>
              </div>
              <ng-template #noCat>
                <span class="text-subtle font-bold italic">Select a category...</span>
              </ng-template>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>

          <div class="pt-4 flex flex-col space-y-3">
            <button type="submit" [disabled]="isSubmitting || !model.categoryId" class="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-2xl py-4 font-black transition-all disabled:opacity-50 shadow-xl shadow-primary/20">
              {{ isSubmitting ? 'SAVING...' : 'SAVE TRANSACTION' }}
            </button>
            <button type="button" (click)="close.emit()" class="w-full py-2 text-subtle hover:text-white transition-colors font-bold text-sm">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <app-category-picker-modal *ngIf="isPickerOpen" 
      (selectCategory)="onCategorySelect($event)" 
      (close)="isPickerOpen = false">
    </app-category-picker-modal>
  `
})
export class CreateTransactionModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  
  private transactionService = inject(TransactionService);
  protected categoryService = inject(CategoryService);

  isSubmitting = false;
  isPickerOpen = false;

  model: CreateTransactionRequestDto = {
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    type: TransactionTypeDto.Expense
  };

  ngOnInit() {
    this.categoryService.loadCategories();
  }

  onCategorySelect(cat: CategoryDto) {
    this.model.categoryId = cat.id;
  }

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
