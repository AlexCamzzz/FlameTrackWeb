import { Component, inject, HostListener, ElementRef } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <ng-container *ngIf="authService.isAuthenticated(); else unauthLayout">
      <div class="min-h-screen bg-[#1A1721] text-white flex flex-col font-sans">
        <!-- Top Navigation Bar -->
        <header class="h-20 bg-[#2C2938]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-10 sticky top-0 z-50">
          <div class="flex items-center space-x-4">
            <img src="/assets/logo.png" alt="FlameTrack Logo" class="w-10 h-10 object-contain drop-shadow-lg">
            <span class="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">FlameTrack</span>
          </div>

          <nav class="flex items-center bg-black/30 p-1.5 rounded-2xl border border-white/5 shadow-2xl">
            <a routerLink="/" routerLinkActive="bg-gradient-to-br from-primary to-[#FF7043] shadow-lg shadow-primary/30 text-white" [routerLinkActiveOptions]="{exact: true}" 
               class="px-8 py-2.5 rounded-xl text-sm font-extrabold transition-all duration-300 text-subtle hover:text-white flex items-center space-x-2">
              <span>Dashboard</span>
            </a>
            <a routerLink="/transactions" routerLinkActive="bg-gradient-to-br from-primary to-[#FF7043] shadow-lg shadow-primary/30 text-white" 
               class="px-8 py-2.5 rounded-xl text-sm font-extrabold transition-all duration-300 text-subtle hover:text-white flex items-center space-x-2">
              <span>Transactions</span>
            </a>
            <a routerLink="/budgets" routerLinkActive="bg-gradient-to-br from-primary to-[#FF7043] shadow-lg shadow-primary/30 text-white" 
               class="px-8 py-2.5 rounded-xl text-sm font-extrabold transition-all duration-300 text-subtle hover:text-white flex items-center space-x-2">
              <span>Budgets</span>
            </a>
            <a routerLink="/goals" routerLinkActive="bg-gradient-to-br from-primary to-[#FF7043] shadow-lg shadow-primary/30 text-white" 
               class="px-8 py-2.5 rounded-xl text-sm font-extrabold transition-all duration-300 text-subtle hover:text-white flex items-center space-x-2">
              <span>Goals</span>
            </a>
          </nav>

          <div class="flex items-center space-x-4 relative settings-container">
            <button (click)="toggleDropdown($event)" 
              class="w-12 h-12 bg-white/5 rounded-2xl hover:bg-white/10 text-subtle hover:text-white transition-all duration-300 flex items-center justify-center border border-white/5 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            <!-- Settings Dropdown Menu -->
            <div *ngIf="isDropdownOpen" class="absolute top-[calc(100%+12px)] right-0 w-64 bg-[#2C2938]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-[100] animate-slide-up">
              <div class="p-3 space-y-1">
                <a routerLink="/account" (click)="isDropdownOpen = false" class="w-full flex items-center space-x-3 p-3.5 rounded-2xl hover:bg-white/5 transition-all text-subtle hover:text-white text-sm font-bold">
                   <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                   <span>Account</span>
                </a>
                <a routerLink="/preferences" (click)="isDropdownOpen = false" class="w-full flex items-center space-x-3 p-3.5 rounded-2xl hover:bg-white/5 transition-all text-subtle hover:text-white text-sm font-bold">
                   <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                   <span>Preferences</span>
                </a>
                <a routerLink="/categories" (click)="isDropdownOpen = false" class="w-full flex items-center space-x-3 p-3.5 rounded-2xl hover:bg-white/5 transition-all text-subtle hover:text-white text-sm font-bold">
                   <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                   <span>Categories Manager</span>
                </a>
                <div class="h-px bg-white/5 my-2"></div>
                <button (click)="authService.logout()" class="w-full flex items-center space-x-3 p-3.5 rounded-2xl hover:bg-red-500/10 transition-all text-subtle hover:text-red-400 text-sm font-bold">
                   <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                   <span>Log out</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <!-- Main Content Area -->
        <div class="flex-1 overflow-auto bg-[#1A1721] p-10">
          <div class="max-w-[1600px] mx-auto">
            <router-outlet />
          </div>
        </div>
      </div>
    </ng-container>

    <ng-template #unauthLayout>
      <router-outlet />
    </ng-template>
  `
})
export class App {
  authService = inject(AuthService);
  private eRef = inject(ElementRef);
  isDropdownOpen = false;

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
