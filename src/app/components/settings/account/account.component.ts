import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { TutorialService } from '../../../services/tutorial.service';
import { UpdateUserRequestDto, UserDto } from '../../../models/transaction.dto';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 animate-fade-in pb-12">
      <!-- Meticulous Theme-Aware Sidebar -->
      <aside class="w-full lg:w-64 flex-shrink-0">
        <div class="mb-6 px-1 lg:px-4 flex items-center space-x-3">
           <div>
              <h1 class="text-xl md:text-2xl font-black text-foreground uppercase tracking-widest">Settings</h1>
              <div class="h-1 w-6 bg-primary mt-2"></div>
           </div>
           <button (click)="tutorial.start()" class="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all text-[10px] font-black border border-primary/20">?</button>
        </div>
        <nav class="flex lg:flex-col bg-foreground/[0.03] lg:bg-transparent p-1 lg:p-0 rounded-2xl border border-border lg:border-none overflow-x-auto no-scrollbar gap-1">
          <button (click)="activeSection = 'profile'" 
            [class.bg-primary]="activeSection === 'profile'" [class.text-white]="activeSection === 'profile'"
            [class.bg-foreground/[0.05]]="activeSection !== 'profile' && !isMobile()"
            [class.text-subtle]="activeSection !== 'profile'"
            class="flex-1 lg:flex-none flex items-center justify-center lg:justify-start space-x-3 p-3 lg:p-4 rounded-xl lg:rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest whitespace-nowrap hover:text-foreground active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span>Identity</span>
          </button>
          <button (click)="activeSection = 'integrations'" 
            [class.bg-primary]="activeSection === 'integrations'" [class.text-white]="activeSection === 'integrations'"
            [class.bg-foreground/[0.05]]="activeSection !== 'integrations' && !isMobile()"
            [class.text-subtle]="activeSection !== 'integrations'"
            class="flex-1 lg:flex-none flex items-center justify-center lg:justify-start space-x-3 p-3 lg:p-4 rounded-xl lg:rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest whitespace-nowrap hover:text-foreground active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
            <span>Network</span>
          </button>
        </nav>
      </aside>

      <!-- Main Config Surface -->
      <main class="flex-1" *ngIf="authService.currentUser() as user">
        @if (activeSection === 'profile') {
          <div class="card space-y-8 md:space-y-10 animate-fade-in shadow-sm" data-tutorial="profile-card">
            <div class="flex flex-col md:flex-row items-center md:items-center space-y-6 md:space-y-0 md:space-x-10 pb-10 border-b border-border text-center md:text-left">
              <div class="relative group flex-shrink-0">
                <div class="w-24 h-24 rounded-3xl bg-foreground/[0.03] border border-border p-1 shadow-inner overflow-hidden flex items-center justify-center relative">
                   <div *ngIf="isUploading" class="absolute inset-0 z-20 bg-background/60 flex items-center justify-center backdrop-blur-sm">
                      <div class="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                   </div>
                   <img *ngIf="user.avatar || editModel.avatar" [src]="editModel.avatar || user.avatar" class="w-full h-full object-cover rounded-[1.3rem]">
                   <div *ngIf="!user.avatar && !editModel.avatar" class="w-full h-full bg-foreground/[0.05] rounded-[1.3rem] flex items-center justify-center text-4xl font-black text-subtle opacity-30">
                      {{ user.name.substring(0, 1) }}
                   </div>
                </div>
                <label class="absolute inset-1 flex items-center justify-center bg-black/60 rounded-[1.3rem] opacity-0 group-hover:opacity-100 cursor-pointer transition-all border border-white/10 backdrop-blur-sm z-30">
                   <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                   <input type="file" class="hidden" (change)="onFileSelected($event)" accept="image/*" [disabled]="isUploading">
                </label>
              </div>
              <div class="space-y-1">
                <h4 class="text-xl md:text-2xl font-black text-foreground uppercase tracking-tight">{{ user.name }}</h4>
                <p class="text-subtle text-xs font-bold uppercase tracking-widest opacity-60">{{ user.email }}</p>
                <div class="pt-3">
                   <span class="px-2.5 py-1 bg-income/10 border border-income/20 text-income-label text-[9px] font-black uppercase rounded-lg tracking-widest shadow-sm">Authenticated Account</span>
                </div>
              </div>
            </div>

            <form (ngSubmit)="saveProfile()" class="space-y-6 md:space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label class="block text-[10px] font-black text-subtle uppercase tracking-widest mb-3 ml-1">Legal Name</label>
                  <input type="text" name="name" [(ngModel)]="editModel.name" class="input-premium w-full shadow-inner">
                </div>
                <div>
                  <label class="block text-[10px] font-black text-subtle uppercase tracking-widest mb-3 ml-1">Display Alias</label>
                  <input type="text" name="nickname" [(ngModel)]="editModel.nickname" class="input-premium w-full shadow-inner" placeholder="E.g. Alexander">
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-black text-subtle uppercase tracking-widest mb-3 ml-1">Security Identifier</label>
                <div class="w-full bg-foreground/[0.03] border border-border rounded-2xl px-6 py-4 text-subtle font-bold opacity-60 flex items-center space-x-3 shadow-inner cursor-not-allowed overflow-hidden">
                   <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                   <span class="truncate text-xs">{{ user.email }}</span>
                </div>
              </div>

              <div class="pt-4 flex flex-col md:flex-row md:items-center gap-4">
                <button type="submit" [disabled]="isSaving || isUploading" class="btn-premium w-full md:w-auto md:px-12 py-5 shadow-lg shadow-primary/10">
                  {{ isSaving ? 'Syncing...' : 'Save Settings' }}
                </button>
                <button type="button" (click)="onDeleteAccount()" class="px-8 py-4 border border-expense/20 text-expense text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-expense/5 transition-all">
                  Terminate Identity
                </button>
              </div>
            </form>
          </div>
        }

        @if (activeSection === 'integrations') {
          <div class="card space-y-8 animate-fade-in shadow-sm">
             <div class="flex items-center space-x-4 mb-2">
                <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                   <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                   <h3 class="text-[10px] font-black text-foreground uppercase tracking-widest">Neural Link</h3>
                   <p class="text-subtle text-[9px] font-bold uppercase tracking-widest opacity-60">AI Financial Advisory</p>
                </div>
             </div>

             <div class="bg-foreground/[0.02] border border-border rounded-2xl p-6 md:p-8 space-y-6">
                <p class="text-subtle text-xs font-bold leading-relaxed opacity-80">
                   Connect your own <span class="text-foreground">OpenAI</span> intelligence core to receive personalized financial insights. Your data stays on your terms.
                </p>

                <div class="space-y-4">
                   <label class="block text-[10px] font-black text-subtle uppercase tracking-widest ml-1">OpenAI API Key</label>
                   <div class="relative">
                      <input [type]="showApiKey ? 'text' : 'password'" name="aiApiKey" [(ngModel)]="editModel.aiApiKey" 
                        class="input-premium w-full shadow-inner pr-12" placeholder="sk-...">
                      <button type="button" (click)="showApiKey = !showApiKey" class="absolute right-4 top-1/2 -translate-y-1/2 text-subtle hover:text-foreground transition-colors">
                         <svg *ngIf="!showApiKey" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                         <svg *ngIf="showApiKey" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                      </button>
                   </div>
                   <p class="text-[9px] text-subtle font-bold italic opacity-60">We do not store your key in plaintext. It is used only to authenticate requests to OpenAI.</p>
                </div>

                <div class="pt-4">
                   <button (click)="saveProfile()" [disabled]="isSaving" class="btn-premium w-full md:w-auto md:px-12 py-5 shadow-lg shadow-primary/10">
                      {{ isSaving ? 'Syncing...' : 'Save AI Credentials' }}
                   </button>
                </div>
             </div>

             <div class="p-10 text-center border-dashed border-border border rounded-2xl opacity-40 grayscale">
                <h3 class="text-xs font-black text-foreground uppercase tracking-[0.3em] mb-2">Banking Sync</h3>
                <p class="text-subtle text-[10px] font-bold uppercase tracking-widest leading-relaxed">Plaid / Salt Edge link in development.</p>
             </div>
          </div>
        }
      </main>
    </div>
  `
})
export class AccountComponent implements OnInit {
  authService = inject(AuthService);
  protected tutorial = inject(TutorialService);
  private cdr = inject(ChangeDetectorRef);
  
  activeSection = 'profile';
  isSaving = false;
  isUploading = false;
  showApiKey = false;

  editModel: UpdateUserRequestDto = {
    name: '',
    nickname: '',
    avatar: undefined,
    aiApiKey: ''
  };

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.editModel.name = user.name;
      this.editModel.nickname = user.nickname || '';
      this.editModel.avatar = user.avatar;
      this.editModel.aiApiKey = user.aiApiKey || '';
    }
  }

  isMobile() {
    return typeof window !== 'undefined' && window.innerWidth < 1024;
  }

  async saveProfile() {
    if (!this.editModel.name) return;
    
    this.isSaving = true;
    this.cdr.detectChanges();
    try {
      await this.authService.updateProfile(this.editModel);
    } catch (e) {
      console.error(e);
      alert('Error updating security parameters.');
    } finally {
      this.isSaving = false;
      this.cdr.detectChanges();
    }
  }

  async onDeleteAccount() {
    if (confirm('CRITICAL: This will permanently purge all your financial data, accounts, and identity records. Proceed?')) {
      try {
        await this.authService.deleteAccount();
      } catch (e) {
        console.error(e);
        alert('Termination sequence failed.');
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('File too large (Max 1MB).');
        return;
      }
      
      this.isUploading = true;
      this.cdr.detectChanges();

      const reader = new FileReader();
      reader.onload = async (e: any) => {
        this.editModel.avatar = e.target.result;
        this.cdr.detectChanges();
        
        // Auto-save for better UX
        try {
          await this.saveProfile();
        } finally {
          this.isUploading = false;
          this.cdr.detectChanges();
        }
      };
      reader.readAsDataURL(file);
    }
  }
}
