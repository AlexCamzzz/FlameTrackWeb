import { Component, inject, HostListener, ElementRef, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { filter } from 'rxjs';
import { TermsModalComponent } from './components/legal/terms-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, TermsModalComponent],
  template: `
    <ng-container *ngIf="authService.isAuthenticated(); else unauthLayout">
      <div class="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300 overflow-x-hidden">
        
        <app-terms-modal *ngIf="authService.currentUser() && !authService.currentUser()?.hasAcceptedTerms"></app-terms-modal>
        <!-- Responsive Header -->
        <header class="h-16 md:h-20 bg-surface/80 backdrop-blur-2xl border-b border-border flex items-center justify-between px-4 md:px-10 sticky top-0 z-50 transition-colors">
          
          <!-- Logo & Mobile Toggle -->
          <div class="flex items-center space-x-3 md:space-x-4">
            <button (click)="isMobileMenuOpen.set(!isMobileMenuOpen())" class="md:hidden p-2 text-subtle hover:text-foreground">
               <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path *ngIf="!isMobileMenuOpen()" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                 <path *ngIf="isMobileMenuOpen()" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
               </svg>
            </button>
            <a routerLink="/" (click)="isMobileMenuOpen.set(false)" class="flex items-center space-x-2 md:space-x-3 hover:opacity-80 transition-opacity cursor-pointer">
              <img src="/assets/logo.png" alt="FlameTrack" class="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-2xl">
              <span class="text-lg md:text-2xl font-black tracking-tighter text-foreground hidden xs:block">FlameTrack</span>
            </a>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center bg-foreground/[0.03] p-1 rounded-2xl border border-border shadow-sm">
            <a *ngFor="let link of navLinks" [routerLink]="link.path" routerLinkActive="bg-primary text-white shadow-lg shadow-primary/20" [routerLinkActiveOptions]="{exact: link.path === '/'}" 
               class="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 text-subtle hover:text-foreground">
              {{ link.label }}
            </a>
          </nav>

          <!-- Settings & Profile -->
          <div class="flex items-center space-x-2 md:space-x-4 relative settings-container" *ngIf="authService.currentUser() as user">
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
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            <!-- Settings Menu -->
            <div *ngIf="isDropdownOpen" class="absolute top-[calc(100%+12px)] right-0 w-64 bg-surface border border-border rounded-[2rem] shadow-2xl overflow-hidden z-[100] animate-slide-up">
              <div class="p-3 space-y-1">
                <a *ngFor="let item of settingsLinks" [routerLink]="item.path" (click)="isDropdownOpen = false" class="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-foreground/[0.05] transition-all text-subtle hover:text-foreground text-xs font-black uppercase tracking-widest">
                   <div [innerHTML]="item.icon" class="w-5 h-5 opacity-60"></div>
                   <span>{{ item.label }}</span>
                </a>
                <div class="h-px bg-border my-2 mx-4"></div>
                <button (click)="authService.logout()" class="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-expense/10 transition-all text-subtle hover:text-expense text-xs font-black uppercase tracking-widest">
                   <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
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
                <img src="/assets/logo.png" class="w-8 h-8 object-contain">
                <span class="text-xl font-black text-foreground">Menu</span>
              </div>
              <a *ngFor="let link of navLinks" [routerLink]="link.path" routerLinkActive="bg-primary text-white" [routerLinkActiveOptions]="{exact: link.path === '/'}" 
                 (click)="isMobileMenuOpen.set(false)"
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
export class App {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
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
    { path: '/account', label: 'Account', icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>` },
    { path: '/preferences', label: 'Preferences', icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>` },
    { path: '/categories', label: 'Categories', icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>` },
    { path: '/legal', label: 'Legal & Privacy', icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>` }
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
