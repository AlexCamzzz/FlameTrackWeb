import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { GoalDto } from '../models/transaction.dto';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = 'http://localhost:7071/api';

  private goalsSignal = signal<GoalDto[]>([]);
  goals = computed(() => this.goalsSignal());

  async loadGoals() {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const g = await firstValueFrom(this.http.get<GoalDto[]>(`${this.apiUrl}/goals`));
      this.goalsSignal.set(g);
    } catch (error) {
      console.error('Error loading goals', error);
    }
  }

  async createGoal(goal: Omit<GoalDto, 'id'>) {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const newGoal = await firstValueFrom(this.http.post<GoalDto>(`${this.apiUrl}/goals`, goal));
      this.goalsSignal.update(g => [...g, newGoal]);
      return newGoal;
    } catch (error) {
      console.error('Error creating goal', error);
      throw error;
    }
  }

  async depositToGoal(goalId: string, amount: number) {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const updatedGoal = await firstValueFrom(this.http.post<GoalDto>(`${this.apiUrl}/goals/${goalId}/deposit`, { amount }));
      this.goalsSignal.update(goals => goals.map(g => g.id === goalId ? updatedGoal : g));
      return updatedGoal;
    } catch (error) {
      console.error('Error depositing to goal', error);
      throw error;
    }
  }
}
