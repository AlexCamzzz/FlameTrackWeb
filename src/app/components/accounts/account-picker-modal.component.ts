import { Component, EventEmitter, Output, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { AccountDto } from '../../models/transaction.dto';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ACCOUNT_ICONS } from '../../models/constants';

@Component({
  selector: 'app-account-picker-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in" (click)="close.emit()">
      <div class="bg-[#1A191F] border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-slide-up" (click)="$event.stopPropagation()">
        
        <div class="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
          <div>
            <h2 class="text-2xl font-black text-white uppercase tracking-tight">Select Account</h2>
            <p class="text-subtle text-[10px] font-black uppercase tracking-widest mt-1 opacity-50">Transaction Source // Reference</p>
          </div>
          <button (click)="close.emit()" class="w-12 h-12 bg-white/5 rounded-2xl hover:bg-white/10 text-white transition-all flex items-center justify-center border border-white/5">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="p-8">
           <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              @for (acc of accountService.accounts(); track acc.id) {
                 @if (!acc.isArchived) {
                    <div (click)="select(acc)"
                         class="group p-5 bg-black/20 border border-white/5 rounded-3xl cursor-pointer transition-all hover:bg-white/5 hover:border-white/20 flex items-center space-x-4 active:scale-95">
                      <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-white p-2.5 shadow-2xl transition-transform group-hover:scale-110" 
                           [style.backgroundColor]="acc.color" [innerHTML]="getIcon(acc.type)">
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="font-black text-white truncate uppercase tracking-tight text-sm">{{ acc.name }}</p>
                        <p class="text-[10px] font-black text-subtle uppercase tracking-widest mt-0.5">{{ acc.balance | currency:acc.currency + ' ':'symbol':'1.0-0' }}</p>
                      </div>
                    </div>
                 }
              }
           </div>
           
           @if (accountService.accounts().length === 0) {
              <div class="py-20 text-center text-subtle text-[10px] font-black uppercase tracking-[0.3em] italic opacity-50">
                 No active financial links detected.
              </div>
           }
        </div>
      </div>
    </div>
  `
})
export class AccountPickerModalComponent implements OnInit {
  @Output() selectAccount = new EventEmitter<AccountDto>();
  @Output() close = new EventEmitter<void>();

  accountService = inject(AccountService);
  private sanitizer = inject(DomSanitizer);

  ngOnInit() {
    this.accountService.loadAccounts();
  }

  select(acc: AccountDto) {
    this.selectAccount.emit(acc);
    this.close.emit();
  }

  getIcon(type: number): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(ACCOUNT_ICONS[type] || '');
  }
}
