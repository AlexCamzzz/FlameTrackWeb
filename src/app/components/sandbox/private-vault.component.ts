import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark, heroLockClosed, heroLockOpen, heroPlus, heroTrash, heroClipboardDocument, heroShieldExclamation, heroExclamationTriangle } from '@ng-icons/heroicons/outline';
import { VaultService, VaultItem } from '../../services/vault.service';

@Component({
  selector: 'app-private-vault',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  providers: [provideIcons({ heroXMark, heroLockClosed, heroLockOpen, heroPlus, heroTrash, heroClipboardDocument, heroShieldExclamation, heroExclamationTriangle })],
  template: `
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" (click)="close.emit()">
      <div class="card !p-0 w-full max-w-lg overflow-hidden animate-slide-up border-border shadow-2xl" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="p-8 border-b border-border flex justify-between items-center bg-foreground/[0.02]">
          <div class="space-y-1">
            <h2 class="text-xl font-black text-foreground uppercase tracking-tight flex items-center space-x-2">
              <ng-icon [name]="vaultService.isLocked() ? 'heroLockClosed' : 'heroLockOpen'" class="text-primary"></ng-icon>
              <span>Private Vault</span>
            </h2>
            <p class="text-[10px] font-black text-subtle uppercase tracking-[0.2em]">Secure Reference Storage</p>
          </div>
          <button (click)="close.emit()" class="w-10 h-10 bg-foreground/[0.05] rounded-2xl hover:bg-foreground/[0.1] text-foreground transition-all flex items-center justify-center border border-border">
            <ng-icon name="heroXMark" size="1.2rem"></ng-icon>
          </button>
        </div>

        <!-- Locked View (PIN Entry or Setup) -->
        <div *ngIf="vaultService.isLocked()" class="p-10 space-y-8 text-center">
          <div class="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-4 animate-pulse">
            <ng-icon name="heroLockClosed" size="2.5rem"></ng-icon>
          </div>
          
          <div class="space-y-2">
            <h3 class="text-lg font-black text-foreground uppercase tracking-tight">
              {{ vaultService.hasPin() ? 'Enter Access PIN' : 'Initialize Vault' }}
            </h3>
            <p class="text-[11px] font-medium text-subtle">
              {{ vaultService.hasPin() ? 'Provide your 4-digit security code to reveal sensitive data.' : 'Set a 4-digit PIN to secure your payment references.' }}
            </p>
          </div>

          <div class="flex justify-center space-x-4">
             <input #pinInput type="password" maxlength="4" [(ngModel)]="pin" 
               class="w-48 text-center text-3xl font-black tracking-[1em] py-4 bg-foreground/[0.03] border-2 border-border rounded-3xl focus:border-primary transition-all outline-none"
               (keyup.enter)="onPinSubmit()"
               placeholder="****">
          </div>

          <button (click)="onPinSubmit()" 
                  [disabled]="pin.length !== 4"
                  class="btn-premium w-full py-5 shadow-xl shadow-primary/20">
            {{ vaultService.hasPin() ? 'Unlock Dimension' : 'Arm Security' }}
          </button>

          <p *ngIf="error()" class="text-[10px] font-black text-expense uppercase tracking-widest animate-bounce">
            Invalid security sequence. Access denied.
          </p>
        </div>

        <!-- Unlocked View (Items List) -->
        <div *ngIf="!vaultService.isLocked()" class="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          
          <!-- Disclaimer -->
          <div class="p-4 rounded-2xl bg-expense/5 border border-expense/10 flex items-start space-x-3 mb-2">
            <ng-icon name="heroExclamationTriangle" class="text-expense text-xl flex-shrink-0 mt-0.5"></ng-icon>
            <div class="space-y-1">
              <p class="text-[10px] font-black text-expense uppercase tracking-widest">Security Advisory</p>
              <p class="text-[9px] font-bold text-expense/70 leading-relaxed uppercase">
                This vault is stored locally in your browser. Clearing cache or data will purge these records. Never store passwords or high-security credentials here. Use with caution.
              </p>
            </div>
          </div>

          <!-- Add New Item Form -->
          <div *ngIf="showAddForm()" class="p-6 rounded-3xl bg-foreground/[0.03] border border-border space-y-4 animate-slide-up">
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col space-y-1">
                <label class="text-[9px] font-black text-subtle uppercase ml-1">Label</label>
                <input [(ngModel)]="newItem.label" placeholder="e.g. CLABE, Account #" class="input-premium py-3 text-xs">
              </div>
              <div class="flex flex-col space-y-1">
                <label class="text-[9px] font-black text-subtle uppercase ml-1">Name / Entity</label>
                <input [(ngModel)]="newItem.name" placeholder="e.g. My Bank, John Doe" class="input-premium py-3 text-xs">
              </div>
            </div>
            <div class="flex flex-col space-y-1">
              <label class="text-[9px] font-black text-subtle uppercase ml-1">Reference Value</label>
              <input [(ngModel)]="newItem.value" placeholder="The actual number or code" class="input-premium py-3 text-xs">
            </div>
            <div class="flex gap-3 pt-2">
              <button (click)="showAddForm.set(false)" class="btn-secondary flex-1 py-3 text-[10px]">Cancel</button>
              <button (click)="saveItem()" [disabled]="!newItem.name || !newItem.value" class="btn-premium flex-1 py-3 text-[10px]">Save Ref</button>
            </div>
          </div>

          <div class="space-y-3">
             <div *ngIf="vaultService.items().length === 0 && !showAddForm()" class="p-12 text-center border-2 border-dashed border-border rounded-[2rem] space-y-4">
               <p class="text-subtle text-[10px] font-black uppercase tracking-widest">Vault is empty</p>
               <button (click)="showAddForm.set(true)" class="btn-secondary py-3 px-6 text-[10px]">Add First Reference</button>
             </div>

             <div *ngFor="let item of vaultService.items()" class="group grid grid-cols-[1fr_auto_auto] items-center gap-4 p-5 bg-surface border border-border rounded-2xl hover:border-primary/30 transition-all">
                <div class="space-y-1 min-w-0">
                  <div class="flex items-center space-x-2">
                    <span *ngIf="item.label" class="text-[8px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase tracking-tighter">{{ item.label }}</span>
                    <h4 class="text-[11px] font-black text-foreground uppercase tracking-tight truncate">{{ item.name }}</h4>
                  </div>
                  <p class="text-sm font-mono font-bold text-subtle tracking-tighter truncate">{{ item.value }}</p>
                </div>

                <button (click)="copyToClipboard(item.value)" class="w-10 h-10 rounded-xl bg-foreground/[0.05] text-subtle hover:text-primary transition-all flex items-center justify-center border border-border">
                  <ng-icon name="heroClipboardDocument"></ng-icon>
                </button>

                <button (click)="vaultService.removeItem(item.id)" class="w-10 h-10 rounded-xl bg-expense/10 text-expense hover:bg-expense hover:text-white transition-all flex items-center justify-center border border-expense/20">
                  <ng-icon name="heroTrash"></ng-icon>
                </button>
             </div>
          </div>

          <div class="pt-4 border-t border-border flex justify-between items-center">
            <button (click)="vaultService.lock()" class="text-[10px] font-black text-subtle uppercase hover:text-primary transition-colors flex items-center space-x-2">
              <ng-icon name="heroLockClosed"></ng-icon>
              <span>Seal Vault</span>
            </button>
            <button *ngIf="!showAddForm()" (click)="showAddForm.set(true)" class="btn-premium py-3 px-6 text-[10px]">Add New</button>
            <button (click)="onResetVault()" class="text-[9px] font-black text-expense/50 uppercase hover:text-expense transition-colors">Destruct Vault</button>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.2, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class PrivateVaultComponent {
  vaultService = inject(VaultService);
  close = new EventEmitter<void>();

  pin = '';
  error = signal(false);
  showAddForm = signal(false);

  newItem = {
    label: '',
    name: '',
    value: ''
  };

  onPinSubmit() {
    if (this.pin.length !== 4) return;

    if (!this.vaultService.hasPin()) {
      this.vaultService.setupPin(this.pin);
      this.pin = '';
    } else {
      const success = this.vaultService.unlock(this.pin);
      if (success) {
        this.pin = '';
        this.error.set(false);
      } else {
        this.error.set(true);
        this.pin = '';
        setTimeout(() => this.error.set(false), 2000);
      }
    }
  }

  saveItem() {
    if (this.newItem.name && this.newItem.value) {
      this.vaultService.addItem({
        name: this.newItem.name,
        value: this.newItem.value,
        label: this.newItem.label || undefined
      });
      this.newItem = { label: '', name: '', value: '' };
      this.showAddForm.set(false);
    }
  }

  copyToClipboard(val: string) {
    navigator.clipboard.writeText(val);
    // Maybe show a toast here? Assuming the user has a toast system.
  }

  onResetVault() {
    if (confirm('CAUTION: This will permanently destroy all records in your private vault. This action is irreversible. Proceed?')) {
      this.vaultService.reset();
    }
  }
}
