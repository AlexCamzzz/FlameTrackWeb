import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe, DatePipe } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { TransactionTypeDto } from '../../models/transaction.dto';
import { CategoryService } from '../../services/category.service';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ACCOUNT_ICONS } from '../../models/constants';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DecimalPipe, DatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (transactionService.summary(); as summary) {
      <div class="space-y-8 md:space-y-10 animate-fade-in pb-12">
        
        <header class="flex justify-between items-end py-2">
          <div>
            <p class="text-[10px] font-black text-subtle uppercase tracking-[0.4em] mb-1">Financial Intelligence</p>
            <h1 class="text-3xl md:text-4xl font-black text-foreground uppercase tracking-tight">Overview</h1>
          </div>
          <div class="hidden md:block text-right">
             <div class="flex items-center space-x-2 text-income-label text-[10px] font-bold">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-income opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-income"></span>
                </span>
                <span class="uppercase tracking-widest">Live Link Active</span>
             </div>
          </div>
        </header>

        <!-- Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="card !p-8 transition-all hover:border-primary/20 group relative overflow-hidden">
            <div class="flex flex-col h-full justify-between space-y-6 relative z-10">
              <div class="flex justify-between items-start">
                <div class="w-12 h-12 rounded-2xl bg-income/10 flex items-center justify-center text-income shadow-inner border border-border">
                   <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 13l-3 3m0 0l-3-3m3 3V8" /></svg>
                </div>
                <span class="text-[9px] font-black text-subtle uppercase tracking-[0.3em] mt-2">Inflow</span>
              </div>
              <h3 class="text-3xl font-black text-foreground tracking-tighter">{{ summary.monthlyIncome | currency:'MXN ':'symbol':'1.0-0' }}</h3>
            </div>
          </div>

          <div class="card !p-8 transition-all hover:border-primary/20 group relative overflow-hidden">
            <div class="flex flex-col h-full justify-between space-y-6 relative z-10">
              <div class="flex justify-between items-start">
                <div class="w-12 h-12 rounded-2xl bg-expense/10 flex items-center justify-center text-expense shadow-inner border border-border">
                   <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 11l3-3m0 0l3 3m-3-3v8" /></svg>
                </div>
                <span class="text-[9px] font-black text-subtle uppercase tracking-[0.3em] mt-2">Outflow</span>
              </div>
              <h3 class="text-3xl font-black text-foreground tracking-tighter">{{ summary.monthlyExpenses | currency:'MXN ':'symbol':'1.0-0' }}</h3>
            </div>
          </div>

          <div class="card !p-8 border-primary/20 transition-all hover:border-primary/40 group relative overflow-hidden bg-primary/[0.01]">
            <div class="flex flex-col h-full justify-between space-y-6 relative z-10">
              <div class="flex justify-between items-start">
                <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-border">
                   <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
                <span class="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-2">Net Worth</span>
              </div>
              <h3 class="text-4xl font-black text-foreground tracking-tighter">{{ summary.totalBalance | currency:'MXN ':'symbol':'1.0-0' }}</h3>
            </div>
          </div>

          <div class="card !p-8 transition-all hover:border-primary/20 group relative overflow-hidden">
            <div class="flex flex-col h-full justify-between space-y-6 relative z-10">
              <div class="flex justify-between items-start">
                <div class="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shadow-inner border border-border">
                   <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <span class="text-[9px] font-black text-subtle uppercase tracking-[0.3em] mt-2">Savings Rate</span>
              </div>
              <div class="flex items-baseline space-x-2">
                 <h3 class="text-3xl font-black text-foreground tracking-tighter">{{ summary.savingsRate | number:'1.1-1' }}</h3>
                 <span class="text-xl font-black text-subtle">%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div class="lg:col-span-4 space-y-8 order-2 lg:order-1">
            <section class="card !p-8 shadow-md">
              <div class="flex justify-between items-center mb-8 px-1">
                <h2 class="text-[11px] font-black uppercase tracking-[0.3em] text-subtle">Portfolio</h2>
                <a routerLink="/accounts" class="text-primary text-[10px] font-black uppercase tracking-widest hover:opacity-70 transition-opacity">Manage</a>
              </div>
              <div class="space-y-3">
                @for (acc of summary.accounts; track acc.id) {
                  <div class="flex items-center justify-between p-4 bg-foreground/[0.01] border border-border rounded-3xl hover:bg-foreground/[0.03] transition-all group shadow-inner">
                    <div class="flex items-center space-x-4 min-w-0">
                       <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white p-2.5 opacity-90 group-hover:scale-105 transition-all shadow-sm" [style.backgroundColor]="acc.color" [innerHTML]="getAccountIcon(acc.type)">
                       </div>
                       <span class="text-xs font-black text-foreground truncate uppercase tracking-tight">{{ acc.name }}</span>
                    </div>
                    <span class="text-xs font-black text-foreground">{{ acc.balance | currency:acc.currency + ' ':'symbol':'1.0-0' }}</span>
                  </div>
                }
              </div>
            </section>

            <section class="card !p-8 shadow-md">
              <h2 class="text-[11px] font-black uppercase tracking-[0.3em] text-subtle mb-8 px-1">Targets Progress</h2>
              <div class="space-y-8">
                @for (goal of summary.goals; track goal.id) {
                  <div class="space-y-4 group">
                    <div class="flex justify-between items-end px-1">
                      <span class="text-[10px] font-black text-foreground uppercase tracking-widest group-hover:text-primary transition-colors">{{ goal.name }}</span>
                      <span class="text-[10px] font-black text-income">{{ (goal.currentAmount / (goal.targetAmount || 1)) * 100 | number:'1.0-0' }}%</span>
                    </div>
                    <div class="w-full bg-foreground/[0.03] h-2.5 rounded-full overflow-hidden shadow-inner border border-border">
                      <div class="h-full bg-gradient-to-r from-income to-emerald-500 opacity-90 transition-all duration-1000 rounded-full" [style.width.%]="(goal.currentAmount / (goal.targetAmount || 1)) * 100"></div>
                    </div>
                    <div class="flex justify-between items-center px-1">
                       <div class="flex items-baseline space-x-1">
                          <span class="text-[10px] font-black text-foreground tracking-tight">{{ goal.currentAmount | currency:'MXN ':'symbol':'1.0-0' }}</span>
                          <span class="text-[8px] font-black text-subtle uppercase opacity-50">Saved</span>
                       </div>
                       <div class="flex items-baseline space-x-1">
                          <span class="text-[10px] font-black text-foreground/40 tracking-tight">{{ goal.targetAmount | currency:'MXN ':'symbol':'1.0-0' }}</span>
                          <span class="text-[8px] font-black text-subtle uppercase opacity-40">Goal</span>
                       </div>
                    </div>
                  </div>
                }
              </div>
            </section>
          </div>

          <div class="lg:col-span-8 space-y-8 order-1 lg:order-2">
             <section class="card !p-0 overflow-hidden shadow-md">
                <div class="p-8 border-b border-border flex justify-between items-center bg-foreground/[0.01]">
                   <h2 class="text-[11px] font-black uppercase tracking-[0.3em] text-subtle">Operations Ledger</h2>
                   <a routerLink="/transactions" class="text-primary text-[10px] font-black uppercase tracking-widest hover:opacity-70 transition-opacity">Full History</a>
                </div>
                <div class="divide-y divide-border/20">
                  @for (tx of summary.recentTransactions; track tx.id) {
                    <div class="flex items-center p-6 hover:bg-foreground/[0.01] transition-colors border-l-4 border-transparent hover:border-primary/40">
                      <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-white flex-shrink-0 opacity-90 shadow-md transition-transform group-hover:scale-105" 
                           [style.backgroundColor]="categoryService.getCategoryColor(tx.categoryId)">
                        <span class="text-lg font-black uppercase">{{ categoryService.getCategoryName(tx.categoryId).substring(0, 1) }}</span>
                      </div>
                      <div class="ml-6 flex-1 min-w-0">
                        <p class="text-sm font-black text-foreground truncate uppercase tracking-tight">{{ tx.description }}</p>
                        <div class="flex items-center space-x-3 mt-1.5">
                           <span class="text-[9px] font-black text-subtle uppercase tracking-widest opacity-60">{{ categoryService.getCategoryName(tx.categoryId) }}</span>
                           <span class="text-[8px] text-subtle opacity-30">•</span>
                           <span class="text-[9px] font-black text-subtle uppercase tracking-widest opacity-60">{{ tx.date | date:'dd MMM' }}</span>
                        </div>
                      </div>
                      <div class="text-right ml-6">
                        <p class="text-lg font-black tracking-tighter" [class.text-income-label]="tx.type === 0" [class.text-expense-label]="tx.type === 1">
                          {{ tx.type === 0 ? '+' : '-' }}{{ tx.amount | currency:'MXN ':'symbol':'1.0-0' }}
                        </p>
                      </div>
                    </div>
                  }
                </div>
             </section>

             <section class="card !p-8 shadow-md">
                <h2 class="text-[11px] font-black uppercase tracking-[0.3em] text-subtle mb-8 px-1">Resource Allocation</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
                   @for (budget of summary.budgets; track budget.categoryId) {
                     <div class="p-6 bg-foreground/[0.01] border border-border rounded-3xl group hover:border-primary/20 transition-all shadow-inner">
                        <div class="flex justify-between items-center mb-4">
                           <span class="text-[10px] font-black uppercase text-foreground/80 tracking-widest truncate pr-2">{{ categoryService.getCategoryName(budget.categoryId) }}</span>
                           <span class="text-[11px] font-black" [class.text-expense-label]="budget.percentage > 100" [class.text-subtle-label]="budget.percentage <= 100">
                             {{ budget.percentage | number:'1.0-0' }}%
                           </span>
                        </div>
                        <div class="w-full bg-foreground/[0.03] h-2.5 rounded-full overflow-hidden shadow-inner border border-border">
                           <div class="h-full transition-all duration-700 opacity-90 rounded-full shadow-sm" 
                             [style.backgroundColor]="budget.percentage > 100 ? 'var(--color-expense)' : categoryService.getCategoryColor(budget.categoryId)" 
                             [style.width.%]="budget.percentage > 100 ? 100 : budget.percentage"></div>
                        </div>
                        <div class="flex justify-between mt-4">
                           <div class="space-y-0.5">
                              <p class="text-[8px] font-black text-subtle uppercase tracking-tighter opacity-40">Consumed</p>
                              <p class="text-[11px] font-black text-foreground">{{ budget.spent | currency:'MXN ':'symbol':'1.0-0' }}</p>
                           </div>
                           <div class="text-right space-y-0.5">
                              <p class="text-[8px] font-black text-subtle uppercase tracking-tighter opacity-40">Limit</p>
                              <p class="text-[11px] font-black text-foreground/50">{{ budget.limit | currency:'MXN ':'symbol':'1.0-0' }}</p>
                           </div>
                        </div>
                     </div>
                   }
                </div>
             </section>
          </div>

        </div>
      </div>
    } @else {
      <div class="flex flex-col items-center justify-center h-[70vh]">
        <div class="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
        <div class="text-xs font-black text-primary uppercase tracking-[0.8em] opacity-40">Syncing Data Core</div>
      </div>
    }
  `
})
export class DashboardComponent implements OnInit {
  protected transactionService = inject(TransactionService);
  protected categoryService = inject(CategoryService);
  private sanitizer = inject(DomSanitizer);
  protected TransactionTypeDto = TransactionTypeDto;

  ngOnInit() {
    this.transactionService.loadDashboardSummary();
    this.categoryService.loadCategories();
  }

  getAccountIcon(type: number): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(ACCOUNT_ICONS[type] || '');
  }
}
