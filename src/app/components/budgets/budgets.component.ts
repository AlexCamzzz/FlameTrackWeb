import { Component, inject, OnInit, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { BudgetService } from '../../services/budget.service';
import { CategoryService } from '../../services/category.service';
import { CreateBudgetModalComponent } from './create-budget-modal.component';
import { CreateTransactionModalComponent } from '../transactions/create-transaction-modal.component';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, CreateBudgetModalComponent, CreateTransactionModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[1400px] mx-auto space-y-8 md:space-y-10 animate-fade-in pb-12">
      <header class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <h1 class="text-xl md:text-2xl font-black text-foreground uppercase tracking-widest">Budgets</h1>
          <div class="h-1 w-8 bg-primary mt-2"></div>
        </div>
        <button (click)="isModalOpen = true" class="btn-premium flex items-center space-x-2 w-full sm:w-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" /></svg>
          <span>Provision</span>
        </button>
      </header>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        @for (budget of budgetService.budgets(); track budget.categoryId) {
          <div class="card group transition-all border-border hover:border-primary/30 flex flex-col justify-between !p-6 md:!p-8 shadow-sm">
             <div class="space-y-6 md:space-y-8">
               <div class="flex justify-between items-start gap-4">
                  <h3 class="text-md md:text-lg font-black text-foreground uppercase tracking-widest opacity-90 group-hover:text-primary transition-colors truncate">{{ categoryService.getCategoryName(budget.categoryId) }}</h3>
                  <span class="text-[9px] font-black text-foreground bg-foreground/[0.05] border border-border px-2.5 py-1 rounded-lg tracking-widest flex-shrink-0">
                    {{ (budget.spent / (budget.limit || 1)) * 100 | number:'1.0-0' }}%
                  </span>
               </div>

               <div class="space-y-4">
                  <div class="w-full bg-foreground/[0.05] h-1.5 md:h-2 rounded-full overflow-hidden shadow-inner border border-border">
                    <div class="h-full transition-all duration-700 opacity-90 rounded-full" 
                      [style.backgroundColor]="budget.spent > budget.limit ? 'var(--color-expense)' : categoryService.getCategoryColor(budget.categoryId)" 
                      [style.width.%]="(budget.spent / (budget.limit || 1)) * 100 > 100 ? 100 : (budget.spent / (budget.limit || 1)) * 100">
                    </div>
                  </div>
                  
                  <div class="flex justify-between items-end px-1">
                    <div class="space-y-1">
                       <p class="text-[8px] md:text-[9px] font-black text-subtle uppercase tracking-widest opacity-40">Consumed</p>
                       <p class="text-lg md:text-xl font-black text-foreground tracking-tighter">{{ budget.spent | currency:'MXN ':'symbol':'1.0-0' }}</p>
                    </div>
                    <div class="text-right space-y-1">
                       <p class="text-[8px] md:text-[9px] font-black text-subtle uppercase tracking-widest opacity-40">Limit</p>
                       <p class="text-xs md:text-sm font-black text-foreground opacity-40 tracking-tight">{{ budget.limit | currency:'MXN ':'symbol':'1.0-0' }}</p>
                    </div>
                  </div>
               </div>
             </div>
             
             <div class="mt-8 md:mt-10 pt-6 border-t border-border flex justify-end">
                <button (click)="openQuickExpense(budget.categoryId)" class="btn-secondary flex items-center space-x-2 !px-6 !py-3 !text-[9px]">
                   <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" /></svg>
                   <span>Log Expense</span>
                </button>
             </div>
          </div>
        } @empty {
          <div class="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-4 bg-foreground/[0.01] rounded-[3rem] border border-dashed border-border">
             <div class="text-subtle opacity-20">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
             </div>
             <p class="text-subtle text-[11px] font-black uppercase tracking-[0.3em] opacity-40">No budget parameters established</p>
          </div>
        }
      </div>
    </div>

    @if (isModalOpen) {
       <app-create-budget-modal (close)="onModalClose()"></app-create-budget-modal>
    }
    @if (quickExpenseCategoryId) {
       <app-create-transaction-modal 
         [prefilledCategoryId]="quickExpenseCategoryId" 
         (close)="quickExpenseCategoryId = null; onModalClose()">
       </app-create-transaction-modal>
    }
  `
})
export class BudgetsComponent implements OnInit {
  budgetService = inject(BudgetService);
  categoryService = inject(CategoryService);
  isModalOpen = false;
  quickExpenseCategoryId: string | null = null;

  ngOnInit() {
    this.budgetService.loadBudgets();
    this.categoryService.loadCategories();
  }

  openQuickExpense(categoryId: string) {
    this.quickExpenseCategoryId = categoryId;
  }

  onModalClose() {
    this.isModalOpen = false;
    this.budgetService.loadBudgets();
  }
}
