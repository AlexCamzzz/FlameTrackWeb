import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AccountService } from '../../services/account.service';
import { CreateAccountModalComponent } from './create-account-modal.component';
import { AccountDto } from '../../models/transaction.dto';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ACCOUNT_ICONS } from '../../models/constants';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, CreateAccountModalComponent, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8 animate-fade-in pb-12">
      <header class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border pb-6">
        <div>
          <h1 class="text-xl md:text-2xl font-black text-foreground uppercase tracking-widest">Financial Sources</h1>
          <div class="h-1 w-8 bg-primary mt-2"></div>
        </div>
        <button (click)="isModalOpen = true" class="btn-premium flex items-center space-x-2 w-full sm:w-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" /></svg>
          <span>New Account</span>
        </button>
      </header>

      @if (isLoading()) {
         <div class="py-40 flex flex-col items-center justify-center space-y-4 opacity-40">
            <div class="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p class="text-[10px] font-black uppercase tracking-[0.4em]">Querying Sources...</p>
         </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (acc of accountService.accounts(); track acc.id) {
            <div class="group relative overflow-hidden card border-border transition-all hover:border-primary/30">
              <div class="flex justify-between items-start mb-10">
                <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-white p-3.5 transition-transform group-hover:scale-105 opacity-90 shadow-sm" 
                     [style.backgroundColor]="acc.color" [innerHTML]="getIcon(acc.type)">
                </div>
                <button (click)="archive(acc)" class="w-8 h-8 bg-foreground/[0.05] rounded-lg flex items-center justify-center text-subtle hover:bg-red-500/20 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100" title="Archive account">
                   <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                </button>
              </div>

              <div class="space-y-4">
                <div>
                  <p class="text-[9px] font-black text-subtle uppercase tracking-widest mb-1">{{ getTypeName(acc.type) }}</p>
                  <h3 class="text-xl font-bold text-foreground tracking-tight uppercase group-hover:text-primary transition-colors truncate">{{ acc.name }}</h3>
                </div>
                
                <div class="flex items-baseline space-x-2">
                   <span class="text-2xl font-black text-foreground tracking-tighter">{{ acc.balance | currency:acc.currency + ' ':'symbol':'1.0-0' }}</span>
                   <span class="text-[9px] font-black text-subtle uppercase tracking-widest opacity-60">{{ acc.currency }}</span>
                </div>
              </div>
            </div>
          } @empty {
            <div class="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-4 bg-foreground/[0.01] rounded-[2rem] border border-dashed border-border opacity-60">
               <div class="text-subtle opacity-30">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" /></svg>
               </div>
               <p class="text-subtle text-[11px] font-black uppercase tracking-[0.3em]">No sources established</p>
            </div>
          }
        </div>
      }
    </div>

    @if (isModalOpen) {
       <app-create-account-modal (close)="onModalClose()"></app-create-account-modal>
    }
  `
})
export class AccountsComponent implements OnInit {
  accountService = inject(AccountService);
  private sanitizer = inject(DomSanitizer);
  isModalOpen = false;
  isLoading = signal(true);

  async ngOnInit() {
    this.isLoading.set(true);
    try {
      await this.accountService.loadAccounts();
    } finally {
      this.isLoading.set(false);
    }
  }

  getIcon(type: number): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(ACCOUNT_ICONS[type] || '');
  }

  getTypeName(type: number): string {
    const names = ['Cash', 'Debit Card', 'Credit Card', 'Voucher', 'Digital Wallet', 'Investment'];
    return names[type] || 'Other';
  }

  async onModalClose() {
    this.isModalOpen = false;
    await this.accountService.loadAccounts();
  }

  async archive(acc: AccountDto) {
    if (confirm(`Are you sure you want to archive "${acc.name}"?`)) {
      await this.accountService.archiveAccount(acc.id);
    }
  }
}
