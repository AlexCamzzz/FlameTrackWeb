import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoalService } from '../../services/goal.service';

@Component({
  selector: 'app-create-goal-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" (click)="close.emit()">
      <div class="bg-surface border border-border/20 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up" (click)="$event.stopPropagation()">
        <div class="p-6 border-b border-border/20 flex justify-between items-center">
          <h2 class="text-xl font-bold">New Goal</h2>
          <button (click)="close.emit()" class="text-subtle hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-subtle mb-1">Goal Name</label>
            <input type="text" name="name" [(ngModel)]="model.name" required placeholder="e.g. New Car"
              class="w-full bg-background border border-border/50 rounded-lg px-4 py-2 focus:outline-none focus:border-primary">
          </div>

          <div>
            <label class="block text-sm font-medium text-subtle mb-1">Target Amount</label>
            <input type="number" name="targetAmount" [(ngModel)]="model.targetAmount" required min="1" step="0.01"
              class="w-full bg-background border border-border/50 rounded-lg px-4 py-2 focus:outline-none focus:border-primary">
          </div>

          <div>
            <label class="block text-sm font-medium text-subtle mb-1">Current Amount (Initial)</label>
            <input type="number" name="currentAmount" [(ngModel)]="model.currentAmount" min="0" step="0.01"
              class="w-full bg-background border border-border/50 rounded-lg px-4 py-2 focus:outline-none focus:border-primary">
          </div>

          <div>
            <label class="block text-sm font-medium text-subtle mb-1">Deadline</label>
            <input type="date" name="deadline" [(ngModel)]="model.deadline" required
              class="w-full bg-background border border-border/50 rounded-lg px-4 py-2 focus:outline-none focus:border-primary" style="color-scheme: dark;">
          </div>

          <div class="pt-4 flex justify-end space-x-3">
            <button type="button" (click)="close.emit()" class="px-4 py-2 text-subtle hover:text-white transition-colors font-medium">Cancel</button>
            <button type="submit" [disabled]="isSubmitting" class="bg-primary hover:bg-primary/90 text-white rounded-lg px-6 py-2 font-semibold transition-colors disabled:opacity-50">
              {{ isSubmitting ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CreateGoalModalComponent {
  @Output() close = new EventEmitter<void>();
  private goalService = inject(GoalService);

  isSubmitting = false;

  model = {
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
  };

  async onSubmit() {
    if (!this.model.name || this.model.targetAmount <= 0 || !this.model.deadline) return;
    
    this.isSubmitting = true;
    try {
      const payload = { ...this.model, deadline: new Date(this.model.deadline).toISOString() };
      await this.goalService.createGoal(payload);
      this.close.emit();
    } catch (e) {
      console.error(e);
    } finally {
      this.isSubmitting = false;
    }
  }
}
