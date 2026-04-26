import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { GoalService } from '../../services/goal.service';
import { CreateGoalModalComponent } from './create-goal-modal.component';
import { DepositGoalModalComponent } from './deposit-goal-modal.component';
import { GoalDto } from '../../models/transaction.dto';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DecimalPipe, CreateGoalModalComponent, DepositGoalModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[1400px] mx-auto space-y-10 animate-fade-in pb-12">
      <header class="flex justify-between items-end border-b border-border pb-8">
        <div>
          <h1 class="text-2xl font-black text-foreground uppercase tracking-widest">Financial Goals</h1>
          <div class="h-1 w-8 bg-primary mt-2"></div>
        </div>
        <button (click)="isModalOpen = true" data-tutorial="btn-new-goal" class="btn-premium flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" /></svg>
          <span>Establish Goal</span>
        </button>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (goal of goalService.goals(); track goal.id) {
          <div class="card group transition-all border-border hover:border-primary/30 flex flex-col justify-between">
            <div class="space-y-8">
              <div class="flex justify-between items-start">
                 <h3 class="text-lg font-black text-foreground uppercase tracking-widest opacity-90 group-hover:text-primary transition-colors">{{ goal.name }}</h3>
                 <span class="text-[10px] font-black text-income bg-income/10 border border-income/20 px-2.5 py-1 rounded-lg tracking-widest">
                   {{ (goal.currentAmount / goal.targetAmount) * 100 | number:'1.0-0' }}%
                 </span>
              </div>

              <div class="space-y-4">
                 <div class="w-full bg-foreground/[0.05] h-2 rounded-full overflow-hidden shadow-inner border border-border">
                    <div class="h-full bg-income opacity-90 transition-all duration-1000" [style.width.%]="(goal.currentAmount / goal.targetAmount) * 100"></div>
                 </div>
                 
                 <div class="flex justify-between items-end px-1">
                    <div class="space-y-1">
                       <p class="text-[9px] font-black text-subtle uppercase tracking-widest">Accumulated</p>
                       <p class="text-xl font-black text-foreground tracking-tighter">{{ goal.currentAmount | currency:'MXN ':'symbol':'1.0-0' }}</p>
                    </div>
                    <div class="text-right space-y-1">
                       <p class="text-[9px] font-black text-subtle uppercase tracking-widest">Target</p>
                       <p class="text-sm font-black text-foreground/40 tracking-tight">{{ goal.targetAmount | currency:'MXN ':'symbol':'1.0-0' }}</p>
                    </div>
                 </div>
              </div>
            </div>

            <div class="mt-10 pt-6 border-t border-border flex justify-end">
               <button (click)="openDeposit(goal)" class="btn-secondary flex items-center space-x-2">
                 <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-income" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                 <span>Allocation</span>
               </button>
            </div>
          </div>
        } @empty {
          <div class="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-4 bg-foreground/[0.01] rounded-[3rem] border border-dashed border-border">
             <div class="text-subtle opacity-20">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             </div>
             <p class="text-subtle text-[11px] font-black uppercase tracking-[0.3em]">No targets established</p>
          </div>
        }
      </div>
    </div>
    
    @if (isModalOpen) {
       <app-create-goal-modal (close)="isModalOpen = false"></app-create-goal-modal>
    }
    @if (depositGoalTarget) {
       <app-deposit-goal-modal [goal]="depositGoalTarget" (close)="depositGoalTarget = null"></app-deposit-goal-modal>
    }
  `
})
export class GoalsComponent implements OnInit {
  protected goalService = inject(GoalService);
  isModalOpen = false;
  depositGoalTarget: GoalDto | null = null;

  ngOnInit() {
    this.goalService.loadGoals();
  }

  openDeposit(goal: GoalDto) {
    this.depositGoalTarget = goal;
  }
}
