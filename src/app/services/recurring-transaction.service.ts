import { environment } from '../../environments/environment';
import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { RecurringTransactionDto, CreateRecurringTransactionRequestDto } from '../models/transaction.dto';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecurringTransactionService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = `${environment.apiUrl}`;

  private recurringSignal = signal<RecurringTransactionDto[]>([]);
  recurringTransactions = computed(() => this.recurringSignal());

  async loadRecurring() {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const items = await firstValueFrom(this.http.get<RecurringTransactionDto[]>(`${this.apiUrl}/recurring`));
      this.recurringSignal.set(items);
    } catch (error) {
      console.error('Error loading recurring transactions', error);
    }
  }

  async createRecurring(request: CreateRecurringTransactionRequestDto) {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const newItem = await firstValueFrom(this.http.post<RecurringTransactionDto>(`${this.apiUrl}/recurring`, request));
      this.recurringSignal.update(items => [...items, newItem]);
      return newItem;
    } catch (error) {
      console.error('Error creating recurring transaction', error);
      throw error;
    }
  }

  async deleteRecurring(id: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/recurring/${id}`));
      this.recurringSignal.update(items => items.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting recurring transaction', error);
      throw error;
    }
  }
}
