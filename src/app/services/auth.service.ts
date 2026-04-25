import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = 'http://localhost:7071/api/auth';

  private readonly TOKEN_KEY = 'flametrack_token';

  isAuthenticated = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.isAuthenticated.set(!!localStorage.getItem(this.TOKEN_KEY));
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  async login(credentials: any) {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const response = await firstValueFrom(this.http.post<any>(`${this.apiUrl}/login`, credentials));
      localStorage.setItem(this.TOKEN_KEY, response.token);
      this.isAuthenticated.set(true);
      this.router.navigate(['/']);
      return response;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }

  async register(data: any) {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const response = await firstValueFrom(this.http.post<any>(`${this.apiUrl}/register`, data));
      localStorage.setItem(this.TOKEN_KEY, response.token);
      this.isAuthenticated.set(true);
      this.router.navigate(['/']);
      return response;
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      this.isAuthenticated.set(false);
      this.router.navigate(['/login']);
    }
  }
}
