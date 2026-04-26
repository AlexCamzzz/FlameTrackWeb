import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <!-- Decorative Background Elements -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px]"></div>

      <div class="w-full max-w-md p-8 bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl relative z-10">
        <div class="flex justify-center mb-8">
           <img [src]="themeService.currentLogo()" alt="FlameTrack" class="w-20 h-20 object-contain drop-shadow-2xl">
        </div>

        <h2 class="text-3xl font-bold text-center mb-2 text-white">Welcome back</h2>
        <p class="text-subtle text-center mb-8">Enter your details to access your dashboard</p>

        <form (ngSubmit)="onSubmit()" class="space-y-5">
          <div *ngIf="errorMessage" class="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center">
            {{ errorMessage }}
          </div>

          <div>
            <label class="block text-sm font-medium text-subtle mb-1.5 ml-1">Email</label>
            <input type="email" name="email" [(ngModel)]="model.email" required
              class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-subtle/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="name@example.com">
          </div>

          <div>
            <label class="block text-sm font-medium text-subtle mb-1.5 ml-1">Password</label>
            <input type="password" name="password" [(ngModel)]="model.password" required
              class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-subtle/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="••••••••">
          </div>

          <button type="submit" [disabled]="isSubmitting" 
            class="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl px-4 py-3 font-bold transition-all disabled:opacity-50 mt-4 shadow-lg shadow-primary/20">
            {{ isSubmitting ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <p class="text-center text-subtle mt-8 text-sm">
          Don't have an account? 
          <a routerLink="/register" class="text-primary hover:text-secondary font-medium transition-colors">Sign up</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  
  isSubmitting = false;
  errorMessage = '';
  model = { email: '', password: '' };

  async onSubmit() {
    if (!this.model.email || !this.model.password) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    try {
      await this.authService.login(this.model);
    } catch (error: any) {
      this.errorMessage = error.error?.message || 'Invalid email or password';
    } finally {
      this.isSubmitting = false;
    }
  }
}
