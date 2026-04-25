import { environment } from '../../environments/environment';
import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { CategoryDto } from '../models/transaction.dto';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = `${environment.apiUrl}`;

  private categoriesSignal = signal<CategoryDto[]>([]);
  categories = computed(() => this.categoriesSignal());

  async loadCategories() {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const c = await firstValueFrom(this.http.get<CategoryDto[]>(`${this.apiUrl}/categories`));
      this.categoriesSignal.set(c);
    } catch (error) {
      console.error('Error loading categories', error);
    }
  }

  async createCategory(name: string, color?: string): Promise<CategoryDto | undefined> {
    if (!isPlatformBrowser(this.platformId)) return undefined;
    try {
      const payload = color ? { name, color } : { name };
      const newCategory = await firstValueFrom(this.http.post<CategoryDto>(`${this.apiUrl}/categories`, payload));
      this.categoriesSignal.update(c => [...c, newCategory]);
      return newCategory;
    } catch (error) {
      console.error('Error creating category', error);
      return undefined;
    }
  }

  async deleteCategory(id: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/categories/${id}`));
      this.categoriesSignal.update(c => c.filter(cat => cat.id !== id));
    } catch (error) {
      console.error('Error deleting category', error);
      throw error;
    }
  }

  getCategoryColor(id: string) {
    return this.categories().find(c => c.id === id)?.color || '#808080';
  }

  getCategoryName(id: string) {
    return this.categories().find(c => c.id === id)?.name || 'Unknown';
  }
}
