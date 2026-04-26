import { Component, EventEmitter, Output, inject, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { TutorialService } from '../../services/tutorial.service';
import { CreateTransactionRequestDto, TransactionTypeDto, CategoryDto, AccountDto } from '../../models/transaction.dto';
import { CategoryPickerModalComponent } from './category-picker-modal.component';
import { CategoryService } from '../../services/category.service';
import { AccountService } from '../../services/account.service';
import { AccountPickerModalComponent } from '../accounts/account-picker-modal.component';

@Component({
  selector: 'app-create-transaction-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, CategoryPickerModalComponent, AccountPickerModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" (click)="close.emit()">
      <div class="card !p-0 w-full max-w-md overflow-hidden animate-slide-up border-border" (click)="$event.stopPropagation()">
        
        <div class="p-8 border-b border-border flex justify-between items-center bg-foreground/[0.02]">
          <div class="flex items-center space-x-3">
            <h2 class="text-xl font-black text-foreground uppercase tracking-tight">New Transaction</h2>
            <button (click)="tutorial.start('modal-transaction')" class="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all text-[10px] font-black border border-primary/20">?</button>
          </div>
          <button (click)="close.emit()" class="w-10 h-10 bg-foreground/[0.05] rounded-2xl hover:bg-foreground/[0.1] text-foreground transition-all flex items-center justify-center border border-border">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" class="p-8 space-y-6">
          <div>
            <div class="flex p-1.5 bg-background border border-border rounded-2xl shadow-inner">
              <button type="button" (click)="model.type = 0" 
                [class.bg-income]="model.type === 0" [class.text-white]="model.type === 0" [class.shadow-md]="model.type === 0"
                [class.text-subtle]="model.type !== 0"
                class="flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest">Inflow</button>
              <button type="button" (click)="model.type = 1"
                [class.bg-expense]="model.type === 1" [class.text-white]="model.type === 1" [class.shadow-md]="model.type === 1"
                [class.text-subtle]="model.type !== 1"
                class="flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest">Outflow</button>
            </div>
          </div>

          <div class="space-y-5">
            <div>
              <label class="block text-[10px] font-black text-subtle uppercase tracking-widest mb-2 ml-1">Description</label>
              <input type="text" name="description" [(ngModel)]="model.description" required
                class="input-premium w-full shadow-inner" placeholder="E.g. Services Sync">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                 <label class="block text-[10px] font-black text-subtle uppercase tracking-widest mb-2 ml-1">Amount</label>
                 <input type="number" name="amount" [(ngModel)]="model.amount" required min="0.01" step="0.01"
                   data-tutorial="input-amount"
                   class="input-premium w-full text-xl font-black text-center shadow-inner">
              </div>
              <div>
                 <label class="block text-[10px] font-black text-subtle uppercase tracking-widest mb-2 ml-1">Date</label>
                 <input type="date" name="date" [(ngModel)]="model.date" required
                   class="input-premium w-full shadow-inner" style="color-scheme: light dark;">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
               <div>
                  <label class="block text-[10px] font-black text-subtle uppercase tracking-widest mb-2 ml-1">Category</label>
                  <button type="button" (click)="!prefilledCategoryId && (isPickerOpen = true)" 
                    data-tutorial="btn-category-picker"
                    [disabled]="prefilledCategoryId !== null"
                    class="w-full flex items-center justify-between bg-foreground/[0.03] border border-border rounded-xl px-4 py-4 text-left transition-all hover:bg-foreground/[0.05] shadow-inner group">
                    <div class="flex items-center space-x-2 min-w-0">
                      @if (model.categoryId) {
                        <div class="w-2 h-2 rounded-full flex-shrink-0 shadow-sm" [style.backgroundColor]="categoryService.getCategoryColor(model.categoryId)"></div>
                        <span class="font-bold text-foreground text-[11px] truncate uppercase tracking-tighter">{{ categoryService.getCategoryName(model.categoryId) }}</span>
                      } @else {
                        <span class="text-subtle font-bold italic text-[11px]">Select...</span>
                      }
                    </div>
                  </button>
               </div>
               <div>
                  <label class="block text-[10px] font-black text-subtle uppercase tracking-widest mb-2 ml-1">Source Account</label>
                  <button type="button" (click)="isAccountPickerOpen = true" 
                    data-tutorial="btn-account-picker"
                    class="w-full flex items-center justify-between bg-foreground/[0.03] border border-border rounded-xl px-4 py-4 text-left transition-all hover:bg-foreground/[0.05] shadow-inner group">
                    <div class="flex items-center space-x-2 min-w-0">
                      @if (model.accountId) {
                        <div class="w-2 h-2 rounded-full flex-shrink-0 shadow-sm" [style.backgroundColor]="accountService.getAccountColor(model.accountId)"></div>
                        <span class="font-bold text-foreground text-[11px] truncate uppercase tracking-tighter">{{ accountService.getAccountName(model.accountId) }}</span>
                      } @else {
                        <span class="text-subtle font-bold italic text-[11px]">Select...</span>
                      }
                    </div>
                  </button>
               </div>
            </div>
          </div>

          <div class="pt-6">
            <button type="submit" [disabled]="isSubmitting || !model.categoryId || !model.accountId || model.amount <= 0" 
               class="btn-premium w-full py-5 shadow-lg shadow-primary/10">
              {{ isSubmitting ? 'Syncing...' : 'Save Transaction' }}
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

    @if (isAccountPickerOpen) {
       <app-account-picker-modal
         (selectAccount)="onAccountSelect($event)"
         (close)="isAccountPickerOpen = false">
       </app-account-picker-modal>
    }
  `
})
export class CreateTransactionModalComponent implements OnInit {
  @Input() prefilledCategoryId: string | null = null;
  @Output() close = new EventEmitter<void>();
  
  private transactionService = inject(TransactionService);
  protected tutorial = inject(TutorialService);
  protected categoryService = inject(CategoryService);
  protected accountService = inject(AccountService);

  isSubmitting = false;
  isPickerOpen = false;
  isAccountPickerOpen = false;

  model: CreateTransactionRequestDto = {
    description: '',
    amount: 0,
    accountId: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    type: TransactionTypeDto.Expense
  };

  ngOnInit() {
    this.categoryService.loadCategories();
    this.accountService.loadAccounts();
    if (this.prefilledCategoryId) {
      this.model.categoryId = this.prefilledCategoryId;
    }
  }

  onCategorySelect(cat: CategoryDto) {
    this.model.categoryId = cat.id;
  }

  onAccountSelect(acc: AccountDto) {
    this.model.accountId = acc.id;
  }

  async onSubmit() {
    if (!this.model.description || this.model.amount <= 0 || !this.model.categoryId || !this.model.accountId || !this.model.date) return;
    
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
