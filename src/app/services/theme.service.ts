import { Injectable, signal, inject, PLATFORM_ID, RendererFactory2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeType = 'default-dark' | 'theme-nord' | 'theme-deep-midnight' | 'theme-sakura' | 'theme-forest' | 'theme-pride';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private rendererFactory = inject(RendererFactory2);
  private renderer = this.rendererFactory.createRenderer(null, null);

  private currentThemeSignal = signal<ThemeType>('default-dark');
  currentTheme = this.currentThemeSignal.asReadonly();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('flametrack_theme') as ThemeType;
      if (savedTheme) {
        this.setTheme(savedTheme);
      }
    }
  }

  setTheme(theme: ThemeType) {
    if (!isPlatformBrowser(this.platformId)) return;

    // Remove all theme classes
    const themes: ThemeType[] = ['theme-nord', 'theme-deep-midnight', 'theme-sakura', 'theme-forest', 'theme-pride'];
    themes.forEach(t => this.renderer.removeClass(document.body, t));

    // Add new theme class
    if (theme !== 'default-dark') {
      this.renderer.addClass(document.body, theme);
    }

    this.currentThemeSignal.set(theme);
    localStorage.setItem('flametrack_theme', theme);
  }
}
