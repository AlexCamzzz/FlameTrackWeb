import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequestDto, RegisterRequestDto, AuthResponseDto, UserDto, UpdateUserRequestDto } from '../models/transaction.dto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = `${environment.apiUrl}/auth`;

  private readonly TOKEN_KEY = 'flametrack_token';
  private readonly REFRESH_TOKEN_KEY = 'flametrack_refresh_token';
  private readonly USER_KEY = 'flametrack_user';

  isAuthenticated = signal<boolean>(false);
  currentUser = signal<UserDto | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.TOKEN_KEY);
      const userJson = localStorage.getItem(this.USER_KEY);
      
      this.isAuthenticated.set(!!token);
      if (userJson) {
        try {
          this.currentUser.set(JSON.parse(userJson));
        } catch (e) {
          console.error('Error parsing user from storage', e);
        }
      }
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  async refreshToken() {
    if (!isPlatformBrowser(this.platformId)) return;
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      throw new Error('No refresh token available');
    }

    try {
      const response = await firstValueFrom(this.http.post<AuthResponseDto>(`${this.apiUrl}/refresh`, { refreshToken }));
      this.setSession(response);
      return response;
    } catch (error) {
      console.error('Refresh token failed', error);
      this.logout();
      throw error;
    }
  }

  async login(credentials: LoginRequestDto) {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const response = await firstValueFrom(this.http.post<AuthResponseDto>(`${this.apiUrl}/login`, credentials));
      this.setSession(response);
      return response;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }

  async register(data: RegisterRequestDto) {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const response = await firstValueFrom(this.http.post<AuthResponseDto>(`${this.apiUrl}/register`, data));
      this.setSession(response);
      return response;
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  }

  async updateProfile(data: UpdateUserRequestDto) {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const updatedUser = await firstValueFrom(this.http.put<UserDto>(`${this.apiUrl}/profile`, data));
      this.currentUser.set(updatedUser);
      localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Update profile failed', error);
      throw error;
    }
  }

  async acceptTerms() {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const updatedUser = await firstValueFrom(this.http.post<UserDto>(`${this.apiUrl}/accept-terms`, {}));
      this.currentUser.set(updatedUser);
      localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Accept terms failed', error);
      throw error;
    }
  }

  async deleteAccount() {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/profile`));
      this.logout();
    } catch (error) {
      console.error('Delete account failed', error);
      throw error;
    }
  }

  private setSession(auth: AuthResponseDto) {
    localStorage.setItem(this.TOKEN_KEY, auth.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, auth.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(auth.user));
    this.currentUser.set(auth.user);
    this.isAuthenticated.set(true);
    this.router.navigate(['/']);
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      this.currentUser.set(null);
      this.isAuthenticated.set(false);
      this.router.navigate(['/login']);
    }
  }
}
