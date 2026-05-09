import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { DebtDto, CreateDebtRequestDto, PayDebtRequestDto } from '../models/transaction.dto';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DebtService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = environment.apiUrl;

  private debtsSignal = signal<DebtDto[]>([]);
  debts = computed(() => this.debtsSignal());

  async loadDebts() {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const d = await firstValueFrom(this.http.get<DebtDto[]>(`${this.apiUrl}/debts`));
      this.debtsSignal.set(d);
    } catch (error) {
      console.error('Error loading debts', error);
    }
  }

  async createDebt(debt: CreateDebtRequestDto) {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const newDebt = await firstValueFrom(this.http.post<DebtDto>(`${this.apiUrl}/debts`, debt));
      this.debtsSignal.update(d => [...d, newDebt]);
      return newDebt;
    } catch (error) {
      console.error('Error creating debt', error);
      throw error;
    }
  }

  async payDebt(debtId: string, payRequest: PayDebtRequestDto) {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const updatedDebt = await firstValueFrom(this.http.post<DebtDto>(`${this.apiUrl}/debts/${debtId}/pay`, payRequest));
      this.debtsSignal.update(debts => debts.map(d => d.id === debtId ? updatedDebt : d));
      return updatedDebt;
    } catch (error) {
      console.error('Error paying debt', error);
      throw error;
    }
  }

  async deleteDebt(debtId: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/debts/${debtId}`));
      this.debtsSignal.update(debts => debts.filter(d => d.id !== debtId));
    } catch (error) {
      console.error('Error deleting debt', error);
      throw error;
    }
  }
}
