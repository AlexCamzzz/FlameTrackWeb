import { Component, inject, OnInit, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { DebtService } from '../../services/debt.service';
import { AccountService } from '../../services/account.service';
import { TransactionTypeDto, DebtType, DebtDto } from '../../models/transaction.dto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-debts',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, DecimalPipe, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8 animate-fade-in pb-12">
      <header class="flex justify-between items-end py-2 border-b border-border pb-6">
        <div>
          <p class="text-[10px] font-black text-subtle uppercase tracking-[0.4em] mb-1">Financial Obligations</p>
          <h1 class="text-3xl md:text-4xl font-black text-foreground uppercase tracking-tight">Debt Tracker</h1>
        </div>
        <button (click)="isCreateModalOpen.set(true)" class="btn-premium">
           <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" /></svg>
           <span>New Debt</span>
        </button>
      </header>

      <!-- Stats Summary -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="card !p-8 border-expense/20 bg-expense/[0.01]">
          <p class="text-[10px] font-black text-expense uppercase tracking-[0.3em] mb-2">Total I Owe</p>
          <h3 class="text-4xl font-black text-foreground tracking-tighter">{{ totalIOwe() | currency:'MXN ':'symbol':'1.0-0' }}</h3>
        </div>
        <div class="card !p-8 border-income/20 bg-income/[0.01]">
          <p class="text-[10px] font-black text-income uppercase tracking-[0.3em] mb-2">Total Owed To Me</p>
          <h3 class="text-4xl font-black text-foreground tracking-tighter">{{ totalOwedToMe() | currency:'MXN ':'symbol':'1.0-0' }}</h3>
        </div>
      </div>

      <!-- Debt List -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        @for (debt of debtService.debts(); track debt.id) {
          <div class="card !p-6 flex flex-col justify-between group transition-all hover:border-primary/20 border-border" [class.opacity-60]="debt.isCleared">
            <div class="flex justify-between items-start mb-6">
              <div class="space-y-1 min-w-0">
                <div class="flex items-center space-x-2">
                   <span class="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg shadow-inner border border-border"
                         [class.bg-expense/10]="debt.type === 1" [class.text-expense]="debt.type === 1"
                         [class.bg-income/10]="debt.type === 0" [class.text-income]="debt.type === 0">
                      {{ debt.type === 1 ? 'I Owe' : 'Owed To Me' }}
                   </span>
                   @if (debt.isCleared) {
                     <span class="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg bg-foreground/10 text-subtle border border-border">Cleared</span>
                   }
                </div>
                <h3 class="text-lg font-black text-foreground uppercase tracking-tight truncate">{{ debt.creditorDebtor }}</h3>
                <p class="text-xs font-black text-subtle uppercase tracking-widest opacity-60 truncate">{{ debt.description }}</p>
              </div>
              <div class="text-right">
                <p class="text-xl font-black tracking-tighter text-foreground">{{ debt.remainingAmount | currency:'MXN ':'symbol':'1.0-0' }}</p>
                <p class="text-[9px] font-black text-subtle uppercase tracking-widest opacity-40">Of {{ debt.totalAmount | currency:'MXN ':'symbol':'1.0-0' }}</p>
              </div>
            </div>

            <div class="space-y-4">
               <div class="w-full bg-foreground/[0.03] h-2 rounded-full overflow-hidden shadow-inner border border-border">
                  <div class="h-full transition-all duration-1000 rounded-full opacity-90"
                       [class.bg-expense]="debt.type === 1" [class.bg-income]="debt.type === 0"
                       [style.width.%]="((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100"></div>
               </div>
               
               <div class="flex justify-between items-center pt-2">
                  <div class="flex flex-col">
                    <span class="text-[8px] font-black text-subtle uppercase tracking-tighter opacity-40">Due Date</span>
                    <span class="text-[10px] font-black text-foreground uppercase tracking-widest">{{ debt.dueDate | date:'dd MMM, yyyy' }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    @if (!debt.isCleared) {
                      <button (click)="openPayModal(debt)" class="p-2 bg-foreground/5 hover:bg-primary/10 text-subtle hover:text-primary rounded-xl transition-all shadow-sm border border-border group/btn">
                         <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      </button>
                    }
                    <button (click)="deleteDebt(debt.id)" class="p-2 bg-foreground/5 hover:bg-expense/10 text-subtle hover:text-expense rounded-xl transition-all shadow-sm border border-border">
                       <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
               </div>
            </div>
          </div>
        } @empty {
          <div class="col-span-full card py-32 flex flex-col items-center justify-center text-center space-y-6 border-dashed border-border opacity-60">
             <div class="w-16 h-16 bg-foreground/[0.03] border border-border rounded-full flex items-center justify-center text-subtle">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <p class="text-[10px] font-black text-foreground uppercase tracking-[0.3em]">No debt records found</p>
          </div>
        }
      </div>

      <!-- Modals -->
      @if (isCreateModalOpen()) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div class="card !p-8 w-full max-w-md shadow-2xl border-primary/20 animate-scale-in">
            <h2 class="text-xl font-black text-foreground uppercase tracking-widest mb-8">Log New Obligation</h2>
            
            <form (submit)="createDebt()" class="space-y-6">
              <div class="flex flex-col space-y-2">
                <label class="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Entity / Person</label>
                <input type="text" [(ngModel)]="newDebt.creditorDebtor" name="creditorDebtor" class="input-premium w-full" placeholder="Who?" required>
              </div>

              <div class="flex flex-col space-y-2">
                <label class="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Description</label>
                <input type="text" [(ngModel)]="newDebt.description" name="description" class="input-premium w-full" placeholder="What for?">
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col space-y-2">
                  <label class="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Amount</label>
                  <input type="number" [(ngModel)]="newDebt.totalAmount" name="totalAmount" class="input-premium w-full" placeholder="0.00" required>
                </div>
                <div class="flex flex-col space-y-2">
                  <label class="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Due Date</label>
                  <input type="date" [(ngModel)]="newDebt.dueDate" name="dueDate" class="input-premium w-full" required>
                </div>
              </div>

              <div class="flex flex-col space-y-2">
                <label class="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Debt Direction</label>
                <div class="flex bg-foreground/[0.03] p-1 rounded-xl border border-border">
                  <button type="button" (click)="newDebt.type = 1" 
                    [class.bg-expense]="newDebt.type === 1" [class.text-white]="newDebt.type === 1"
                    [class.text-subtle]="newDebt.type !== 1"
                    class="flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">I Owe</button>
                  <button type="button" (click)="newDebt.type = 0" 
                    [class.bg-income]="newDebt.type === 0" [class.text-white]="newDebt.type === 0"
                    [class.text-subtle]="newDebt.type !== 0"
                    class="flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">Owed To Me</button>
                </div>
              </div>

              <div class="flex gap-4 pt-4">
                <button type="button" (click)="isCreateModalOpen.set(false)" class="btn-secondary flex-1">Cancel</button>
                <button type="submit" class="btn-premium flex-1">Create</button>
              </div>
            </form>
          </div>
        </div>
      }

      @if (isPayModalOpen()) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div class="card !p-8 w-full max-w-md shadow-2xl border-primary/20 animate-scale-in">
            <h2 class="text-xl font-black text-foreground uppercase tracking-widest mb-8">Process Payment</h2>
            
            <form (submit)="payDebt()" class="space-y-6">
              <div class="p-4 bg-foreground/[0.02] border border-border rounded-2xl mb-6">
                <p class="text-[10px] font-black text-subtle uppercase tracking-widest mb-1">Target</p>
                <p class="text-sm font-black text-foreground uppercase">{{ selectedDebt()?.creditorDebtor }}</p>
                <p class="text-[10px] font-bold text-subtle uppercase opacity-60">Remaining: {{ selectedDebt()?.remainingAmount | currency }}</p>
              </div>

              <div class="flex flex-col space-y-2">
                <label class="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Payment Amount</label>
                <input type="number" [(ngModel)]="payAmount" name="payAmount" class="input-premium w-full" [max]="selectedDebt()?.remainingAmount || 0" required>
              </div>

              <div class="flex flex-col space-y-2">
                <label class="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Source Account</label>
                <select [(ngModel)]="payAccountId" name="accountId" class="input-premium w-full" required>
                   @for (acc of accountService.accounts(); track acc.id) {
                     <option [value]="acc.id">{{ acc.name }} ({{ acc.balance | currency }})</option>
                   }
                </select>
              </div>

              <div class="flex gap-4 pt-4">
                <button type="button" (click)="isPayModalOpen.set(false)" class="btn-secondary flex-1">Cancel</button>
                <button type="submit" class="btn-premium flex-1">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class DebtsComponent implements OnInit {
  protected debtService = inject(DebtService);
  protected accountService = inject(AccountService);

  isCreateModalOpen = signal(false);
  isPayModalOpen = signal(false);
  selectedDebt = signal<DebtDto | null>(null);

  newDebt = {
    creditorDebtor: '',
    description: '',
    totalAmount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    type: DebtType.IOwe
  };

  payAmount = 0;
  payAccountId = '';

  totalIOwe = computed(() => 
    this.debtService.debts()
      .filter(d => d.type === DebtType.IOwe && !d.isCleared)
      .reduce((sum, d) => sum + d.remainingAmount, 0)
  );

  totalOwedToMe = computed(() => 
    this.debtService.debts()
      .filter(d => d.type === DebtType.OwedToMe && !d.isCleared)
      .reduce((sum, d) => sum + d.remainingAmount, 0)
  );

  ngOnInit() {
    this.debtService.loadDebts();
    this.accountService.loadAccounts();
  }

  async createDebt() {
    try {
      await this.debtService.createDebt(this.newDebt as any);
      this.isCreateModalOpen.set(false);
      this.resetNewDebt();
    } catch (error) {
      alert('Failed to create debt record.');
    }
  }

  openPayModal(debt: DebtDto) {
    this.selectedDebt.set(debt);
    this.payAmount = debt.remainingAmount;
    if (this.accountService.accounts().length > 0) {
      this.payAccountId = this.accountService.accounts()[0].id;
    }
    this.isPayModalOpen.set(true);
  }

  async payDebt() {
    const debt = this.selectedDebt();
    if (!debt) return;

    try {
      await this.debtService.payDebt(debt.id, {
        amount: this.payAmount,
        accountId: this.payAccountId
      });
      this.isPayModalOpen.set(false);
    } catch (error) {
      alert('Payment failed. Check account balance.');
    }
  }

  async deleteDebt(id: string) {
    if (confirm('Permanently remove this debt record? Financial history remains unchanged.')) {
      await this.debtService.deleteDebt(id);
    }
  }

  private resetNewDebt() {
    this.newDebt = {
      creditorDebtor: '',
      description: '',
      totalAmount: 0,
      dueDate: new Date().toISOString().split('T')[0],
      type: DebtType.IOwe
    };
  }
}
