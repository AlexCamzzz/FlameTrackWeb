import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService, ThemeType } from '../../../services/theme.service';
import { TutorialService } from '../../../services/tutorial.service';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[1400px] mx-auto space-y-10 animate-fade-in pb-12 px-4">
      <header class="border-b border-border pb-8">
        <h1 class="text-2xl font-black text-foreground uppercase tracking-widest">Environment</h1>
        <p class="text-subtle text-xs font-bold uppercase tracking-widest mt-2 opacity-60">Global Platform Customization</p>
      </header>

      <div class="space-y-8">
        <!-- Appearance Grid -->
        <section class="card space-y-8 shadow-sm">
          <header class="flex items-center space-x-3 opacity-60">
             <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.828 2.828a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
             <h2 class="text-[10px] font-black uppercase tracking-widest text-foreground">Theme Management</h2>
          </header>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             <!-- Default -->
             <div (click)="setTheme('default-dark')" 
               [ngClass]="themeService.currentTheme() === 'default-dark' ? 'border-[#FF5722]' : 'border-[#FFFFFF0D]'"
               class="p-6 bg-[#0A0A0A] border-2 rounded-3xl cursor-pointer transition-all hover:border-[#FF5722] group shadow-sm">
                <div class="w-full h-16 bg-[#141414] rounded-xl mb-4 border border-[#FFFFFF0D] shadow-inner"></div>
                <div class="flex justify-between items-center">
                   <span class="text-[10px] font-black uppercase tracking-widest text-[#FFFFFF]">Flame Orange</span>
                   <div *ngIf="themeService.currentTheme() === 'default-dark'" class="w-2 h-2 rounded-full bg-[#FF5722] shadow-[0_0_8px_#FF5722]"></div>
                </div>
             </div>

             <!-- Nord -->
             <div (click)="setTheme('theme-nord')"
               [ngClass]="themeService.currentTheme() === 'theme-nord' ? 'border-[#88C0D0]' : 'border-[#88C0D01A]'"
               class="p-6 bg-[#242933] border-2 rounded-3xl cursor-pointer transition-all hover:border-[#88C0D0] group shadow-sm">
                <div class="w-full h-16 bg-[#2E3440] rounded-xl mb-4 border border-[#88C0D01A] shadow-inner"></div>
                <div class="flex justify-between items-center">
                   <span class="text-[10px] font-black uppercase tracking-widest text-[#ECEFF4]">Nord Arctic</span>
                   <div *ngIf="themeService.currentTheme() === 'theme-nord'" class="w-2 h-2 rounded-full bg-[#88C0D0] shadow-[0_0_8px_#88C0D0]"></div>
                </div>
             </div>

             <!-- Midnight -->
             <div (click)="setTheme('theme-deep-midnight')"
               [ngClass]="themeService.currentTheme() === 'theme-deep-midnight' ? 'border-[#BB86FC]' : 'border-[#FFFFFF0A]'"
               class="p-6 bg-[#000000] border-2 rounded-3xl cursor-pointer transition-all hover:border-[#BB86FC] group shadow-sm">
                <div class="w-full h-16 bg-[#0D0D0D] rounded-xl mb-4 border border-[#FFFFFF0A] shadow-inner"></div>
                <div class="flex justify-between items-center">
                   <span class="text-[10px] font-black uppercase tracking-widest text-[#FFFFFF]">Deep Midnight</span>
                   <div *ngIf="themeService.currentTheme() === 'theme-deep-midnight'" class="w-2 h-2 rounded-full bg-[#BB86FC] shadow-[0_0_8px_#BB86FC]"></div>
                </div>
             </div>

             <!-- Sakura -->
             <div (click)="setTheme('theme-sakura')"
               [style.borderColor]="themeService.currentTheme() === 'theme-sakura' ? '#D81B60' : '#BEA0B6'"
               class="p-6 border-2 rounded-3xl cursor-pointer transition-all hover:!border-[#D81B60] group shadow-sm"
               style="background-color: #D4BACC;">
                <div class="w-full h-16 rounded-xl mb-4 border shadow-inner" style="background-color: #E3C9DB; border-color: #BEA0B6;"></div>
                <div class="flex justify-between items-center">
                   <span class="text-[10px] font-black uppercase tracking-widest" style="color: #2B1626;">Sakura Blossom</span>
                   <div *ngIf="themeService.currentTheme() === 'theme-sakura'" class="w-2 h-2 rounded-full shadow-[0_0_8px_#D81B60]" style="background-color: #D81B60;"></div>
                </div>
             </div>

             <!-- Forest -->
             <div (click)="setTheme('theme-forest')"
               [style.borderColor]="themeService.currentTheme() === 'theme-forest' ? '#2E7D32' : '#869C8B'"
               class="p-6 border-2 rounded-3xl cursor-pointer transition-all hover:!border-[#2E7D32] group shadow-sm"
               style="background-color: #97AD9C;">
                <div class="w-full h-16 rounded-xl mb-4 border shadow-inner" style="background-color: #A5BBAA; border-color: #869C8B;"></div>
                <div class="flex justify-between items-center">
                   <span class="text-[10px] font-black uppercase tracking-widest" style="color: #1B261D;">Forest Canopy</span>
                   <div *ngIf="themeService.currentTheme() === 'theme-forest'" class="w-2 h-2 rounded-full shadow-[0_0_8px_#2E7D32]" style="background-color: #2E7D32;"></div>
                </div>
             </div>

             <!-- Pride -->
             <div (click)="setTheme('theme-pride')"
               [ngClass]="themeService.currentTheme() === 'theme-pride' ? 'border-[#FFFFFF66]' : 'border-[#D1C4E91A]'"
               class="p-6 bg-[#09070D] border-2 rounded-3xl cursor-pointer transition-all hover:border-[#FFFFFF66] group shadow-sm overflow-hidden relative">
                <div class="absolute inset-0 opacity-10 bg-gradient-to-br from-red-500 via-green-500 to-purple-600"></div>
                <div class="w-full h-16 bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 via-blue-500 to-purple-600 rounded-xl mb-4 shadow-lg relative z-10"></div>
                <div class="flex justify-between items-center relative z-10">
                   <span class="text-[10px] font-black uppercase tracking-widest text-[#FFFFFF]">Pride Aurora</span>
                   <div *ngIf="themeService.currentTheme() === 'theme-pride'" class="w-2.5 h-2.5 rounded-full bg-[#FFFFFF] shadow-[0_0_10px_#FFFFFF]"></div>
                </div>
             </div>
          </div>
        </section>

        <!-- Privacy & UI Elements -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div class="card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 !py-10 shadow-sm">
              <div class="space-y-1">
                 <h2 class="text-sm font-black text-foreground uppercase tracking-tight">Privacy Obfuscation</h2>
                 <p class="text-[10px] font-bold text-subtle uppercase tracking-widest opacity-60">Blur all balance parameters on primary surfaces.</p>
              </div>
              <button 
                (click)="themeService.togglePrivacyMode()"
                [class.bg-primary]="themeService.isPrivacyModeActive()"
                class="w-14 h-7 bg-foreground/[0.1] border border-border rounded-full relative p-1 transition-all group overflow-hidden">
                 <div 
                   [class.translate-x-7]="themeService.isPrivacyModeActive()"
                   class="w-5 h-5 bg-white border border-border rounded-full shadow-lg transition-transform duration-300"></div>
                 <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
           </div>

           <div class="card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 !py-10 shadow-sm">
              <div class="space-y-1">
                 <h2 class="text-sm font-black text-foreground uppercase tracking-tight">Help Center Button</h2>
                 <p class="text-[10px] font-bold text-subtle uppercase tracking-widest opacity-60">Toggle visibility of the floating tutorial FAB.</p>
              </div>
              <button 
                (click)="tutorialService.toggleHelpButton(!tutorialService.helpButtonVisible())"
                [class.bg-primary]="tutorialService.helpButtonVisible()"
                class="w-14 h-7 bg-foreground/[0.1] border border-border rounded-full relative p-1 transition-all group overflow-hidden">
                 <div 
                   [class.translate-x-7]="tutorialService.helpButtonVisible()"
                   class="w-5 h-5 bg-white border border-border rounded-full shadow-lg transition-transform duration-300"></div>
              </button>
           </div>
        </section>

        <!-- Regional Configuration -->
        <section class="card space-y-8 shadow-sm">
           <header class="flex items-center space-x-3 opacity-60">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h2 class="text-[10px] font-black uppercase tracking-widest text-foreground">Regional Configuration</h2>
           </header>

           <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                 <label class="block text-[9px] font-black text-subtle uppercase tracking-widest mb-3 ml-1">Base Valuation Currency</label>
                 <div class="relative group">
                    <select class="input-premium w-full appearance-none pr-12 shadow-inner">
                       <option>MXN - Mexican Peso</option>
                       <option>USD - US Dollar</option>
                       <option>EUR - Euro</option>
                    </select>
                    <div class="absolute right-6 top-5 pointer-events-none text-subtle group-hover:text-primary transition-colors">
                       <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                 </div>
              </div>
              <div>
                 <label class="block text-[9px] font-black text-subtle uppercase tracking-widest mb-3 ml-1">Date Expression Format</label>
                 <div class="relative group">
                    <select class="input-premium w-full appearance-none pr-12 shadow-inner">
                       <option>DD/MM/YYYY</option>
                       <option>MM/DD/YYYY</option>
                       <option>YYYY-MM-DD</option>
                    </select>
                    <div class="absolute right-6 top-5 pointer-events-none text-subtle group-hover:text-primary transition-colors">
                       <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  `
})
export class PreferencesComponent {
  themeService = inject(ThemeService);
  tutorialService = inject(TutorialService);

  setTheme(theme: ThemeType) {
    this.themeService.setTheme(theme);
  }
}
