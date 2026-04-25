import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { BudgetService } from '../../services/budget.service';
import { CreateBudgetModalComponent } from './create-budget-modal.component';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, CreateBudgetModalComponent],
  template: `
    <div class="p-6 space-y-8 animate-fade-in">
      <header class="flex justify-between items-center">
        <h1 class="text-3xl font-bold">Budgets</h1>
        <button (click)="isModalOpen = true" class="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-lg px-4 py-2 font-semibold transition-colors flex items-center space-x-2 shadow-lg shadow-primary/20">
          <span>Add Budget</span>
        </button>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let budget of budgetService.budgets()" class="card transition-all hover:border-white/10">
          <div class="flex justify-between items-start mb-4">
            <div class="bg-white/10 px-3 py-1 rounded-md text-sm font-medium" [style.color]="categoryService.getCategoryColor(budget.categoryId)">
              {{ categoryService.getCategoryName(budget.categoryId) }}
            </div>
            <button class="text-subtle hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
          <div class="text-2xl font-bold mb-1">{{ budget.limit | currency:'MXN ' }}</div>
          <div class="text-xs text-subtle">Monthly Limit</div>
        </div>
        <div *ngIf="budgetService.budgets().length === 0" class="col-span-full p-8 text-center text-subtle card">
          No budgets configured for this month.
        </div>
      </div>
    </div>
    
    <app-create-budget-modal *ngIf="isModalOpen" (close)="isModalOpen = false"></app-create-budget-modal>
  `
})
export class BudgetsComponent implements OnInit {
  protected budgetService = inject(BudgetService);
  protected categoryService = inject(CategoryService);
  isModalOpen = false;

  ngOnInit() {
    this.budgetService.loadBudgets();
    this.categoryService.loadCategories();
  }
}