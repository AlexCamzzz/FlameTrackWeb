import { Component, EventEmitter, Input, Output, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoalService } from '../../services/goal.service';
import { TutorialService } from '../../services/tutorial.service';
import { GoalDto, AccountDto } from '../../models/transaction.dto';
import { AccountPickerModalComponent } from '../accounts/account-picker-modal.component';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-deposit-goal-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, AccountPickerModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" (click)="close.emit()">
      <div class="bg-[#1A191F] border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-slide-up" (click)="$event.stopPropagation()">
        
        <div class="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div class="flex items-center space-x-3">
            <div>
              <h2 class="text-xl font-black text-white uppercase tracking-tight">Allocation</h2>
              <p class="text-subtle text-[9px] font-black uppercase tracking-widest mt-1 opacity-40">Target: {{ goal.name }}</p>
            </div>
            <button (click)="tutorial.start('modal-deposit-goal')" class="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all text-[10px] font-black border border-primary/20">?</button>
          </div>
          <button (click)="close.emit()" class="w-10 h-10 bg-white/5 rounded-2xl hover:bg-white/10 text-white transition-all flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" class="p-8 space-y-8">
          <div class="space-y-6">
            <div>
              <label class="block text-[10px] font-black text-subtle uppercase tracking-widest mb-2 ml-1">Source Account</label>
              <button type="button" (click)="isAccountPickerOpen = true" 
                data-tutorial="picker-source-account"
                class="w-full flex items-center justify-between bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-left transition-all hover:bg-white/5 group overflow-hidden shadow-inner">
                <div class="flex items-center space-x-3 min-w-0">
                  @if (selectedAccount) {
                    <div class="w-2.5 h-2.5 rounded-full shadow-lg" [style.backgroundColor]="selectedAccount.color"></div>
                    <span class="font-bold text-white text-sm truncate uppercase tracking-tighter">{{ selectedAccount.name }}</span>
                  } @else {
                    <span class="text-subtle font-bold italic text-sm opacity-40">Select source...</span>
                  }
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-subtle transition-transform group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>

            <div>
              <label class="block text-[10px] font-black text-subtle uppercase tracking-widest mb-2 ml-1">Allocation Amount</label>
              <input type="number" name="amount" [(ngModel)]="amount" required min="0.01"
                data-tutorial="input-deposit-amount"
                class="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-5 text-white font-black text-2xl focus:outline-none focus:border-primary transition-all shadow-inner text-center tracking-tighter">
            </div>
          </div>

          <div class="pt-4">
            <button type="submit" [disabled]="amount <= 0 || !selectedAccount || isSaving" class="btn-premium w-full py-5">
              {{ isSaving ? 'Establishing Link...' : 'Confirm Allocation' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    @if (isAccountPickerOpen) {
       <app-account-picker-modal
         (selectAccount)="onAccountSelect($event)"
         (close)="isAccountPickerOpen = false">
       </app-account-picker-modal>
    }
  `
})
export class DepositGoalModalComponent {
  @Input() goal!: GoalDto;
  @Output() close = new EventEmitter<void>();
  
  private goalService = inject(GoalService);
  protected accountService = inject(AccountService);
  protected tutorial = inject(TutorialService);

  amount = 0;
  isSaving = false;
  isAccountPickerOpen = false;
  selectedAccount: AccountDto | null = null;

  onAccountSelect(acc: AccountDto) {
    this.selectedAccount = acc;
  }

  async onSubmit() {
    if (this.amount <= 0 || !this.selectedAccount) return;
    this.isSaving = true;
    try {
      await this.goalService.depositToGoal(this.goal.id, this.amount, this.selectedAccount.id);
      this.close.emit();
    } catch (e) {
      console.error(e);
    } finally {
      this.isSaving = false;
    }
  }
}
