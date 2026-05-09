import { Component, EventEmitter, Output, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DebtService } from '../../services/debt.service';
import { CreateDebtRequestDto, DebtType } from '../../models/transaction.dto';

@Component({
  selector: 'app-create-debt-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" (click)="close.emit()">
      <div class="card !p-0 w-full max-w-md overflow-hidden animate-slide-up border-border" (click)="$event.stopPropagation()">
        
        <div class="p-8 border-b border-border flex justify-between items-center bg-foreground/[0.02]">
          <h2 class="text-xl font-black text-foreground uppercase tracking-tight">New Obligation</h2>
          <button (click)="close.emit()" class="w-10 h-10 bg-foreground/[0.05] rounded-2xl hover:bg-foreground/[0.1] text-foreground transition-all flex items-center justify-center border border-border">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" class="p-8 space-y-6">
          <div class="flex flex-col space-y-2">
            <label class="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Entity / Person</label>
            <input type="text" [(ngModel)]="model.creditorDebtor" name="creditorDebtor" class="input-premium w-full" placeholder="Who?" required>
          </div>

          <div class="flex flex-col space-y-2">
            <label class="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Description</label>
            <input type="text" [(ngModel)]="model.description" name="description" class="input-premium w-full" placeholder="What for?">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col space-y-2">
              <label class="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Amount</label>
              <input type="number" [(ngModel)]="model.totalAmount" name="totalAmount" class="input-premium w-full" placeholder="0.00" required>
            </div>
            <div class="flex flex-col space-y-2">
              <label class="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Due Date</label>
              <input type="date" [(ngModel)]="model.dueDate" name="dueDate" class="input-premium w-full" required style="color-scheme: dark;">
            </div>
          </div>

          <div class="flex flex-col space-y-2">
            <label class="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Debt Direction</label>
            <div class="flex bg-foreground/[0.03] p-1.5 rounded-2xl border border-border shadow-inner">
              <button type="button" (click)="model.type = 1" 
                [class.bg-expense]="model.type === 1" [class.text-white]="model.type === 1" [class.shadow-md]="model.type === 1"
                [class.text-subtle]="model.type !== 1"
                class="flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">I Owe</button>
              <button type="button" (click)="model.type = 0" 
                [class.bg-income]="model.type === 0" [class.text-white]="model.type === 0" [class.shadow-md]="model.type === 0"
                [class.text-subtle]="model.type !== 0"
                class="flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Owed To Me</button>
            </div>
          </div>

          <div class="pt-6">
            <button type="submit" [disabled]="isSubmitting || !model.creditorDebtor || model.totalAmount <= 0" 
               class="btn-premium w-full py-5 shadow-lg shadow-primary/10">
              {{ isSubmitting ? 'Syncing...' : 'Create Obligation' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CreateDebtModalComponent {
  @Output() close = new EventEmitter<void>();
  
  private debtService = inject(DebtService);
  isSubmitting = false;

  model: CreateDebtRequestDto = {
    creditorDebtor: '',
    description: '',
    totalAmount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    type: DebtType.IOwe
  };

  async onSubmit() {
    if (!this.model.creditorDebtor || this.model.totalAmount <= 0) return;
    
    this.isSubmitting = true;
    try {
      await this.debtService.createDebt(this.model);
      this.close.emit();
    } catch (e) {
      console.error(e);
    } finally {
      this.isSubmitting = false;
    }
  }
}
