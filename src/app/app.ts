import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <ng-container *ngIf="authService.isAuthenticated(); else unauthLayout">
      <div class="min-h-screen bg-background text-white flex">
        <!-- Sidebar placeholder -->
        <aside class="w-64 bg-surface border-r border-border/20 hidden md:flex flex-col p-6">
          <div class="flex items-center space-x-3 mb-10">
            <div class="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <span class="font-bold">FT</span>
            </div>
            <span class="text-xl font-bold tracking-tight">FlameTrack</span>
          </div>
          
          <nav class="space-y-2 flex-1">
            <a routerLink="/" routerLinkActive="bg-primary/10 text-primary" [routerLinkActiveOptions]="{exact: true}" class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 text-subtle font-medium transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Dashboard</span>
            </a>
            <a routerLink="/transactions" routerLinkActive="bg-primary/10 text-primary" class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 text-subtle font-medium transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Transactions</span>
            </a>
            <a routerLink="/budgets" routerLinkActive="bg-primary/10 text-primary" class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 text-subtle font-medium transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
              </svg>
              <span>Budgets</span>
            </a>
            <a routerLink="/goals" routerLinkActive="bg-primary/10 text-primary" class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 text-subtle font-medium transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Goals</span>
            </a>
            <a routerLink="/categories" routerLinkActive="bg-primary/10 text-primary" class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 text-subtle font-medium transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>Categories</span>
            </a>
          </nav>
          
          <button (click)="authService.logout()" class="flex items-center space-x-3 p-3 rounded-xl hover:bg-red-500/10 text-subtle hover:text-red-400 font-medium transition-colors w-full text-left mt-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Log out</span>
          </button>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 overflow-auto bg-background/95">
          <router-outlet />
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
}
