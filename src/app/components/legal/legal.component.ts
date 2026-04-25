import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20 px-4">
      <header class="border-b border-border pb-8 text-center">
        <h1 class="text-3xl font-black text-foreground uppercase tracking-[0.2em]">Legal & Privacy</h1>
        <p class="text-subtle text-xs font-bold uppercase tracking-widest mt-2 opacity-60">Governance // Security // Terms</p>
      </header>

      <div class="grid grid-cols-1 gap-8">
        <!-- Privacy Notice -->
        <section class="card space-y-6 shadow-md">
          <div class="flex items-center space-x-3 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <h2 class="text-xl font-black uppercase tracking-widest">Privacy Notice</h2>
          </div>
          
          <div class="space-y-4 text-sm leading-relaxed text-foreground opacity-80">
            <p>At **FlameTrack**, your financial privacy is our core mandate. We operate on a strict data-ownership model where the user retains total control over their information.</p>
            
            <div class="pl-4 border-l-2 border-primary/20 space-y-4">
               <p><strong class="text-primary font-black uppercase text-[10px] tracking-widest">Data Collection:</strong> We collect only necessary identifiers (encrypted email, name) and the financial records you voluntarily establish within the terminal.</p>
               <p><strong class="text-primary font-black uppercase text-[10px] tracking-widest">Usage:</strong> Your data is processed exclusively to generate financial intelligence reports, ledger entries, and goals progress shown on your dashboard.</p>
               <p><strong class="text-primary font-black uppercase text-[10px] tracking-widest">Third Parties:</strong> We do not sell, trade, or distribute your financial parameters to external entities. Your data remains isolated within our proprietary secure clusters.</p>
               <p><strong class="text-primary font-black uppercase text-[10px] tracking-widest">Security:</strong> All communication between your terminal and our infrastructure is protected by advanced encryption standards. Authentication is managed via proprietary secure session protocols.</p>
            </div>
          </div>
        </section>

        <!-- Terms of Service -->
        <section class="card space-y-6 shadow-md">
          <div class="flex items-center space-x-3 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            <h2 class="text-xl font-black uppercase tracking-widest">Terms of Service</h2>
          </div>
          
          <div class="space-y-4 text-xs font-bold uppercase tracking-widest text-subtle leading-loose">
             <p>1. FlameTrack is provided as a virtual financial tracking utility "as-is" without warranty of mathematical accuracy or regulatory compliance.</p>
             <p>2. Users are responsible for maintaining the security of their local environments and access credentials.</p>
             <p>3. Account misuse or attempts to analyze proprietary security protocols will result in immediate identity revocation.</p>
             <p>4. All financial entries are virtual and do not represent direct legal currency movements outside the terminal's logic.</p>
          </div>
        </section>

        <!-- Rights -->
        <section class="card bg-foreground/[0.02] border-dashed">
           <h3 class="text-sm font-black text-foreground uppercase tracking-widest mb-4">Subject Rights</h3>
           <p class="text-xs text-subtle leading-relaxed mb-6">You have the absolute right to request a full dump of your financial data or the complete deletion of your account. These actions can be initiated directly from your Account Identity settings.</p>
           <div class="flex items-center space-x-4">
              <span class="px-3 py-1 bg-income/10 border border-income/20 text-income text-[9px] font-black uppercase rounded-lg">Hardened Architecture</span>
              <span class="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase rounded-lg">Coded Integrity</span>
           </div>
        </section>
      </div>
    </div>
  `
})
export class LegalComponent {}
