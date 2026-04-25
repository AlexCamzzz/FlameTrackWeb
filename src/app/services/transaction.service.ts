import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { TransactionDto, DashboardSummaryDto, CreateTransactionRequestDto } from '../models/transaction.dto';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = 'http://localhost:7071/api'; // Local Azure Functions port

  // Signals for State Management
  private summarySignal = signal<DashboardSummaryDto | null>(null);
  private transactionsSignal = signal<TransactionDto[]>([]);

  // Public Read-only Signals
  summary = computed(() => this.summarySignal());
  transactions = computed(() => this.transactionsSignal());

  async loadDashboardSummary() {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const summary = await firstValueFrom(this.http.get<DashboardSummaryDto>(`${this.apiUrl}/dashboard/summary`));
      this.summarySignal.set(summary);
    } catch (error) {
      console.error('Error loading dashboard summary', error);
    }
  }

  async loadTransactions() {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const txs = await firstValueFrom(this.http.get<TransactionDto[]>(`${this.apiUrl}/transactions`));
      this.transactionsSignal.set(txs);
    } catch (error) {
      console.error('Error loading transactions', error);
    }
  }

  async createTransaction(request: CreateTransactionRequestDto) {
    if (!isPlatformBrowser(this.platformId)) throw new Error('Cannot create transaction during SSR');
    try {
      const newTx = await firstValueFrom(this.http.post<TransactionDto>(`${this.apiUrl}/transactions`, request));
      this.transactionsSignal.update(txs => [newTx, ...txs]);
      // Refresh summary after new transaction
      await this.loadDashboardSummary();
      return newTx;
    } catch (error) {
      console.error('Error creating transaction', error);
      throw error;
    }
  }
}
