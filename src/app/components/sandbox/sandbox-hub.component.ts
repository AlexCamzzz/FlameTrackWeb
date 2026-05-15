import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroRocketLaunch, heroArrowRight, heroSparkles, heroClock } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-sandbox-hub',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent],
  providers: [provideIcons({ heroRocketLaunch, heroArrowRight, heroSparkles, heroClock })],
  template: `
    <div class="space-y-10 animate-fade-in">
      <header class="relative p-10 rounded-[2.5rem] bg-gradient-to-br from-surface to-surface/50 border border-border overflow-hidden group">
        <div class="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
           <ng-icon name="heroRocketLaunch" size="12rem"></ng-icon>
        </div>
        
        <div class="relative z-10 space-y-4">
          <div class="flex items-center space-x-3 text-primary">
            <ng-icon name="heroSparkles" size="1.5rem"></ng-icon>
            <span class="text-xs font-black uppercase tracking-[0.3em]">Temporal Nexus</span>
          </div>
          <h1 class="text-5xl md:text-6xl font-black tracking-tighter text-foreground">Pocket Dimensions</h1>
          <p class="text-subtle text-lg max-w-2xl font-medium leading-relaxed">
            Create isolated financial universes. Run simulations, test scenarios, and project your future liquidity without touching your real-world ledger.
          </p>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let dim of dimensions" 
             [routerLink]="['/pocket-dimensions', dim.year, dim.month]"
             class="group relative p-8 rounded-[2rem] bg-surface border border-border hover:border-primary/50 transition-all duration-500 cursor-pointer overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/5">
          
          <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-700 text-primary">
             <ng-icon name="heroClock" size="8rem"></ng-icon>
          </div>

          <div class="space-y-6 relative z-10">
            <div class="flex justify-between items-start">
              <div class="space-y-1">
                <span class="text-xs font-black text-subtle uppercase tracking-widest">{{ dim.year }}</span>
                <h3 class="text-3xl font-black text-foreground">{{ dim.monthName }}</h3>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-foreground/[0.03] flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                 <ng-icon name="heroArrowRight" size="1.25rem"></ng-icon>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <span class="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">Parallel Universe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class SandboxHubComponent implements OnInit {
  dimensions: any[] = [];

  ngOnInit() {
    this.generateDimensions();
  }

  generateDimensions() {
    const now = new Date();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      this.dimensions.push({
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        monthName: months[d.getMonth()]
      });
    }
  }
}
