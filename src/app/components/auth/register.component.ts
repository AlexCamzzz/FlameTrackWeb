import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-background flex flex-col items-center justify-center p-6 animate-fade-in transition-colors duration-300">
      <div class="w-full max-w-md space-y-10">
        <!-- Brand Identity -->
        <div class="text-center space-y-4">
          <img [src]="themeService.currentLogo()" alt="FlameTrack" class="w-16 h-16 mx-auto drop-shadow-2xl">
          <div>
            <h1 class="text-3xl font-black text-foreground uppercase tracking-tighter">Forge Account</h1>
            <p class="text-subtle text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Join the Financial Elite</p>
          </div>
        </div>

        <div class="card !p-10 shadow-2xl border-border">
          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="space-y-4">
              <div>
                <label class="block text-[10px] font-black text-subtle uppercase tracking-widest mb-2 ml-1">Full Name</label>
                <input type="text" name="name" [(ngModel)]="model.name" required
                  class="input-premium w-full shadow-inner" placeholder="Enter identity label">
              </div>

              <div>
                <label class="block text-[10px] font-black text-subtle uppercase tracking-widest mb-2 ml-1">Secure Email</label>
                <input type="email" name="email" [(ngModel)]="model.email" required
                  class="input-premium w-full shadow-inner" placeholder="nexus@flametrack.io">
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label class="block text-[10px] font-black text-subtle uppercase tracking-widest mb-2 ml-1">Security Key</label>
                    <input type="password" name="password" [(ngModel)]="model.password" required
                      class="input-premium w-full shadow-inner" placeholder="••••••••">
                 </div>
                 <div>
                    <label class="block text-[10px] font-black text-subtle uppercase tracking-widest mb-2 ml-1">Verify Key</label>
                    <input type="password" name="confirmPassword" [(ngModel)]="confirmPassword" required
                      class="input-premium w-full shadow-inner" [class.border-expense]="!passwordsMatch() && confirmPassword" placeholder="••••••••">
                 </div>
              </div>
              
              <p *ngIf="!passwordsMatch() && confirmPassword" class="text-[9px] font-black text-expense uppercase tracking-widest animate-pulse ml-1">Security keys do not match.</p>
              <p *ngIf="model.password && !isPasswordStrong()" class="text-[9px] font-black text-expense uppercase tracking-widest opacity-80 ml-1 leading-relaxed">Key must be 8+ chars with uppercase, lowercase, and numeric parameters.</p>
            </div>

            <div class="pt-4">
              <button type="submit" [disabled]="isSubmitting || !passwordsMatch() || !isPasswordStrong() || !model.name || !model.email" 
                class="btn-premium w-full py-5">
                {{ isSubmitting ? 'Syncing...' : 'Forge Account' }}
              </button>
            </div>
          </form>

          <div class="mt-8 pt-8 border-t border-border text-center">
            <p class="text-subtle text-[10px] font-black uppercase tracking-widest opacity-60">Already registered?</p>
            <a routerLink="/login" class="text-primary text-[10px] font-black uppercase tracking-widest hover:underline mt-2 inline-block">Return to Terminal</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  private router = inject(Router);

  isSubmitting = false;
  confirmPassword = '';
  model = {
    name: '',
    email: '',
    password: ''
  };

  passwordsMatch(): boolean {
    return this.model.password === this.confirmPassword && this.model.password.length > 0;
  }

  isPasswordStrong(): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(this.model.password);
  }

  async onSubmit() {
    if (!this.passwordsMatch() || !this.isPasswordStrong()) return;
    
    this.isSubmitting = true;
    try {
      await this.authService.register(this.model);
      this.router.navigate(['/']);
    } catch (e: any) {
      alert(e.error?.message || 'Synchronization failed.');
    } finally {
      this.isSubmitting = false;
    }
  }
}
