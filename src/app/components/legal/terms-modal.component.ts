import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-terms-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-background/90 backdrop-blur-xl animate-fade-in">
      <div class="w-full max-w-2xl bg-surface border border-border rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-slide-up">
        
        <!-- Header -->
        <header class="p-8 md:p-10 border-b border-border flex justify-between items-center bg-foreground/[0.02]">
           <div>
              <p class="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-1">Mandatory Governance</p>
              <h2 class="text-xl md:text-2xl font-black text-foreground uppercase tracking-tight">Legal Protocol</h2>
           </div>
           <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/5">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
           </div>
        </header>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-8 md:p-10 space-y-8 custom-scrollbar">
           <section class="space-y-4">
              <h3 class="text-[10px] font-black text-foreground uppercase tracking-widest flex items-center space-x-2">
                 <span class="w-1.5 h-1.5 bg-primary rounded-full"></span>
                 <span>Data Sovereignty</span>
              </h3>
              <p class="text-xs md:text-sm text-subtle leading-loose opacity-80">
                 By initializing this terminal, you acknowledge that **FlameTrack** operates as a virtual financial utility. All data generated remains your exclusive property, isolated within hardened proprietary clusters. We do not distribute financial parameters to external agencies.
              </p>
           </section>

           <section class="space-y-4">
              <h3 class="text-[10px] font-black text-foreground uppercase tracking-widest flex items-center space-x-2">
                 <span class="w-1.5 h-1.5 bg-primary rounded-full"></span>
                 <span>Security Compliance</span>
              </h3>
              <p class="text-xs md:text-sm text-subtle leading-loose opacity-80">
                 You are solely responsible for the integrity of your access credentials and local environment. Any attempt to reverse-engineer security protocols or misuse the terminal will result in immediate identity revocation.
              </p>
           </section>

           <section class="space-y-4">
              <h3 class="text-[10px] font-black text-foreground uppercase tracking-widest flex items-center space-x-2">
                 <span class="w-1.5 h-1.5 bg-primary rounded-full"></span>
                 <span>Financial Accuracy</span>
              </h3>
              <p class="text-xs md:text-sm text-subtle leading-loose opacity-80 italic">
                 FlameTrack is provided "as-is". While our logic core is built for precision, we offer no legal warranty regarding mathematical accuracy or regulatory reporting compliance.
              </p>
           </section>
           
           <div class="p-6 bg-foreground/[0.03] border border-border rounded-2xl">
              <label class="flex items-center space-x-4 cursor-pointer group">
                 <div class="relative">
                    <input type="checkbox" class="sr-only peer" [(ngModel)]="hasAgreed" [ngModelOptions]="{standalone: true}">
                    <div class="w-6 h-6 border-2 border-border rounded-lg peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                       <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                 </div>
                 <span class="text-[10px] font-black text-foreground uppercase tracking-widest group-hover:text-primary transition-colors">I accept the Governance Protocol & Privacy Mandate</span>
              </label>
           </div>
        </div>

        <!-- Footer -->
        <footer class="p-8 border-t border-border bg-foreground/[0.01]">
           <button (click)="accept()" [disabled]="!hasAgreed || isSubmitting" 
             class="btn-premium w-full py-5 shadow-xl shadow-primary/20 disabled:opacity-20 disabled:grayscale">
              {{ isSubmitting ? 'Syncing Agreement...' : 'Initialize Terminal' }}
           </button>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 10px; }
  `]
})
export class TermsModalComponent {
  authService = inject(AuthService);
  hasAgreed = false;
  isSubmitting = false;

  async accept() {
    if (!this.hasAgreed) return;
    this.isSubmitting = true;
    try {
      await this.authService.acceptTerms();
    } catch (e) {
      console.error(e);
      alert('Agreement synchronization failed.');
    } finally {
      this.isSubmitting = false;
    }
  }
}
