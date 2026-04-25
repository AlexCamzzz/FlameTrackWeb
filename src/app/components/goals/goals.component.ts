import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { GoalService } from '../../services/goal.service';
import { CreateGoalModalComponent } from './create-goal-modal.component';
import { DepositGoalModalComponent } from './deposit-goal-modal.component';
import { GoalDto } from '../../models/transaction.dto';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DecimalPipe, CreateGoalModalComponent, DepositGoalModalComponent],
  template: `
    <div class="p-6 space-y-8 animate-fade-in">
      <header class="flex justify-between items-center">
        <h1 class="text-3xl font-bold">Financial Goals</h1>
        <button (click)="isModalOpen = true" class="bg-primary hover:bg-primary/90 text-white rounded-lg px-4 py-2 font-semibold transition-colors flex items-center space-x-2 shadow-lg shadow-primary/20">
          <span>Add Goal</span>
        </button>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div *ngFor="let goal of goalService.goals()" class="card transition-all hover:border-white/10 group">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-semibold text-lg group-hover:text-primary transition-colors">{{ goal.name }}</h3>
            <span class="bg-income/20 text-income px-3 py-1 rounded-full text-sm font-medium">
              {{ (goal.currentAmount / goal.targetAmount) * 100 | number:'1.0-0' }}%
            </span>
          </div>
          <div class="w-full bg-white/10 h-3 rounded-full overflow-hidden mb-4">
            <div class="h-full bg-gradient-to-r from-income to-emerald-400" [style.width.%]="(goal.currentAmount / goal.targetAmount) * 100"></div>
          </div>
          <div class="flex justify-between text-sm mb-4">
            <span class="text-subtle">Saved: <span class="text-white font-medium">{{ goal.currentAmount | currency:'MXN ' }}</span></span>
            <span class="text-subtle">Target: <span class="text-white font-medium">{{ goal.targetAmount | currency:'MXN ' }}</span></span>
          </div>
          <div class="pt-4 border-t border-border/20 flex justify-end">
             <button (click)="openDeposit(goal)" class="text-income hover:text-white bg-income/10 hover:bg-income focus:ring-2 focus:ring-income px-4 py-2 rounded-lg font-medium transition-all text-sm flex items-center">
               <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
               </svg>
               Deposit
             </button>
          </div>
        </div>
        <div *ngIf="goalService.goals().length === 0" class="col-span-full p-8 text-center text-subtle card">
          No financial goals have been set yet.
        </div>
      </div>
    </div>
    
    <app-create-goal-modal *ngIf="isModalOpen" (close)="isModalOpen = false"></app-create-goal-modal>
    <app-deposit-goal-modal *ngIf="depositGoalTarget" [goal]="depositGoalTarget" (close)="depositGoalTarget = null"></app-deposit-goal-modal>
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