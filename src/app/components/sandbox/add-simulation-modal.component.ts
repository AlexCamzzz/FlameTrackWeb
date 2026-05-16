import { Component, EventEmitter, Output, inject, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { CreateSandboxMovementRequest } from '../../models/sandbox';
import { TransactionTypeDto, CategoryDto } from '../../models/transaction.dto';
import { CategoryPickerModalComponent } from '../transactions/category-picker-modal.component';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-add-simulation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent, CategoryPickerModalComponent],
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
          <!-- Type Selector -->
          <div class="flex p-1.5 bg-background border border-border rounded-2xl shadow-inner">
            <button type="button" (click)="model.type = 0" 
              [class.bg-income]="model.type === 0" [class.text-white]="model.type === 0" [class.shadow-md]="model.type === 0"
              [class.text-subtle]="model.type !== 0"
              class="flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest">Inflow</button>
            <button type="button" (click)="model.type = 1"
              [class.bg-expense]="model.type === 1" [class.text-white]="model.type === 1" [class.shadow-md]="model.type === 1"
              [class.text-subtle]="model.type !== 1"
              class="flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest">Outflow</button>
          </div>

          <div class="space-y-5">
            <!-- Description -->
            <div class="flex flex-col space-y-2">
              <label class="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Description</label>
              <input name="description" [(ngModel)]="model.description" class="input-premium w-full shadow-inner" placeholder="E.g. Bonus, Tax Return..." required>
            </div>

            <!-- Amount & Category -->
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col space-y-2">
                <label class="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Amount</label>
                <input name="amount" type="number" [(ngModel)]="model.amount" class="input-premium w-full text-xl font-black text-center shadow-inner" required>
              </div>
              <div class="flex flex-col space-y-2">
                <label class="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Category</label>
                <button type="button" (click)="isPickerOpen = true" 
                  class="w-full flex items-center justify-between bg-foreground/[0.03] border border-border rounded-xl px-4 py-4 text-left transition-all hover:bg-foreground/[0.05] shadow-inner group">
                  <div class="flex items-center space-x-2 min-w-0">
                    @if (model.categoryId) {
                      <div class="w-2 h-2 rounded-full flex-shrink-0 shadow-sm" [style.backgroundColor]="categoryService.getCategoryColor(model.categoryId)"></div>
                      <span class="font-bold text-foreground text-[11px] truncate uppercase tracking-tighter">{{ categoryService.getCategoryName(model.categoryId) }}</span>
                    } @else {
                      <span class="text-subtle font-bold italic text-[11px]">Select...</span>
                    }
                  </div>
                </button>
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
          </div>

          <!-- Actions -->
          <div class="pt-4 flex gap-4">
            <button type="button" (click)="close.emit()" class="btn-secondary flex-1 py-5">Cancel</button>
            <button type="submit" [disabled]="!model.description || model.amount <= 0 || !model.accountId || !model.categoryId" 
                    class="btn-premium flex-1 py-5 shadow-lg shadow-primary/20">
              Project Event
            </button>
          </div>
        </form>
      </div>
    </div>

    @if (isPickerOpen) {
       <app-category-picker-modal
         (selectCategory)="onCategorySelect($event)" 
         (close)="isPickerOpen = false">
       </app-category-picker-modal>
    }
  `
})
export class AddSimulationModalComponent implements OnInit {
  @Input() accounts: { id: string, name: string }[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<CreateSandboxMovementRequest>();

  protected categoryService = inject(CategoryService);
  isPickerOpen = false;

  model: CreateSandboxMovementRequest = {
    categoryId: '',
    description: '',
    amount: 0,
    type: TransactionTypeDto.Income,
    isIncludedInBalance: true,
    accountId: ''
  };

  ngOnInit() {
    this.categoryService.loadCategories();
  }

  onCategorySelect(cat: CategoryDto) {
    this.model.categoryId = cat.id;
  }

  onSubmit() {
    if (this.model.description && this.model.amount > 0 && this.model.accountId && this.model.categoryId) {
      this.submit.emit(this.model);
    }
  }
}
