import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { AccountDto, CreateAccountRequestDto, UpdateAccountRequestDto } from '../models/transaction.dto';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = `${environment.apiUrl}/accounts`;

  private accountsSignal = signal<AccountDto[]>([]);
  accounts = computed(() => this.accountsSignal());

  async loadAccounts() {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const accs = await firstValueFrom(this.http.get<AccountDto[]>(this.apiUrl));
      this.accountsSignal.set(accs);
    } catch (error) {
      console.error('Error loading accounts', error);
    }
  }

  getAccountName(id: string): string {
    return this.accounts().find(a => a.id === id)?.name || 'Unknown';
  }

  getAccountColor(id: string): string {
    return this.accounts().find(a => a.id === id)?.color || '#808080';
  }

  async createAccount(acc: CreateAccountRequestDto) {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const newAcc = await firstValueFrom(this.http.post<AccountDto>(this.apiUrl, acc));
      this.accountsSignal.update(curr => [...curr, newAcc]);
      return newAcc;
    } catch (error) {
      console.error('Error creating account', error);
      throw error;
    }
  }

  async archiveAccount(id: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
      this.accountsSignal.update(curr => curr.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error archiving account', error);
      throw error;
    }
  }
}
