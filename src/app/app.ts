import { Component, inject, HostListener, ElementRef, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { TutorialService } from './services/tutorial.service';
import { BudgetService } from './services/budget.service';
import { AccountService } from './services/account.service';
import { TransactionService } from './services/transaction.service';
import { filter } from 'rxjs';
import { TermsModalComponent } from './components/legal/terms-modal.component';
import { TutorialOverlayComponent } from './components/tutorial/tutorial-overlay.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { 
  heroUser, heroAdjustmentsHorizontal, heroTag, heroShieldCheck, 
  heroArrowRightOnRectangle, heroBars3, heroXMark, heroCog8Tooth, 
  heroLifebuoy, heroEye, heroEyeSlash, heroHome, heroCreditCard, 
  heroArrowsRightLeft, heroChartPie, heroTrophy 
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, TermsModalComponent, TutorialOverlayComponent, NgIconComponent],
  providers: [provideIcons({ 
    heroUser, heroAdjustmentsHorizontal, heroTag, heroShieldCheck, 
    heroArrowRightOnRectangle, heroBars3, heroXMark, heroCog8Tooth, 
    heroLifebuoy, heroEye, heroEyeSlash, heroHome, heroCreditCard, 
    heroArrowsRightLeft, heroChartPie, heroTrophy 
  })],
  template: `
    <app-tutorial-overlay />

    <!-- Help FAB -->
    <button *ngIf="authService.isAuthenticated() && tutorialService.helpButtonVisible() && !tutorialService.isActive()"
      (click)="tutorialService.start()"
      data-tutorial="help-fab"
      class="fixed bottom-24 md:bottom-6 right-6 w-12 h-12 md:w-14 md:h-14 bg-primary text-white rounded-full shadow-2xl z-[60] flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group">
      <ng-icon name="heroLifebuoy" class="text-xl md:text-2xl group-hover:rotate-12 transition-transform"></ng-icon>
    </button>

    <ng-container *ngIf="authService.isAuthenticated(); else unauthLayout">
      <div class="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300 overflow-x-hidden">
        
        <app-terms-modal *ngIf="authService.currentUser() && !authService.currentUser()?.hasAcceptedTerms"></app-terms-modal>
        
        <header class="h-16 md:h-20 bg-surface/80 backdrop-blur-2xl border-b border-border flex items-center justify-between px-4 md:px-10 sticky top-0 z-50 transition-colors">
          <div class="flex items-center space-x-3 md:space-x-4">
            <a routerLink="/" class="flex items-center space-x-2 md:space-x-3 hover:opacity-80 transition-opacity cursor-pointer">
              <img [src]="themeService.currentLogo()" alt="FlameTrack" class="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-2xl">
              <span class="text-lg md:text-2xl font-black tracking-tighter text-foreground hidden xs:block">FlameTrack</span>
            </a>
          </div>

          <nav class="hidden md:flex items-center bg-foreground/[0.03] p-1 rounded-2xl border border-border shadow-sm">
            <a *ngFor="let link of navLinks" [routerLink]="link.path" routerLinkActive="bg-primary text-white shadow-lg shadow-primary/20" [routerLinkActiveOptions]="{exact: link.path === '/'}" 
               [attr.data-tutorial]="
                 link.path === '/accounts' ? 'nav-accounts-desktop' : 
                 link.path === '/transactions' ? 'nav-ledger-desktop' : 
                 link.path === '/budgets' ? 'nav-budgets-desktop' : 
                 link.path === '/goals' ? 'nav-goals-desktop' : null"
               class="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 text-subtle hover:text-foreground">
              {{ link.label }}
            </a>
          </nav>

          <div class="flex items-center space-x-2 md:space-x-4 relative settings-container" *ngIf="authService.currentUser() as user">
            <button (click)="themeService.togglePrivacyMode()" 
              [class.text-primary]="themeService.isPrivacyModeActive()"
              [class.text-subtle]="!themeService.isPrivacyModeActive()"
              class="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-foreground/[0.05] hover:bg-foreground/[0.08] transition-all flex items-center justify-center border border-border shadow-sm group">
              <ng-icon [name]="themeService.isPrivacyModeActive() ? 'heroEyeSlash' : 'heroEye'" class="text-[1.2rem] md:text-[1.3rem]"></ng-icon>
            </button>

            <div class="hidden sm:flex items-center space-x-3 px-3 py-1.5 bg-foreground/[0.03] border border-border rounded-2xl mr-1">
               <div class="w-7 h-7 rounded-lg overflow-hidden border border-border shadow-inner bg-foreground/[0.05] flex items-center justify-center">
                  <img *ngIf="user.avatar" [src]="user.avatar" class="w-full h-full object-cover">
                  <span *ngIf="!user.avatar" class="text-[10px] font-black text-subtle uppercase">{{ user.name.substring(0, 1) }}</span>
               </div>
               <span class="text-[9px] font-black text-foreground uppercase tracking-widest hidden lg:block">{{ user.nickname || user.name }}</span>
            </div>

            <button (click)="toggleDropdown($event)" 
              [class.bg-primary]="isSettingsActive()" [class.text-white]="isSettingsActive()"
              [class.bg-foreground/[0.05]]="!isSettingsActive()" [class.text-subtle]="!isSettingsActive()"
              class="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl hover:bg-foreground/[0.08] hover:text-foreground transition-all flex items-center justify-center border border-border shadow-sm group">
              <ng-icon name="heroCog8Tooth" class="text-[1.25rem] md:text-[1.5rem] transition-transform group-hover:rotate-45"></ng-icon>
            </button>

            <div *ngIf="isDropdownOpen" class="absolute top-[calc(100%+12px)] right-0 w-64 bg-surface border border-border rounded-[2rem] shadow-2xl overflow-hidden z-[100] animate-slide-up">
              <div class="p-3 space-y-1">
                <a *ngFor="let item of settingsLinks" [routerLink]="item.path" (click)="isDropdownOpen = false" class="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-foreground/[0.05] transition-all text-subtle hover:text-foreground text-xs font-black uppercase tracking-widest">
                   <ng-icon [name]="item.icon" size="1.25rem" class="opacity-60 flex-shrink-0"></ng-icon>
                   <span>{{ item.label }}</span>
                </a>
                <div class="h-px bg-border my-2 mx-4"></div>
                <button (click)="authService.logout()" class="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-expense/10 transition-all text-subtle hover:text-expense text-xs font-black uppercase tracking-widest">
                   <ng-icon name="heroArrowRightOnRectangle" size="1.25rem"></ng-icon>
                   <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <nav class="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-surface/90 backdrop-blur-xl border-t border-border flex items-center justify-around px-2 z-[50]">
          <a *ngFor="let link of mobileNavLinks" [routerLink]="link.path" routerLinkActive="text-primary" [routerLinkActiveOptions]="{exact: link.path === '/'}"
             [attr.data-tutorial]="link.tutorialKey"
             class="flex flex-col items-center justify-center space-y-1.5 w-16 transition-all active:scale-90 text-subtle">
             <ng-icon [name]="link.icon" class="text-xl"></ng-icon>
             <span class="text-[8px] font-black uppercase tracking-tighter">{{ link.label }}</span>
          </a>
        </nav>

        <main class="flex-1 overflow-auto p-4 md:p-10 transition-colors duration-300 pb-24 md:pb-10">
          <div class="max-w-[1400px] mx-auto">
            <router-outlet />
          </div>
        </main>
      </div>
    </ng-container>

    <ng-template #unauthLayout>
      <router-outlet />
    </ng-template>
  `
})
export class App implements OnInit {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  tutorialService = inject(TutorialService);
  private budgetService = inject(BudgetService);
  private accountService = inject(AccountService);
  private transactionService = inject(TransactionService);
  
  private eRef = inject(ElementRef);
  private router = inject(Router);

  isDropdownOpen = false;
  isSettingsActive = signal(false);

  navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/transactions', label: 'History' },
    { path: '/accounts', label: 'Accounts' },
    { path: '/budgets', label: 'Budgets' },
    { path: '/goals', label: 'Goals' }
  ];

  mobileNavLinks = [
    { path: '/', label: 'Home', icon: 'heroHome', tutorialKey: 'nav-home-mobile' },
    { path: '/transactions', label: 'Ledger', icon: 'heroArrowsRightLeft', tutorialKey: 'nav-ledger-mobile' },
    { path: '/accounts', label: 'Vaults', icon: 'heroCreditCard', tutorialKey: 'nav-accounts-mobile' },
    { path: '/budgets', label: 'Budgets', icon: 'heroChartPie', tutorialKey: 'nav-budgets-mobile' },
    { path: '/goals', label: 'Targets', icon: 'heroTrophy', tutorialKey: 'nav-goals-mobile' }
  ];

  settingsLinks = [
    { path: '/account', label: 'Account', icon: 'heroUser' },
    { path: '/preferences', label: 'Preferences', icon: 'heroAdjustmentsHorizontal' },
    { path: '/categories', label: 'Categories', icon: 'heroTag' },
    { path: '/legal', label: 'Legal & Privacy', icon: 'heroShieldCheck' }
  ];

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isSettingsActive.set(
        this.router.isActive('/account', true) || 
        this.router.isActive('/preferences', true) || 
        this.router.isActive('/categories', true) ||
        this.router.isActive('/legal', true)
      );
    });
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.syncData();
    }
  }

  private syncData() {
    // Global data reconciliation on startup/login
    Promise.all([
      this.budgetService.loadBudgets(),
      this.accountService.loadAccounts(),
      this.transactionService.loadDashboardSummary()
    ]).catch(err => console.error('Initial data sync failed', err));
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.eRef.nativeElement.querySelector('.settings-container')?.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }
}
