import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { TransactionDto, CreateTransactionRequestDto, DashboardSummaryDto, PaginatedResponseDto } from '../models/transaction.dto';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = environment.apiUrl;

  private transactionsSignal = signal<TransactionDto[]>([]);
  transactions = computed(() => this.transactionsSignal());

  private totalCountSignal = signal<number>(0);
  totalCount = computed(() => this.totalCountSignal());

  private summarySignal = signal<DashboardSummaryDto | null>(null);
  summary = computed(() => this.summarySignal());

  async loadTransactions(page: number = 1, pageSize: number = 20) {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const response = await firstValueFrom(this.http.get<PaginatedResponseDto<TransactionDto>>(`${this.apiUrl}/transactions`, {
        params: { page, pageSize }
      }));
      this.transactionsSignal.set(response.items);
      this.totalCountSignal.set(response.totalCount);
    } catch (error) {
      console.error('Error loading transactions', error);
    }
  }

  async loadDashboardSummary() {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const s = await firstValueFrom(this.http.get<DashboardSummaryDto>(`${this.apiUrl}/dashboard/summary`));
      this.summarySignal.set(s);
    } catch (error) {
      console.error('Error loading summary', error);
    }
  }

  async createTransaction(tx: CreateTransactionRequestDto) {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const newTx = await firstValueFrom(this.http.post<TransactionDto>(`${this.apiUrl}/transactions`, tx));
      this.transactionsSignal.update(txs => [newTx, ...txs]);
      return newTx;
    } catch (error) {
      console.error('Error creating transaction', error);
      throw error;
    }
  }

  async deleteTransaction(id: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/transactions/${id}`));
      this.transactionsSignal.update(txs => txs.filter(t => t.id !== id));
      // Optionally reload summary
      this.loadDashboardSummary();
    } catch (error) {
      console.error('Error deleting transaction', error);
      throw error;
    }
  }
}
