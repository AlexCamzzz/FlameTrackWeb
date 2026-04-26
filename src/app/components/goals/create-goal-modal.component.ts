import { Component, EventEmitter, Output, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoalService } from '../../services/goal.service';
import { TutorialService } from '../../services/tutorial.service';
import { CreateGoalRequestDto } from '../../models/transaction.dto';

@Component({
  selector: 'app-create-goal-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in px-4" (click)="close.emit()">
      <div class="card !p-0 w-full max-w-md overflow-hidden animate-slide-up border-border shadow-2xl" (click)="$event.stopPropagation()">
        
        <div class="p-8 border-b border-border flex justify-between items-center bg-foreground/[0.02]">
          <div class="flex items-center space-x-3">
            <h2 class="text-xl font-black text-foreground uppercase tracking-tight">Establish Goal</h2>
            <button (click)="tutorial.start('modal-goal')" class="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all text-[10px] font-black border border-primary/20">?</button>
          </div>
          <button (click)="close.emit()" class="w-10 h-10 bg-foreground/[0.05] rounded-2xl hover:bg-foreground/[0.1] text-foreground transition-all flex items-center justify-center border border-border">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" class="p-8 space-y-6">
          <div>
            <label class="block text-[10px] font-black text-subtle uppercase tracking-widest mb-2 ml-1">Target Name</label>
            <input type="text" name="name" [(ngModel)]="model.name" required placeholder="E.g. Reserve Capital"
              data-tutorial="input-goal-name"
              class="input-premium w-full shadow-inner">
          </div>

          <div>
            <label class="block text-[10px] font-black text-subtle uppercase tracking-widest mb-2 ml-1">Target Amount</label>
            <input type="number" name="targetAmount" [(ngModel)]="model.targetAmount" required min="1"
              data-tutorial="input-target-amount"
              class="input-premium w-full text-2xl font-black text-center tracking-tighter shadow-inner">
          </div>

          <div class="pt-6">
            <button type="submit" [disabled]="!model.name || model.targetAmount <= 0 || isSaving" class="btn-premium w-full py-5 shadow-lg shadow-primary/10">
              {{ isSaving ? 'Establishing...' : 'Confirm Goal' }}
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
  protected tutorial = inject(TutorialService);

  isSaving = false;
  model = {
    name: '',
    targetAmount: 0,
    deadline: new Date().toISOString()
  };

  async onSubmit() {
    if (!this.model.name || this.model.targetAmount <= 0) return;
    this.isSaving = true;
    try {
      await this.goalService.createGoal(this.model);
      this.close.emit();
    } finally {
      this.isSaving = false;
    }
  }
}
