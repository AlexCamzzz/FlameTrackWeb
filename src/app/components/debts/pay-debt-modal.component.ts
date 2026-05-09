import { Component, EventEmitter, Output, inject, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DebtService } from '../../services/debt.service';
import { AccountService } from '../../services/account.service';
import { DebtDto, PayDebtRequestDto } from '../../models/transaction.dto';

@Component({
  selector: 'app-pay-debt-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" (click)="close.emit()">
      <div class="card !p-0 w-full max-w-md overflow-hidden animate-slide-up border-border" (click)="$event.stopPropagation()">
        
        <div class="p-8 border-b border-border flex justify-between items-center bg-foreground/[0.02]">
          <h2 class="text-xl font-black text-foreground uppercase tracking-tight">Process Payment</h2>
          <button (click)="close.emit()" class="w-10 h-10 bg-foreground/[0.05] rounded-2xl hover:bg-foreground/[0.1] text-foreground transition-all flex items-center justify-center border border-border">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" class="p-8 space-y-6">
          <div class="p-5 bg-foreground/[0.02] border border-border rounded-2xl mb-2 shadow-inner">
            <p class="text-[10px] font-black text-subtle uppercase tracking-widest mb-1">Target</p>
            <p class="text-sm font-black text-foreground uppercase tracking-tight">{{ debt.creditorDebtor }}</p>
            <div class="flex items-center space-x-2 mt-1">
               <span class="text-[9px] font-bold text-subtle uppercase opacity-60">Remaining:</span>
               <span class="text-[11px] font-black text-foreground">{{ debt.remainingAmount | currency:'MXN ' }}</span>
            </div>
          </div>

          <div class="flex flex-col space-y-2">
            <label class="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Payment Amount</label>
            <input type="number" [(ngModel)]="model.amount" name="amount" class="input-premium w-full text-xl font-black text-center" [max]="debt.remainingAmount" required>
          </div>

          <div class="flex flex-col space-y-2">
            <label class="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Source Account</label>
            <select [(ngModel)]="model.accountId" name="accountId" class="input-premium w-full" required style="color-scheme: dark;">
               @for (acc of accountService.accounts(); track acc.id) {
                 <option [value]="acc.id">{{ acc.name }} ({{ acc.balance | currency:'MXN ' }})</option>
               }
            </select>
          </div>

          <div class="pt-6">
            <button type="submit" [disabled]="isSubmitting || model.amount <= 0 || !model.accountId" 
               class="btn-premium w-full py-5 shadow-lg shadow-primary/10">
              {{ isSubmitting ? 'Syncing...' : 'Confirm Payment' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class PayDebtModalComponent implements OnInit {
  @Input() debt!: DebtDto;
  @Output() close = new EventEmitter<void>();
  
  private debtService = inject(DebtService);
  protected accountService = inject(AccountService);
  
  isSubmitting = false;

  model: PayDebtRequestDto = {
    amount: 0,
    accountId: ''
  };

  ngOnInit() {
    this.model.amount = this.debt.remainingAmount;
    if (this.accountService.accounts().length > 0) {
      this.model.accountId = this.accountService.accounts()[0].id;
    }
  }

  async onSubmit() {
    if (this.model.amount <= 0 || !this.model.accountId) return;
    
    this.isSubmitting = true;
    try {
      await this.debtService.payDebt(this.debt.id, this.model);
      this.close.emit();
    } catch (e) {
      console.error(e);
      alert('Payment failed. Check account balance.');
    } finally {
      this.isSubmitting = false;
    }
  }
}
