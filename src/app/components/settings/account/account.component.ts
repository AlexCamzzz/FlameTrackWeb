import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UpdateUserRequestDto, UserDto } from '../../../models/transaction.dto';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex gap-10 animate-fade-in">
      <!-- Internal Sidebar -->
      <aside class="w-64 space-y-2">
        <h2 class="text-xs font-black text-subtle uppercase tracking-[0.2em] mb-6 px-4">Account Settings</h2>
        <button (click)="activeSection = 'profile'" 
          [ngClass]="activeSection === 'profile' ? 'bg-primary/10 text-primary border-primary/20' : 'text-subtle hover:bg-white/5 border-transparent'"
          class="w-full flex items-center space-x-3 p-4 rounded-2xl border transition-all font-bold text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span>Personal Info</span>
        </button>
        <button (click)="activeSection = 'integrations'" 
          [ngClass]="activeSection === 'integrations' ? 'bg-primary/10 text-primary border-primary/20' : 'text-subtle hover:bg-white/5 border-transparent'"
          class="w-full flex items-center space-x-3 p-4 rounded-2xl border transition-all font-bold text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
          <span>Integrations</span>
        </button>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 max-w-2xl" *ngIf="authService.currentUser() as user">
        <div *ngIf="activeSection === 'profile'" class="space-y-8">
          <div class="card bg-[#2C2938]/40 border-white/5 p-8">
            <h3 class="text-xl font-black mb-8">Personal Information</h3>
            
            <div class="flex items-center space-x-8 mb-10">
              <div class="relative group">
                <div class="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary to-secondary p-1 shadow-2xl overflow-hidden">
                   <img *ngIf="user.avatar || editModel.avatar" [src]="editModel.avatar || user.avatar" class="w-full h-full object-cover rounded-[1.8rem]">
                   <div *ngIf="!user.avatar && !editModel.avatar" class="w-full h-full bg-[#1A1721] rounded-[1.8rem] flex items-center justify-center text-3xl font-black text-white">
                      {{ user.name.substring(0, 1) }}
                   </div>
                </div>
                <label class="absolute inset-0 flex items-center justify-center bg-black/60 rounded-[2rem] opacity-0 group-hover:opacity-100 cursor-pointer transition-all border border-white/20">
                   <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                   <input type="file" class="hidden" (change)="onFileSelected($event)" accept="image/*">
                </label>
              </div>
              <div>
                <h4 class="font-black text-lg">{{ user.name }}</h4>
                <p class="text-subtle text-sm">{{ user.email }}</p>
                <div class="mt-2 flex items-center space-x-2">
                   <span class="px-2 py-0.5 bg-income/10 text-income text-[10px] font-black uppercase rounded tracking-widest">Verified User</span>
                </div>
              </div>
            </div>

            <form (ngSubmit)="saveProfile()" class="space-y-6">
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-xs font-black text-subtle uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <input type="text" name="name" [(ngModel)]="editModel.name" class="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold focus:outline-none focus:border-primary transition-all">
                </div>
                <div>
                  <label class="block text-xs font-black text-subtle uppercase tracking-widest mb-2 ml-1">Nickname</label>
                  <input type="text" name="nickname" [(ngModel)]="editModel.nickname" class="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold focus:outline-none focus:border-primary transition-all" placeholder="e.g. Alex">
                </div>
              </div>

              <div>
                <label class="block text-xs font-black text-subtle uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <input type="email" [value]="user.email" disabled class="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-subtle font-bold cursor-not-allowed">
                <p class="text-[10px] text-subtle mt-2 ml-1">* Email cannot be changed for security reasons.</p>
              </div>

              <div class="pt-4">
                <button type="submit" [disabled]="isSaving" class="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-2xl px-8 py-4 font-black transition-all shadow-xl shadow-primary/20 disabled:opacity-50">
                  {{ isSaving ? 'SAVING CHANGES...' : 'SAVE CHANGES' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div *ngIf="activeSection === 'integrations'" class="space-y-6 animate-fade-in">
           <div class="card bg-[#2C2938]/40 border-white/5 p-8 text-center py-20">
              <div class="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                 <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 class="text-xl font-black mb-2">Automated Integrations</h3>
              <p class="text-subtle max-w-sm mx-auto font-medium">Connect your bank accounts or apps to synchronize transactions automatically.</p>
              <button class="mt-8 px-8 py-3 bg-white/5 border border-white/10 rounded-2xl font-black text-sm text-white hover:bg-white/10 transition-all">COMING SOON</button>
           </div>
        </div>
      </main>
    </div>
  `
})
export class AccountComponent implements OnInit {
  authService = inject(AuthService);
  
  activeSection = 'profile';
  isSaving = false;

  editModel: UpdateUserRequestDto = {
    name: '',
    nickname: '',
    avatar: undefined
  };

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.editModel.name = user.name;
      this.editModel.nickname = user.nickname || '';
      this.editModel.avatar = user.avatar;
    }
  }

  async saveProfile() {
    if (!this.editModel.name) return;
    
    this.isSaving = true;
    try {
      await this.authService.updateProfile(this.editModel);
      alert('Profile updated successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to update profile.');
    } finally {
      this.isSaving = false;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editModel.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
