import { Component, inject, OnInit, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { TransferService } from '../../services/transfer.service';
import { AccountService } from '../../services/account.service';
import { CategoryService } from '../../services/category.service';
import { RecurringTransactionService } from '../../services/recurring-transaction.service';
import { TransactionTypeDto, AccountType, RecurrenceFrequency } from '../../models/transaction.dto';
import { CreateTransactionModalComponent } from './create-transaction-modal.component';
import { CreateTransferModalComponent } from '../transfers/create-transfer-modal.component';
import { CreateRecurringTransactionModalComponent } from './create-recurring-transaction-modal.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule, CurrencyPipe, DatePipe, FormsModule, 
    CreateTransactionModalComponent, CreateTransferModalComponent, CreateRecurringTransactionModalComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in pb-12">
      <header class="flex flex-col gap-6 border-b border-border pb-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 class="text-xl md:text-2xl font-black text-foreground uppercase tracking-widest">Ledger</h1>
          
          <div class="flex items-center space-x-3">
             @if (activeTab === 'transactions') {
               <button (click)="isTransactionModalOpen = true" class="btn-premium flex-1 md:flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" /></svg>
                  <span>Entry</span>
               </button>
             } @else if (activeTab === 'transfers') {
               <button (click)="isTransferModalOpen = true" class="btn-secondary flex-1 md:flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                  <span>Transfer</span>
               </button>
             } @else {
               <button (click)="isRecurringModalOpen = true" class="btn-premium flex-1 md:flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                  <span>Recurring</span>
               </button>
             }
          </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-4">
          <div class="flex bg-foreground/[0.03] p-1 rounded-xl border border-border overflow-x-auto no-scrollbar">
             <button (click)="activeTab = 'transactions'" 
               [class.bg-primary]="activeTab === 'transactions'" [class.text-white]="activeTab === 'transactions'"
               [class.text-subtle]="activeTab !== 'transactions'"
               class="px-4 md:px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all">Entries</button>
             <button (click)="activeTab = 'transfers'" 
               [class.bg-primary]="activeTab === 'transfers'" [class.text-white]="activeTab === 'transfers'"
               [class.text-subtle]="activeTab !== 'transfers'"
               class="px-4 md:px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all">Transfers</button>
             <button (click)="activeTab = 'recurring'" 
               [class.bg-primary]="activeTab === 'recurring'" [class.text-white]="activeTab === 'recurring'"
               [class.text-subtle]="activeTab !== 'recurring'"
               class="px-4 md:px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all">Recurring</button>
          </div>

          @if (activeTab === 'transactions') {
            <div class="relative flex-1 group">
                <input type="text" [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" placeholder="Filter activity..." 
                  class="input-premium w-full pl-12 py-2.5 text-sm shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 absolute left-4 top-3 text-subtle group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          }
        </div>
      </header>

      @if (isLoading()) {
         <div class="py-40 flex flex-col items-center justify-center space-y-4">
            <div class="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p class="text-[10px] font-black text-primary uppercase tracking-[0.4em] opacity-40">Polling Ledger...</p>
         </div>
      } @else {
        @if (activeTab === 'transactions') {
           <!-- Desktop Table -->
           <div class="hidden md:block card !p-0 overflow-hidden border-border">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="table-header">
                    <th class="py-4 px-8">Description</th>
                    <th class="py-4 px-8">Amount</th>
                    <th class="py-4 px-8">Account</th>
                    <th class="py-4 px-8">Date</th>
                    <th class="py-4 px-8">Category</th>
                    <th class="py-4 px-8 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border/20">
                  @for (tx of filteredTransactions(); track tx.id) {
                    <tr class="hover:bg-foreground/[0.01] transition-colors group">
                      <td class="py-5 px-8">
                        <div class="flex items-center space-x-4">
                          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white opacity-90 shadow-sm" 
                               [style.backgroundColor]="categoryService.getCategoryColor(tx.categoryId)">
                            <span class="text-sm font-black">{{ categoryService.getCategoryName(tx.categoryId).substring(0, 1) }}</span>
                          </div>
                          <span class="text-xs font-bold text-foreground/90 uppercase tracking-tight">{{ tx.description }}</span>
                        </div>
                      </td>
                      <td class="py-5 px-8 font-black text-sm" [class.text-income-label]="tx.type === 0" [class.text-expense-label]="tx.type === 1">
                        {{ tx.type === 0 ? '+' : '-' }}{{ tx.amount | currency:'MXN ' }}
                      </td>
                      <td class="py-5 px-8">
                         <div class="flex items-center space-x-2 opacity-60">
                            <div class="w-1.5 h-1.5 rounded-full" [style.backgroundColor]="accountService.getAccountColor(tx.accountId)"></div>
                            <span class="text-[10px] font-black text-foreground uppercase">{{ accountService.getAccountName(tx.accountId) }}</span>
                         </div>
                      </td>
                      <td class="py-5 px-8 text-subtle font-black text-[10px] uppercase opacity-60">{{ tx.date | date:'dd MMM, yyyy' }}</td>
                      <td class="py-5 px-8">
                        <span class="px-2 py-0.5 border border-border rounded text-[9px] font-black uppercase tracking-widest text-subtle">
                          {{ categoryService.getCategoryName(tx.categoryId) }}
                        </span>
                      </td>
                      <td class="py-5 px-8 text-right">
                         <button (click)="deleteTransaction(tx.id)" class="p-2 text-subtle hover:text-expense opacity-0 group-hover:opacity-100 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                         </button>
                      </td>
                    </tr>
                  } @empty {
                    <tr><td colspan="6" class="py-20 text-center">
                       <div class="flex flex-col items-center space-y-4 opacity-40">
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                          <p class="text-[10px] font-black uppercase tracking-widest italic">No entries match your parameters.</p>
                       </div>
                    </td></tr>
                  }
                </tbody>
              </table>
           </div>

           <!-- Mobile Cards -->
           <div class="md:hidden space-y-3">
              @for (tx of filteredTransactions(); track tx.id) {
                 <div class="card !p-4 flex items-center justify-between border-border active:scale-[0.98] transition-transform shadow-sm">
                    <div class="flex items-center space-x-4 min-w-0">
                       <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white opacity-90 flex-shrink-0 shadow-sm" 
                            [style.backgroundColor]="categoryService.getCategoryColor(tx.categoryId)">
                          <span class="text-sm font-black">{{ categoryService.getCategoryName(tx.categoryId).substring(0, 1) }}</span>
                       </div>
                       <div class="min-w-0">
                          <p class="text-xs font-bold text-foreground truncate uppercase">{{ tx.description }}</p>
                          <p class="text-[9px] font-black text-subtle uppercase tracking-widest mt-0.5 opacity-60">
                             {{ tx.date | date:'dd MMM' }} • {{ accountService.getAccountName(tx.accountId) }}
                          </p>
                       </div>
                    </div>
                    <div class="text-right">
                       <p class="text-sm font-black tracking-tighter" [class.text-income-label]="tx.type === 0" [class.text-expense-label]="tx.type === 1">
                          {{ tx.type === 0 ? '+' : '-' }}{{ tx.amount | currency:'MXN ':'symbol':'1.0-0' }}
                       </p>
                    </div>
                 </div>
              } @empty {
                <div class="card py-20 flex flex-col items-center justify-center text-center space-y-6 border-dashed border-border opacity-60">
                   <div class="w-16 h-16 bg-foreground/[0.03] border border-border rounded-full flex items-center justify-center text-subtle">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                   </div>
                   <p class="text-[10px] font-black text-foreground uppercase tracking-[0.3em]">No entries logged</p>
                </div>
              }
           </div>

        } @else if (activeTab === 'transfers') {
           <div class="grid grid-cols-1 gap-3">
              @for (trf of transferService.transfers(); track trf.id) {
                 <div class="card !p-5 flex flex-col md:flex-row items-center gap-6 hover:border-primary/20 transition-all shadow-sm border-border">
                    <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary opacity-90 shadow-inner flex-shrink-0">
                       <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                    </div>
                    <div class="flex-1 flex items-center justify-center md:justify-start space-x-4">
                       <div class="text-center md:text-left min-w-0">
                          <p class="text-[8px] font-black text-subtle uppercase tracking-widest opacity-60">Source</p>
                          <p class="text-xs font-black text-foreground uppercase truncate">{{ accountService.getAccountName(trf.fromAccountId) }}</p>
                       </div>
                       <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-border flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                       <div class="text-center md:text-left min-w-0">
                          <p class="text-[8px] font-black text-subtle uppercase tracking-widest opacity-60">Target</p>
                          <p class="text-xs font-black text-foreground uppercase truncate">{{ accountService.getAccountName(trf.toAccountId) }}</p>
                       </div>
                    </div>
                    <div class="text-center md:text-right flex-shrink-0">
                       <p class="text-xl font-black text-foreground tracking-tighter">{{ trf.amount | currency:'MXN ' }}</p>
                       <p class="text-[9px] font-black text-subtle uppercase opacity-60">{{ trf.date | date:'dd MMM, yyyy' }}</p>
                    </div>
                 </div>
              } @empty {
                <div class="card py-24 flex flex-col items-center justify-center text-center space-y-6 border-dashed border-border opacity-60 shadow-sm">
                   <div class="w-16 h-16 bg-foreground/[0.03] border border-border rounded-full flex items-center justify-center text-subtle">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                   </div>
                   <div>
                      <h3 class="text-xs font-black text-foreground uppercase tracking-[0.3em] mb-2">No Transfers Detected</h3>
                      <p class="text-[10px] font-bold text-subtle uppercase tracking-widest opacity-50">No account bridging activity recorded.</p>
                   </div>
                </div>
              }
           </div>

        } @else {
           <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              @for (rec of recurringService.recurringTransactions(); track rec.id) {
                 <div class="card group transition-all border-border hover:border-primary/30 flex flex-col justify-between shadow-sm">
                    <div class="space-y-6">
                       <div class="flex justify-between items-start">
                          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white opacity-90 shadow-sm" [style.backgroundColor]="categoryService.getCategoryColor(rec.categoryId)">
                             <span class="text-xl font-black">{{ categoryService.getCategoryName(rec.categoryId).substring(0, 1) }}</span>
                          </div>
                          <div class="text-right">
                             <span class="px-2 py-1 bg-foreground/[0.05] border border-border rounded-lg text-[8px] font-black uppercase tracking-widest text-subtle shadow-inner">
                                {{ getFrequencyName(rec.frequency) }}
                             </span>
                             <p class="text-xl font-black text-foreground tracking-tighter mt-2">{{ rec.amount | currency:'MXN ' }}</p>
                          </div>
                       </div>
                       <div class="space-y-1">
                          <h3 class="text-sm font-black text-foreground uppercase tracking-widest">{{ rec.description }}</h3>
                          <p class="text-[9px] font-black text-subtle uppercase tracking-widest opacity-60">Next: {{ rec.nextExecutionDate | date:'dd MMM' }}</p>
                       </div>
                    </div>
                    <div class="mt-8 pt-4 border-t border-border flex justify-between items-center">
                       <div class="flex items-center space-x-2">
                          <div class="w-1.5 h-1.5 rounded-full" [class.bg-income]="rec.isActive" [class.bg-subtle]="!rec.isActive"></div>
                          <span class="text-[8px] font-black uppercase tracking-widest text-subtle">{{ rec.isActive ? 'Active' : 'Ended' }}</span>
                       </div>
                       <button (click)="deleteRecurring(rec.id)" class="text-subtle hover:text-expense p-2 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                       </button>
                    </div>
                 </div>
              } @empty {
                <div class="col-span-full card py-24 flex flex-col items-center justify-center text-center space-y-6 border-dashed border-border opacity-60 shadow-sm">
                   <div class="w-16 h-16 bg-foreground/[0.03] border border-border rounded-full flex items-center justify-center text-subtle">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                   </div>
                   <div>
                      <h3 class="text-xs font-black text-foreground uppercase tracking-[0.3em] mb-2">No Recurring Rules</h3>
                      <p class="text-[10px] font-bold text-subtle uppercase tracking-widest opacity-50">Automated financial cycles are currently inactive.</p>
                   </div>
                </div>
              }
           </div>
        }
      }
    </div>

    @if (isTransactionModalOpen) {
       <app-create-transaction-modal (close)="onModalClose()"></app-create-transaction-modal>
    }
    @if (isTransferModalOpen) {
       <app-create-transfer-modal (close)="onModalClose()"></app-create-transfer-modal>
    }
    @if (isRecurringModalOpen) {
       <app-create-recurring-transaction-modal (close)="onModalClose()"></app-create-recurring-transaction-modal>
    }
  `
})
export class TransactionsComponent implements OnInit {
  protected transactionService = inject(TransactionService);
  protected transferService = inject(TransferService);
  protected accountService = inject(AccountService);
  protected categoryService = inject(CategoryService);
  protected recurringService = inject(RecurringTransactionService);

  activeTab: 'transactions' | 'transfers' | 'recurring' = 'transactions';
  isTransactionModalOpen = false;
  isTransferModalOpen = false;
  isRecurringModalOpen = false;
  searchTerm = signal<string>('');
  isLoading = signal(true);

  filteredTransactions = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const txs = this.transactionService.transactions();
    if (!term) return txs;
    return txs.filter(t => t.description.toLowerCase().includes(term));
  });

  async ngOnInit() {
    this.isLoading.set(true);
    try {
      await Promise.all([
        this.transactionService.loadTransactions(),
        this.transferService.loadTransfers(),
        this.accountService.loadAccounts(),
        this.categoryService.loadCategories(),
        this.recurringService.loadRecurring()
      ]);
    } finally {
      this.isLoading.set(false);
    }
  }

  getFrequencyName(freq: number): string {
    const names = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
    return names[freq] || 'Monthly';
  }

  async onModalClose() {
    this.isTransactionModalOpen = false;
    this.isTransferModalOpen = false;
    this.isRecurringModalOpen = false;
    await Promise.all([
      this.transactionService.loadTransactions(),
      this.transferService.loadTransfers(),
      this.recurringService.loadRecurring()
    ]);
  }

  async deleteTransaction(id: string) {
    if (confirm('Delete this entry? Account balance will be reversed.')) {
      await this.transactionService.deleteTransaction(id);
    }
  }

  async deleteRecurring(id: string) {
    if (confirm('Delete this recurring rule? Future transactions will stop.')) {
      await this.recurringService.deleteRecurring(id);
    }
  }
}
