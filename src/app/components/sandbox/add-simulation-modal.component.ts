import { Component, EventEmitter, Output, inject, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { CreateSandboxMovementRequest } from '../../models/sandbox';
import { TransactionTypeDto } from '../../models/transaction.dto';

@Component({
  selector: 'app-add-simulation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  providers: [provideIcons({ heroXMark })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" (click)="close.emit()">
      <div class="card !p-0 w-full max-w-md overflow-hidden animate-slide-up border-border" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="p-8 border-b border-border flex justify-between items-center bg-foreground/[0.02]">
          <div class="space-y-1">
            <h2 class="text-xl font-black text-foreground uppercase tracking-tight italic">Add Simulation</h2>
            <p class="text-[10px] font-black text-subtle uppercase tracking-[0.2em]">Temporal Event Injection</p>
          </div>
          <button (click)="close.emit()" class="w-10 h-10 bg-foreground/[0.05] rounded-2xl hover:bg-foreground/[0.1] text-foreground transition-all flex items-center justify-center border border-border">
            <ng-icon name="heroXMark" size="1.2rem"></ng-icon>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" class="p-8 space-y-6">
          <!-- Description -->
          <div class="flex flex-col space-y-2">
            <label class="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Description</label>
            <input name="description" [(ngModel)]="model.description" class="input-premium w-full shadow-inner" placeholder="E.g. Bonus, Tax Return..." required>
          </div>

          <!-- Amount & Type -->
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col space-y-2">
              <label class="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Amount</label>
              <input name="amount" type="number" [(ngModel)]="model.amount" class="input-premium w-full text-xl font-black text-center shadow-inner" required>
            </div>
            <div class="flex flex-col space-y-2">
              <label class="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Type</label>
              <select name="type" [(ngModel)]="model.type" class="input-premium w-full shadow-inner appearance-none cursor-pointer">
                <option [ngValue]="0">Income</option>
                <option [ngValue]="1">Expense</option>
              </select>
            </div>
          </div>

          <!-- Account Selection -->
          <div class="flex flex-col space-y-2">
            <label class="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Account Snapshot</label>
            <select name="accountId" [(ngModel)]="model.accountId" class="input-premium w-full shadow-inner appearance-none cursor-pointer" required>
              <option *ngFor="let acc of accounts" [value]="acc.id">{{ acc.name }}</option>
            </select>
          </div>

          <!-- Inclusion Toggle -->
          <div class="flex items-center justify-between p-5 bg-foreground/[0.03] border border-border rounded-2xl">
            <div class="space-y-0.5">
              <p class="text-xs font-black uppercase tracking-tight">Active for Projection</p>
              <p class="text-[10px] font-bold text-subtle">Include this movement in total balance</p>
            </div>
            <input name="isInclusion" type="checkbox" [(ngModel)]="model.isIncludedInBalance" class="w-6 h-6 rounded-lg border-2 border-border accent-primary cursor-pointer">
          </div>

          <!-- Actions -->
          <div class="pt-4 flex gap-4">
            <button type="button" (click)="close.emit()" class="btn-secondary flex-1 py-5">Cancel</button>
            <button type="submit" [disabled]="!model.description || model.amount <= 0 || !model.accountId" 
                    class="btn-premium flex-1 py-5 shadow-lg shadow-primary/20">
              Project Event
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AddSimulationModalComponent {
  @Input() accounts: { id: string, name: string }[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<CreateSandboxMovementRequest>();

  model: CreateSandboxMovementRequest = {
    categoryId: 'sandbox-v1',
    description: '',
    amount: 0,
    type: TransactionTypeDto.Income,
    isIncludedInBalance: true,
    accountId: ''
  };

  onSubmit() {
    if (this.model.description && this.model.amount > 0 && this.model.accountId) {
      this.submit.emit(this.model);
    }
  }
}
