import { Component, EventEmitter, Output, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { AccountType } from '../../models/transaction.dto';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ACCOUNT_ICONS } from '../../models/constants';

@Component({
  selector: 'app-create-account-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in px-4" (click)="close.emit()">
      <div class="card !p-0 w-full max-w-lg overflow-hidden animate-slide-up border-border" (click)="$event.stopPropagation()">
        
        <div class="p-6 md:p-8 border-b border-border flex justify-between items-center bg-foreground/[0.02]">
          <h2 class="text-xl font-black text-foreground uppercase tracking-tight">New Account Source</h2>
          <button (click)="close.emit()" class="w-10 h-10 bg-foreground/[0.05] rounded-2xl hover:bg-foreground/[0.1] text-foreground transition-all flex items-center justify-center border border-border">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" class="p-6 md:p-8 space-y-6">
          <div class="space-y-6">
            <div>
              <label class="block text-[10px] font-black text-subtle uppercase tracking-widest mb-2 ml-1">Account Label</label>
              <input type="text" name="name" [(ngModel)]="model.name" required placeholder="E.g. Primary Checking"
                class="input-premium w-full shadow-inner">
            </div>

            <div>
              <label class="block text-[10px] font-black text-subtle uppercase tracking-widest mb-3 ml-1">Type Classification</label>
              <div class="grid grid-cols-3 gap-2 p-2 bg-foreground/[0.03] border border-border rounded-2xl">
                 @for (type of types; track type.id) {
                   <button type="button" (click)="model.type = type.id"
                     [class.bg-primary]="model.type === type.id" [class.text-white]="model.type === type.id"
                     [class.text-subtle]="model.type !== type.id"
                     class="flex flex-col items-center justify-center p-3 rounded-xl transition-all hover:bg-foreground/[0.05]">
                     <div class="w-5 h-5 mb-1.5" [innerHTML]="getIcon(type.id)"></div>
                     <span class="text-[8px] font-black uppercase tracking-tighter">{{ type.label }}</span>
                   </button>
                 }
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label class="block text-[10px] font-black text-subtle uppercase tracking-widest mb-2 ml-1">Initial Liquidity</label>
                  <input type="number" name="initialBalance" [(ngModel)]="model.initialBalance" required
                    class="input-premium w-full font-black shadow-inner">
               </div>
               <div>
                  <label class="block text-[10px] font-black text-subtle uppercase tracking-widest mb-2 ml-1">Visual Marker</label>
                  <div class="flex items-center space-x-4 bg-foreground/[0.03] border border-border rounded-xl px-4 py-3 shadow-inner">
                     <input type="color" name="color" [(ngModel)]="model.color" class="w-10 h-10 rounded-lg bg-transparent border-0 cursor-pointer">
                     <span class="text-xs font-mono font-bold text-foreground opacity-60 uppercase">{{ model.color }}</span>
                  </div>
               </div>
            </div>
          </div>

          <button type="submit" [disabled]="!model.name || isSaving" class="btn-premium w-full py-5 shadow-lg shadow-primary/10">
            {{ isSaving ? 'Establishing Link...' : 'Confirm Registry' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class CreateAccountModalComponent {
  @Output() close = new EventEmitter<void>();
  
  private accountService = inject(AccountService);
  private sanitizer = inject(DomSanitizer);

  isSaving = false;
  model = {
    name: '',
    type: AccountType.Debit,
    initialBalance: 0,
    color: '#FF5722',
    currency: 'MXN'
  };

  types = [
    { id: AccountType.Cash, label: 'Cash' },
    { id: AccountType.Debit, label: 'Debit' },
    { id: AccountType.Credit, label: 'Credit' },
    { id: AccountType.Voucher, label: 'Voucher' },
    { id: AccountType.Digital, label: 'Digital' },
    { id: AccountType.Investment, label: 'Invest' }
  ];

  getIcon(type: number): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(ACCOUNT_ICONS[type] || '');
  }

  async onSubmit() {
    if (!this.model.name) return;
    this.isSaving = true;
    try {
      await this.accountService.createAccount(this.model);
      this.close.emit();
    } finally {
      this.isSaving = false;
    }
  }
}
