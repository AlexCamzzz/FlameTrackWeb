import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl animate-fade-in">
      <header class="mb-10">
        <h1 class="text-4xl font-black tracking-tight text-white mb-2">Preferences</h1>
        <p class="text-subtle font-medium">Customize your FlameTrack experience.</p>
      </header>

      <div class="space-y-8">
        <!-- Appearance -->
        <section class="card bg-[#2C2938]/40 border-white/5 p-8">
          <h3 class="text-lg font-black mb-6 flex items-center space-x-3">
             <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.828 2.828a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
             <span>Appearance & Theme</span>
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div class="p-4 bg-black/20 border-2 border-primary rounded-[1.5rem] text-center cursor-pointer">
                <div class="w-full h-12 bg-[#1A1721] rounded-lg mb-3 shadow-inner"></div>
                <span class="text-xs font-black uppercase tracking-widest text-white">Default Dark</span>
             </div>
             <div class="p-4 bg-black/20 border border-white/5 rounded-[1.5rem] text-center cursor-pointer hover:border-white/10 transition-all opacity-50 grayscale">
                <div class="w-full h-12 bg-white rounded-lg mb-3 shadow-inner"></div>
                <span class="text-xs font-black uppercase tracking-widest">Light Mode</span>
             </div>
             <div class="p-4 bg-black/20 border border-white/5 rounded-[1.5rem] text-center cursor-pointer hover:border-white/10 transition-all">
                <div class="w-full h-12 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg mb-3 shadow-inner"></div>
                <span class="text-xs font-black uppercase tracking-widest">Midnight</span>
             </div>
          </div>
        </section>

        <!-- Privacy -->
        <section class="card bg-[#2C2938]/40 border-white/5 p-8">
           <div class="flex items-center justify-between">
              <div>
                 <h3 class="text-lg font-black text-white">Privacy Mode</h3>
                 <p class="text-sm text-subtle font-medium">Blur balances and amounts on the main dashboard.</p>
              </div>
              <button class="w-14 h-8 bg-black/40 rounded-full relative p-1 transition-all">
                 <div class="w-6 h-6 bg-subtle rounded-full shadow-lg"></div>
              </button>
           </div>
        </section>

        <!-- Localization -->
        <section class="card bg-[#2C2938]/40 border-white/5 p-8">
           <h3 class="text-lg font-black mb-6">Regional Settings</h3>
           <div class="grid grid-cols-2 gap-8">
              <div>
                 <label class="block text-xs font-black text-subtle uppercase tracking-widest mb-3">Base Currency</label>
                 <select class="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold focus:outline-none focus:border-primary appearance-none">
                    <option>MXN - Mexican Peso</option>
                    <option>USD - US Dollar</option>
                    <option>EUR - Euro</option>
                 </select>
              </div>
              <div>
                 <label class="block text-xs font-black text-subtle uppercase tracking-widest mb-3">Date Format</label>
                 <select class="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold focus:outline-none focus:border-primary appearance-none">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                 </select>
              </div>
           </div>
        </section>
      </div>
    </div>
  `
})
export class PreferencesComponent {}
