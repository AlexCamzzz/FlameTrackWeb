import { Component, EventEmitter, Output, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoalService } from '../../services/goal.service';
import { GoalDto } from '../../models/transaction.dto';

@Component({
  selector: 'app-deposit-goal-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" (click)="close.emit()">
      <div class="bg-surface border border-border/20 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up" (click)="$event.stopPropagation()">
        <div class="p-6 border-b border-border/20 flex justify-between items-center">
          <h2 class="text-xl font-bold">Deposit to Goal</h2>
          <button (click)="close.emit()" class="text-subtle hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" class="p-6 space-y-4">
          <div class="mb-4">
            <p class="text-sm text-subtle">Depositing to: <strong class="text-white">{{ goal?.name }}</strong></p>
          </div>

          <div>
            <label class="block text-sm font-medium text-subtle mb-1">Amount to Deposit</label>
            <input type="number" name="amount" [(ngModel)]="amount" required min="0.01" step="0.01"
              class="w-full bg-background border border-border/50 rounded-lg px-4 py-2 focus:outline-none focus:border-income">
          </div>

          <div class="pt-4 flex justify-end space-x-3">
            <button type="button" (click)="close.emit()" class="px-4 py-2 text-subtle hover:text-white transition-colors font-medium">Cancel</button>
            <button type="submit" [disabled]="isSubmitting || amount <= 0" class="bg-income hover:bg-income/90 text-white rounded-lg px-6 py-2 font-semibold transition-colors disabled:opacity-50">
              {{ isSubmitting ? 'Processing...' : 'Deposit' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class DepositGoalModalComponent {
  @Input() goal: GoalDto | null = null;
  @Output() close = new EventEmitter<void>();
  
  private goalService = inject(GoalService);

  isSubmitting = false;
  amount = 0;

  async onSubmit() {
    if (!this.goal || this.amount <= 0) return;
    
    this.isSubmitting = true;
    try {
      await this.goalService.depositToGoal(this.goal.id, this.amount);
      this.close.emit();
    } catch (e) {
      console.error(e);
    } finally {
      this.isSubmitting = false;
    }
  }
}
