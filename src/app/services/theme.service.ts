import { Injectable, signal, computed, inject, PLATFORM_ID, RendererFactory2, effect } from '@angular/core';
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

  isPrivacyModeActive = signal<boolean>(false);

  currentLogo = computed(() => {
    switch (this.currentThemeSignal()) {
      case 'theme-nord': return '/assets/Blue FT.svg';
      case 'theme-deep-midnight': return '/assets/Red FT.svg';
      case 'theme-sakura': return '/assets/Pink FT.svg';
      case 'theme-forest': return '/assets/Green FT.svg';
      case 'theme-pride': return '/assets/Rainbow FT.svg';
      default: return '/assets/Orange FT.svg';
    }
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('flametrack_theme') as ThemeType;
      if (savedTheme) this.setTheme(savedTheme);

      const savedPrivacy = localStorage.getItem('flametrack_privacy_mode');
      if (savedPrivacy !== null) this.isPrivacyModeActive.set(savedPrivacy === 'true');

      // Effect to sync privacy mode with DOM
      effect(() => {
        if (this.isPrivacyModeActive()) {
          this.renderer.setAttribute(document.body, 'data-privacy', 'active');
        } else {
          this.renderer.removeAttribute(document.body, 'data-privacy');
        }
      });
    }
  }

  togglePrivacyMode() {
    this.isPrivacyModeActive.update(val => !val);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('flametrack_privacy_mode', this.isPrivacyModeActive().toString());
    }
  }

  setTheme(theme: ThemeType) {
    if (!isPlatformBrowser(this.platformId)) return;
    const themes: ThemeType[] = ['theme-nord', 'theme-deep-midnight', 'theme-sakura', 'theme-forest', 'theme-pride'];
    themes.forEach(t => this.renderer.removeClass(document.body, t));
    if (theme !== 'default-dark') this.renderer.addClass(document.body, theme);
    this.currentThemeSignal.set(theme);
    localStorage.setItem('flametrack_theme', theme);
  }
}
