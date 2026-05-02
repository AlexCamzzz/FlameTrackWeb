import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { ThemeService } from '../../services/theme.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroRocketLaunch, heroCreditCard, heroCheckBadge, heroSparkles, heroArrowRight } from '@ng-icons/heroicons/outline';
import { AccountType } from '../../models/transaction.dto';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  providers: [provideIcons({ heroRocketLaunch, heroCreditCard, heroCheckBadge, heroSparkles, heroArrowRight })],
  template: `
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-xl animate-fade-in p-4 md:p-10">
      <div class="card w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row gap-0 md:gap-10 !p-0 shadow-2xl border-primary/20 animate-slide-up no-scrollbar">
        
        <!-- Left: Visual/Intro -->
        <div class="w-full md:w-2/5 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent p-8 md:p-12 flex flex-col justify-between border-r border-border min-h-[300px] md:min-h-auto">
          <div>
            <div class="w-16 h-16 bg-primary/20 rounded-3xl flex items-center justify-center text-primary mb-8 shadow-inner">
               <ng-icon name="heroRocketLaunch" size="2rem"></ng-icon>
            </div>
            <h1 class="text-3xl md:text-4xl font-black text-foreground uppercase tracking-tighter leading-none mb-4">
              Ignite your <span class="text-primary">Wealth</span>
            </h1>
            <p class="text-subtle text-xs font-black uppercase tracking-widest leading-relaxed opacity-70">
              Welcome to FlameTrack. Let's map your financial territory in 60 seconds.
            </p>
          </div>

          <div class="space-y-4 hidden md:block">
            <div class="flex items-center space-x-3 text-subtle">
               <ng-icon name="heroCheckBadge" class="text-primary"></ng-icon>
               <span class="text-[10px] font-black uppercase tracking-widest">Zero-Trust Privacy</span>
            </div>
            <div class="flex items-center space-x-3 text-subtle">
               <ng-icon name="heroSparkles" class="text-primary"></ng-icon>
               <span class="text-[10px] font-black uppercase tracking-widest">AI Ready Architecture</span>
            </div>
          </div>
        </div>

        <!-- Right: Stepper Content -->
        <div class="w-full md:w-3/5 p-8 md:p-12">
          @if (step() === 1) {
            <div class="space-y-8 animate-fade-in">
              <div class="space-y-2">
                <span class="px-3 py-1 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-[0.3em] rounded-full">Phase 01 // Genesis</span>
                <h2 class="text-2xl font-black text-foreground uppercase tracking-tight">Create your first Vault</h2>
                <p class="text-subtle text-xs font-bold leading-relaxed">Every legend starts with a single coin. Tell us about your primary bank account or cash wallet.</p>
              </div>

              <div class="space-y-6">
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Account Label</label>
                  <input type="text" [(ngModel)]="accountName" placeholder="e.g. Santander Nomina" 
                    class="input-premium w-full !py-4 text-sm shadow-inner">
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Initial Balance</label>
                    <input type="number" [(ngModel)]="balance" placeholder="0.00" 
                      class="input-premium w-full !py-4 text-sm shadow-inner">
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Currency</label>
                    <div class="input-premium w-full !py-4 text-sm shadow-inner opacity-50 cursor-not-allowed flex items-center">MXN</div>
                  </div>
                </div>

                <div class="space-y-4">
                  <label class="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Account Identity</label>
                  <div class="flex flex-wrap gap-3">
                    <button *ngFor="let color of colors" (click)="selectedColor = color"
                      [style.backgroundColor]="color"
                      [class.ring-4]="selectedColor === color"
                      class="w-10 h-10 rounded-xl ring-primary/40 transition-all hover:scale-110 shadow-lg border border-white/10"></button>
                  </div>
                </div>
              </div>

              <button (click)="createFirstAccount()" [disabled]="!accountName || isLoading()" 
                class="btn-premium w-full group !py-5">
                <span>{{ isLoading() ? 'Syncing...' : 'Initialize Vault' }}</span>
                <ng-icon name="heroArrowRight" class="ml-2 group-hover:translate-x-1 transition-transform"></ng-icon>
              </button>
            </div>
          } @else if (step() === 2) {
            <div class="space-y-8 animate-fade-in text-center md:text-left py-10 md:py-20">
              <div class="w-20 h-20 bg-income/20 rounded-[2.5rem] flex items-center justify-center text-income mx-auto md:mx-0 shadow-inner animate-bounce">
                <ng-icon name="heroCheckBadge" size="3rem"></ng-icon>
              </div>
              <div class="space-y-3">
                <h2 class="text-3xl font-black text-foreground uppercase tracking-tight">System Armed.</h2>
                <p class="text-subtle text-sm font-bold max-w-sm">Your first account is live. You are now ready to track every cent and master your wealth.</p>
              </div>
              <button (click)="finish()" class="btn-premium w-full md:w-auto px-12 !py-5">
                Enter Dashboard
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class OnboardingComponent {
  private accountService = inject(AccountService);
  private themeService = inject(ThemeService);

  @Output() completed = new EventEmitter<void>();

  step = signal(1);
  isLoading = signal(false);

  accountName = '';
  balance: number | null = null;
  selectedColor = '#FF5722';

  colors = ['#FF5722', '#4CAF50', '#2196F3', '#9C27B0', '#FFEB3B', '#00BCD4', '#E91E63', '#607D8B'];

  async createFirstAccount() {
    this.isLoading.set(true);
    try {
      await this.accountService.createAccount({
        name: this.accountName,
        type: AccountType.Debit,
        initialBalance: this.balance || 0,
        color: this.selectedColor,
        currency: 'MXN'
      });
      this.step.set(2);
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  finish() {
    this.completed.emit();
  }
}