import { environment } from '../../environments/environment';
import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { TransferDto, CreateTransferRequestDto } from '../models/transaction.dto';
import { firstValueFrom } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private accountService = inject(AccountService);
  private apiUrl = `${environment.apiUrl}/transfers`;

  private transfersSignal = signal<TransferDto[]>([]);
  transfers = computed(() => this.transfersSignal());

  async loadTransfers() {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const t = await firstValueFrom(this.http.get<TransferDto[]>(this.apiUrl));
      this.transfersSignal.set(t);
    } catch (error) {
      console.error('Error loading transfers', error);
    }
  }

  async createTransfer(request: CreateTransferRequestDto) {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const newTransfer = await firstValueFrom(this.http.post<TransferDto>(this.apiUrl, request));
      this.transfersSignal.update(trfs => [newTransfer, ...trfs]);
      // Refresh accounts as balance changed
      await this.accountService.loadAccounts();
      return newTransfer;
    } catch (error) {
      console.error('Error creating transfer', error);
      throw error;
    }
  }
}
