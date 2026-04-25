import { environment } from '../../environments/environment';
import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BudgetDto, CreateBudgetRequestDto } from '../models/transaction.dto';
import { firstValueFrom } from 'rxjs';

/** Service to manage budget allocations */
@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = `${environment.apiUrl}`;

  private budgetsSignal = signal<BudgetDto[]>([]);
  budgets = computed(() => this.budgetsSignal());

  async loadBudgets(month: number = 0, year: number = 0) {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const qs = (month > 0 && year > 0) ? `?month=${month}&year=${year}` : '';
      const b = await firstValueFrom(this.http.get<BudgetDto[]>(`${this.apiUrl}/budgets${qs}`));
      this.budgetsSignal.set(b);
    } catch (error) {
      console.error('Error loading budgets', error);
    }
  }

  async createBudget(budget: CreateBudgetRequestDto) {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const newBudget = await firstValueFrom(this.http.post<BudgetDto>(`${this.apiUrl}/budgets`, budget));
      this.budgetsSignal.update(b => [...b, newBudget]);
      return newBudget;
    } catch (error) {
      console.error('Error creating budget', error);
      throw error;
    }
  }
}
