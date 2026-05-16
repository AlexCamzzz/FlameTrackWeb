import { Component, inject, signal, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SandboxService } from '../../services/sandbox.service';
import { AccountService } from '../../services/account.service';
import { CategoryService } from '../../services/category.service';
import { SandboxDto, CreateSandboxMovementRequest } from '../../models/sandbox';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroArrowLeft, heroPlus, heroTrash, heroScale, heroBanknotes, heroArrowPath, heroCheck, heroEyeSlash } from '@ng-icons/heroicons/outline';
import { TransactionTypeDto } from '../../models/transaction.dto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sandbox-dimension',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent, FormsModule],
  providers: [provideIcons({ heroArrowLeft, heroPlus, heroTrash, heroScale, heroBanknotes, heroArrowPath, heroCheck, heroEyeSlash })],
  template: `
    <div class="space-y-8 animate-fade-in" *ngIf="sandbox() as data">
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface/50 p-8 rounded-[2rem] border border-border backdrop-blur-xl">
        <div class="flex items-center space-x-6">
          <button routerLink="/pocket-dimensions" class="w-12 h-12 rounded-2xl bg-foreground/[0.05] flex items-center justify-center hover:bg-foreground/[0.1] transition-all">
            <ng-icon name="heroArrowLeft" size="1.25rem"></ng-icon>
          </button>
          <div class="space-y-1">
            <div class="flex items-center space-x-2 text-primary">
              <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span class="text-[10px] font-black uppercase tracking-[0.2em]">Active Simulation</span>
            </div>
            <h1 class="text-4xl font-black tracking-tighter">{{ getMonthName(data.month) }} {{ data.year }}</h1>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button (click)="resetDimension()" class="px-6 py-3 rounded-2xl bg-expense/10 text-expense border border-expense/20 text-xs font-black uppercase tracking-widest hover:bg-expense hover:text-white transition-all flex items-center space-x-2">
            <ng-icon name="heroArrowPath"></ng-icon>
            <span>Reset Universe</span>
          </button>
          <button (click)="showAddModal.set(true)" class="px-6 py-3 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center space-x-2">
            <ng-icon name="heroPlus"></ng-icon>
            <span>Add Virtual Movement</span>
          </button>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Stats Panel -->
        <div class="lg:col-span-1 space-y-6">
          <div class="p-8 rounded-[2.5rem] bg-surface border border-border space-y-6">
            <div class="space-y-2">
              <span class="text-[10px] font-black text-subtle uppercase tracking-widest">Initial Snapshot</span>
              <div class="text-3xl font-black tracking-tighter text-foreground">
                {{ calculateInitialTotal(data) | currency:'MXN' }}
              </div>
            </div>
            
            <div class="h-px bg-border"></div>
            
            <div class="space-y-2">
              <span class="text-[10px] font-black text-primary uppercase tracking-widest">Projected End Balance</span>
              <div class="text-5xl font-black tracking-tighter text-primary">
                {{ data.projectedTotalBalance | currency:'MXN' }}
              </div>
            </div>
          </div>

          <div class="p-8 rounded-[2.5rem] bg-surface border border-border">
            <h3 class="text-xs font-black uppercase tracking-widest mb-6 flex items-center space-x-2 text-subtle">
              <ng-icon name="heroScale"></ng-icon>
              <span>Account Snapshots</span>
            </h3>
            <div class="space-y-4">
              <div *ngFor="let accId of objectKeys(data.initialBalances)" class="flex justify-between items-center p-4 rounded-2xl bg-foreground/[0.02] border border-border">
                <span class="text-[11px] font-bold text-subtle">{{ getAccountName(accId) }}</span>
                <span class="text-sm font-black text-foreground">{{ calculateAccountFinal(accId, data) | currency:'MXN' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Movements List -->
        <div class="lg:col-span-2 space-y-6">
           <div class="flex items-center justify-between px-2">
              <h2 class="text-xl font-black tracking-tight flex items-center space-x-2">
                <ng-icon name="heroBanknotes" class="text-primary"></ng-icon>
                <span>Virtual Movements</span>
              </h2>
              <span class="text-[10px] font-black text-subtle uppercase tracking-widest">{{ data.movements.length }} Registered</span>
           </div>

           <div class="space-y-3">
              <div *ngIf="data.movements.length === 0" class="p-20 text-center border-2 border-dashed border-border rounded-[3rem] space-y-4">
                 <div class="w-16 h-16 bg-surface border border-border rounded-2xl mx-auto flex items-center justify-center text-subtle">
                    <ng-icon name="heroPlus" size="2rem"></ng-icon>
                 </div>
                 <p class="text-subtle text-xs font-black uppercase tracking-widest">No virtual events in this timeline</p>
              </div>

              <div *ngFor="let m of data.movements" class="group flex items-center justify-between p-6 bg-surface border border-border rounded-3xl hover:border-primary/30 transition-all">
                <div class="flex items-center space-x-6">
                  <div [class]="m.type === 0 ? 'bg-income/10 text-income' : 'bg-expense/10 text-expense'" class="w-12 h-12 rounded-2xl flex items-center justify-center">
                    <ng-icon [name]="m.type === 0 ? 'heroPlus' : 'heroTrash'"></ng-icon>
                  </div>
                  <div class="space-y-1">
                    <h4 class="text-sm font-black text-foreground uppercase tracking-tight">{{ m.description }}</h4>
                    <p class="text-[10px] font-bold text-subtle uppercase tracking-widest">{{ getCategoryName(m.categoryId) }} • {{ getAccountName(m.accountId) }}</p>
                  </div>
                </div>
                <div [class]="m.type === 0 ? 'text-income' : 'text-expense'" class="text-lg font-black tracking-tighter">
                  {{ m.type === 0 ? '+' : '-' }} {{ m.amount | currency:'MXN' }}
                </div>

                <div class="flex items-center space-x-2 ml-4">
                  <button (click)="toggleInclusion(m)" [class]="m.isIncludedInBalance ? 'bg-primary/10 text-primary border-primary/20' : 'bg-foreground/[0.05] text-subtle border-border'" class="w-10 h-10 rounded-xl border flex items-center justify-center transition-all hover:scale-110" [title]="m.isIncludedInBalance ? 'Included in Projection' : 'Excluded from Projection'">
                    <ng-icon [name]="m.isIncludedInBalance ? 'heroCheck' : 'heroEyeSlash'"></ng-icon>
                  </button>
                  <button (click)="deleteMovement(m.id!)" class="w-10 h-10 rounded-xl bg-expense/10 text-expense border border-expense/20 flex items-center justify-center hover:bg-expense hover:text-white transition-all hover:scale-110" title="Delete Movement">
                    <ng-icon name="heroTrash"></ng-icon>
                  </button>
                </div>
              </div>
           </div>
        </div>
      </div>

      <!-- Simple Add Modal Placeholder -->
      <div *ngIf="showAddModal()" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
        <div class="w-full max-w-md bg-surface border border-border rounded-[3rem] p-10 shadow-2xl space-y-8">
           <div class="space-y-2">
              <h2 class="text-3xl font-black tracking-tighter">Add Simulation</h2>
              <p class="text-subtle text-xs font-black uppercase tracking-widest">Inject a virtual event into this dimension</p>
           </div>

           <div class="space-y-4">
              <div class="space-y-1">
                <label class="text-[10px] font-black uppercase tracking-widest text-subtle">Description</label>
                <input [(ngModel)]="newMove.description" class="w-full bg-foreground/[0.03] border border-border rounded-2xl p-4 text-sm font-bold focus:border-primary outline-none transition-all" placeholder="E.g. Bonus, Tax Return...">
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-black uppercase tracking-widest text-subtle">Amount</label>
                  <input type="number" [(ngModel)]="newMove.amount" class="w-full bg-foreground/[0.03] border border-border rounded-2xl p-4 text-sm font-bold focus:border-primary outline-none">
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-black uppercase tracking-widest text-subtle">Type</label>
                  <select [(ngModel)]="newMove.type" class="w-full bg-foreground/[0.03] border border-border rounded-2xl p-4 text-sm font-bold focus:border-primary outline-none appearance-none">
                    <option [ngValue]="0">Income</option>
                    <option [ngValue]="1">Expense</option>
                  </select>
                </div>
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-black uppercase tracking-widest text-subtle">Account Snapshot</label>
                <select [(ngModel)]="newMove.accountId" class="w-full bg-foreground/[0.03] border border-border rounded-2xl p-4 text-sm font-bold focus:border-primary outline-none appearance-none">
                  <option *ngFor="let accId of objectKeys(data.initialBalances)" [value]="accId">{{ getAccountName(accId) }}</option>
                </select>
              </div>

              <div class="flex items-center justify-between p-4 bg-foreground/[0.03] border border-border rounded-2xl">
                <div class="space-y-0.5">
                  <p class="text-xs font-black uppercase tracking-tight">Active for Projection</p>
                  <p class="text-[10px] font-bold text-subtle">Include this movement in total balance</p>
                </div>
                <input type="checkbox" [(ngModel)]="newMove.isIncludedInBalance" class="w-6 h-6 rounded-lg border-2 border-border accent-primary cursor-pointer">
              </div>
           </div>

           <div class="flex gap-4">
              <button (click)="showAddModal.set(false)" class="flex-1 py-4 rounded-2xl border border-border text-xs font-black uppercase tracking-widest hover:bg-foreground/[0.05] transition-all">Cancel</button>
              <button (click)="submitMovement()" class="flex-1 py-4 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Project Event</button>
           </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class SandboxDimensionComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private sandboxService = inject(SandboxService);
  private accountService = inject(AccountService);
  private categoryService = inject(CategoryService);
  private renderer = inject(Renderer2);

  sandbox = signal<SandboxDto | null>(null);
  showAddModal = signal(false);

  newMove: CreateSandboxMovementRequest = {
    accountId: '',
    categoryId: '',
    description: '',
    amount: 0,
    type: TransactionTypeDto.Income,
    isIncludedInBalance: true
  };

  objectKeys = Object.keys;

  ngOnInit() {
    this.renderer.setAttribute(document.body, 'data-sandbox', 'active');
    this.route.params.subscribe(params => {
      this.loadSandbox(+params['year'], +params['month']);
    });
  }

  ngOnDestroy() {
    this.renderer.removeAttribute(document.body, 'data-sandbox');
  }

  loadSandbox(year: number, month: number) {
    this.sandboxService.getOrCreateSandbox(year, month).subscribe(res => {
      this.sandbox.set(res);
      if (res.initialBalances && this.objectKeys(res.initialBalances).length > 0) {
        this.newMove.accountId = this.objectKeys(res.initialBalances)[0];
      }
    });
  }

  submitMovement() {
    const current = this.sandbox();
    if (!current) return;

    this.sandboxService.addMovement(current.id, this.newMove).subscribe(() => {
      this.loadSandbox(current.year, current.month);
      this.showAddModal.set(false);
      this.newMove.description = '';
      this.newMove.amount = 0;
      this.newMove.isIncludedInBalance = true;
    });
  }

  toggleInclusion(m: any) {
    const current = this.sandbox();
    if (!current) return;
    
    this.sandboxService.toggleMovementInclusion(m.id, !m.isIncludedInBalance).subscribe(() => {
      this.loadSandbox(current.year, current.month);
    });
  }

  deleteMovement(id: string) {
    const current = this.sandbox();
    if (!current || !confirm('Delete this virtual movement?')) return;

    this.sandboxService.deleteMovement(id).subscribe(() => {
      this.loadSandbox(current.year, current.month);
    });
  }

  resetDimension() {
    const current = this.sandbox();
    if (!current || !confirm('Are you sure you want to collapse this dimension? All virtual data will be lost.')) return;

    this.sandboxService.resetSandbox(current.id).subscribe(() => {
      this.loadSandbox(current.year, current.month);
    });
  }

  calculateInitialTotal(data: SandboxDto): number {
    return Object.values(data.initialBalances).reduce((a, b) => a + b, 0);
  }

  calculateAccountFinal(accId: string, data: SandboxDto): number {
    let balance = data.initialBalances[accId] || 0;
    data.movements.filter(m => m.accountId === accId && m.isIncludedInBalance).forEach(m => {
      if (m.type === TransactionTypeDto.Income) balance += m.amount;
      else balance -= m.amount;
    });
    return balance;
  }

  getAccountName(id: string): string {
    return this.accountService.accounts().find(a => a.id === id)?.name || 'Unknown Vault';
  }

  getCategoryName(id: string): string {
    return this.categoryService.categories().find(c => c.id === id)?.name || 'General';
  }

  getMonthName(m: number): string {
    return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m - 1];
  }
}
