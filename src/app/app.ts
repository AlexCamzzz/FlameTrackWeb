import { Component, inject, HostListener, ElementRef, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { TutorialService } from './services/tutorial.service';
import { filter } from 'rxjs';
import { TermsModalComponent } from './components/legal/terms-modal.component';
import { TutorialOverlayComponent } from './components/tutorial/tutorial-overlay.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroUser, heroAdjustmentsHorizontal, heroTag, heroShieldCheck, heroArrowRightOnRectangle, heroBars3, heroXMark, heroCog8Tooth, heroLifebuoy, heroEye, heroEyeSlash } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, TermsModalComponent, TutorialOverlayComponent, NgIconComponent],
  providers: [provideIcons({ heroUser, heroAdjustmentsHorizontal, heroTag, heroShieldCheck, heroArrowRightOnRectangle, heroBars3, heroXMark, heroCog8Tooth, heroLifebuoy, heroEye, heroEyeSlash })],
  template: `
    <app-tutorial-overlay />

    <!-- Help FAB -->
    <button *ngIf="authService.isAuthenticated() && tutorialService.helpButtonVisible() && !tutorialService.isActive()"
      (click)="tutorialService.start()"
      data-tutorial="help-fab"
      class="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl z-[60] flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group">
      <ng-icon name="heroLifebuoy" class="text-2xl group-hover:rotate-12 transition-transform"></ng-icon>
      <span class="absolute right-full mr-4 px-3 py-1 bg-surface border border-border rounded-lg text-[10px] font-black uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">Help Center</span>
    </button>

    <ng-container *ngIf="authService.isAuthenticated(); else unauthLayout">
      <div class="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300 overflow-x-hidden">
        
        <app-terms-modal *ngIf="authService.currentUser() && !authService.currentUser()?.hasAcceptedTerms"></app-terms-modal>
        <!-- Responsive Header -->
        <header class="h-16 md:h-20 bg-surface/80 backdrop-blur-2xl border-b border-border flex items-center justify-between px-4 md:px-10 sticky top-0 z-50 transition-colors">
          
          <!-- Logo & Mobile Toggle -->
          <div class="flex items-center space-x-3 md:space-x-4">
            <button (click)="isMobileMenuOpen.set(!isMobileMenuOpen())" class="md:hidden p-2 text-subtle hover:text-foreground">
               <ng-icon name="heroBars3" *ngIf="!isMobileMenuOpen()" class="text-2xl"></ng-icon>
               <ng-icon name="heroXMark" *ngIf="isMobileMenuOpen()" class="text-2xl"></ng-icon>
            </button>
            <a routerLink="/" (click)="isMobileMenuOpen.set(false)" class="flex items-center space-x-2 md:space-x-3 hover:opacity-80 transition-opacity cursor-pointer">
              <img [src]="themeService.currentLogo()" alt="FlameTrack" class="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-2xl">
              <span class="text-lg md:text-2xl font-black tracking-tighter text-foreground hidden xs:block">FlameTrack</span>
            </a>
          </div>

          <!-- Desktop Navigation -->
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

          <!-- Settings & Profile -->
          <div class="flex items-center space-x-2 md:space-x-4 relative settings-container" *ngIf="authService.currentUser() as user">
            
            <!-- Privacy Toggle Quick Action -->
            <button (click)="themeService.togglePrivacyMode()" 
              [class.text-primary]="themeService.isPrivacyModeActive()"
              [class.text-subtle]="!themeService.isPrivacyModeActive()"
              class="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-foreground/[0.05] hover:bg-foreground/[0.08] transition-all flex items-center justify-center border border-border shadow-sm group"
              [title]="themeService.isPrivacyModeActive() ? 'Disable Privacy Mode' : 'Enable Privacy Mode'">
              <ng-icon [name]="themeService.isPrivacyModeActive() ? 'heroEyeSlash' : 'heroEye'" class="text-[1.2rem] md:text-[1.3rem]"></ng-icon>
            </button>

            <!-- User Avatar Peek -->
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

            <!-- Settings Menu -->
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

        <!-- Mobile Drawer Navigation -->
        <div *ngIf="isMobileMenuOpen()" class="fixed inset-0 z-40 md:hidden animate-fade-in">
           <div class="absolute inset-0 bg-background/80 backdrop-blur-md" (click)="isMobileMenuOpen.set(false)"></div>
           <nav class="absolute left-0 top-0 bottom-0 w-72 bg-surface border-r border-border p-8 flex flex-col space-y-2 animate-slide-up shadow-2xl">
              <div class="mb-10 flex items-center space-x-3">
                <img [src]="themeService.currentLogo()" class="w-8 h-8 object-contain">
                <span class="text-xl font-black text-foreground">Menu</span>
              </div>
              <a *ngFor="let link of navLinks" [routerLink]="link.path" routerLinkActive="bg-primary text-white" [routerLinkActiveOptions]="{exact: link.path === '/'}" 
                 (click)="isMobileMenuOpen.set(false)"
                 [attr.data-tutorial]="
                   link.path === '/accounts' ? 'nav-accounts-mobile' : 
                   link.path === '/transactions' ? 'nav-ledger-mobile' : 
                   link.path === '/budgets' ? 'nav-budgets-mobile' : 
                   link.path === '/goals' ? 'nav-goals-mobile' : null"
                 class="p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all text-subtle hover:text-foreground flex items-center space-x-4 border border-transparent active:border-border">
                <span>{{ link.label }}</span>
              </a>
           </nav>
        </div>

        <!-- Main Content (Adaptive Padding) -->
        <main class="flex-1 overflow-auto p-4 md:p-10 transition-colors duration-300">
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
  private eRef = inject(ElementRef);
  private router = inject(Router);

  isDropdownOpen = false;
  isSettingsActive = signal(false);
  isMobileMenuOpen = signal(false);

  navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/transactions', label: 'History' },
    { path: '/accounts', label: 'Accounts' },
    { path: '/budgets', label: 'Budgets' },
    { path: '/goals', label: 'Goals' }
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
    // No auto-trigger
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
