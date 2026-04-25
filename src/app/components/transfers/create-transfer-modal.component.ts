import { Component, EventEmitter, Output, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransferService } from '../../services/transfer.service';
import { AccountService } from '../../services/account.service';
import { CreateTransferRequestDto, AccountDto } from '../../models/transaction.dto';
import { AccountPickerModalComponent } from '../accounts/account-picker-modal.component';

@Component({
  selector: 'app-create-transfer-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, AccountPickerModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in px-4" (click)="close.emit()">
      <div class="card !p-0 w-full max-w-lg overflow-hidden animate-slide-up border-border shadow-2xl" (click)="$event.stopPropagation()">
        
        <div class="p-8 border-b border-border flex justify-between items-center bg-foreground/[0.02]">
          <h2 class="text-xl font-black text-foreground uppercase tracking-tight">Transfer Registry</h2>
          <button (click)="close.emit()" class="w-10 h-10 bg-foreground/[0.05] rounded-2xl hover:bg-foreground/[0.1] text-foreground transition-all flex items-center justify-center border border-border">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" class="p-8 space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            <div class="md:col-span-5 space-y-2">
              <label class="block text-[10px] font-black text-subtle uppercase tracking-widest ml-1">From Source</label>
              <button type="button" (click)="openPicker('from')" 
                class="w-full p-4 bg-foreground/[0.03] border border-border rounded-2xl text-left transition-all hover:border-primary/40 shadow-inner">
                @if (fromAccount) {
                  <div class="flex items-center space-x-3">
                    <div class="w-2 h-2 rounded-full shadow-md" [style.backgroundColor]="fromAccount.color"></div>
                    <span class="font-black text-foreground text-xs truncate uppercase tracking-tighter">{{ fromAccount.name }}</span>
                  </div>
                } @else {
                  <span class="text-subtle font-black text-[10px] uppercase opacity-40 italic">Select...</span>
                }
              </button>
            </div>

            <div class="md:col-span-1 flex justify-center py-2 md:py-0">
               <div class="w-10 h-10 bg-foreground/[0.03] rounded-full flex items-center justify-center border border-border text-primary shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
               </div>
            </div>

            <div class="md:col-span-5 space-y-2">
              <label class="block text-[10px] font-black text-subtle uppercase tracking-widest ml-1">To Destination</label>
              <button type="button" (click)="openPicker('to')" 
                class="w-full p-4 bg-foreground/[0.03] border border-border rounded-2xl text-left transition-all hover:border-primary/40 shadow-inner">
                @if (toAccount) {
                  <div class="flex items-center space-x-3">
                    <div class="w-2 h-2 rounded-full shadow-md" [style.backgroundColor]="toAccount.color"></div>
                    <span class="font-black text-foreground text-xs truncate uppercase tracking-tighter">{{ toAccount.name }}</span>
                  </div>
                } @else {
                  <span class="text-subtle font-black text-[10px] uppercase opacity-40 italic">Select...</span>
                }
              </button>
            </div>
          </div>

          <div class="space-y-6">
            <div>
              <label class="block text-[10px] font-black text-subtle uppercase tracking-widest mb-2 ml-1">Liquidity Volume</label>
              <input type="number" name="amount" [(ngModel)]="model.amount" required min="0.01" step="0.01"
                class="input-premium w-full py-6 text-3xl font-black text-center tracking-tighter shadow-inner">
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label class="block text-[10px] font-black text-subtle uppercase tracking-widest mb-2 ml-1">Execution Date</label>
                  <input type="date" name="date" [(ngModel)]="dateStr" required
                    class="input-premium w-full shadow-inner" style="color-scheme: light dark;">
               </div>
               <div>
                  <label class="block text-[10px] font-black text-subtle uppercase tracking-widest mb-2 ml-1">Journal Note</label>
                  <input type="text" name="note" [(ngModel)]="model.note" placeholder="..."
                    class="input-premium w-full shadow-inner">
               </div>
            </div>
          </div>

          <div class="pt-4">
            <button type="submit" [disabled]="isSaving || !model.fromAccountId || !model.toAccountId || model.amount <= 0 || model.fromAccountId === model.toAccountId" 
               class="btn-premium w-full py-5 shadow-lg shadow-primary/10">
              {{ isSaving ? 'Synchronizing...' : 'Confirm Transfer' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    @if (showPicker) {
       <app-account-picker-modal
         (selectAccount)="onAccountSelect($event)" 
         (close)="showPicker = false">
       </app-account-picker-modal>
    }
  `
})
export class CreateTransferModalComponent {
  @Output() close = new EventEmitter<void>();
  
  private transferService = inject(TransferService);
  protected accountService = inject(AccountService);

  isSaving = false;
  showPicker = false;
  pickerTarget: 'from' | 'to' = 'from';

  fromAccount: AccountDto | null = null;
  toAccount: AccountDto | null = null;
  dateStr = new Date().toISOString().split('T')[0];

  model: CreateTransferRequestDto = {
    fromAccountId: '',
    toAccountId: '',
    amount: 0,
    note: '',
    date: ''
  };

  openPicker(target: 'from' | 'to') {
    this.pickerTarget = target;
    this.showPicker = true;
  }

  onAccountSelect(acc: AccountDto) {
    if (this.pickerTarget === 'from') {
      this.fromAccount = acc;
      this.model.fromAccountId = acc.id;
    } else {
      this.toAccount = acc;
      this.model.toAccountId = acc.id;
    }
  }

  async onSubmit() {
    if (!this.model.fromAccountId || !this.model.toAccountId || this.model.amount <= 0) return;
    this.isSaving = true;
    try {
      this.model.date = new Date(this.dateStr).toISOString();
      await this.transferService.createTransfer(this.model);
      this.close.emit();
    } catch (e) {
      console.error(e);
    } finally {
      this.isSaving = false;
    }
  }
}
