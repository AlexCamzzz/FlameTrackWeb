import { Component, inject, signal, effect, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TutorialService } from '../../services/tutorial.service';

@Component({
  selector: 'app-tutorial-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (tutorial.isActive()) {
      <div class="fixed inset-0 z-[100] pointer-events-none">
        <!-- Backdrop with shadow-based cutout -->
        <div class="absolute inset-0 bg-black/70 pointer-events-auto" (click)="tutorial.skip()"></div>
        
        <!-- Highlight Box -->
        <div 
          [style.top.px]="targetPos().top - 8"
          [style.left.px]="targetPos().left - 8"
          [style.width.px]="targetPos().width + 16"
          [style.height.px]="targetPos().height + 16"
          class="absolute border-4 border-primary rounded-lg transition-all duration-300 shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] pointer-events-none"
        ></div>

        <!-- Popover -->
        @if (tutorial.currentStep(); as step) {
          <div 
            [style.top.px]="popoverPos().top"
            [style.left.px]="popoverPos().left"
            class="absolute w-72 bg-surface p-4 rounded-xl shadow-2xl border border-border transition-all duration-300 pointer-events-auto"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-white font-bold">{{ step.title }}</h3>
              <span class="text-xs text-subtle">{{ tutorial.progress() }}</span>
            </div>
            <p class="text-subtle text-sm mb-4 leading-relaxed">
              {{ step.content }}
            </p>
            <div class="flex justify-between items-center">
              <button (click)="tutorial.skip()" class="text-xs text-subtle hover:text-white transition-colors">Skip</button>
              <div class="flex gap-2">
                @if (!tutorial.isFirstStep()) {
                  <button (click)="tutorial.prevStep()" class="px-3 py-1 text-xs bg-surface border border-border text-white rounded-lg hover:bg-white/5 transition-colors">Previous</button>
                }
                <button (click)="tutorial.nextStep()" class="px-3 py-1 text-xs bg-primary text-white rounded-lg hover:opacity-90 transition-opacity">
                  {{ tutorial.isLastStep() ? 'Finish' : 'Next' }}
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    }
  `
})
export class TutorialOverlayComponent implements OnDestroy {
  tutorial = inject(TutorialService);
  private platformId = inject(PLATFORM_ID);
  
  targetPos = signal({ top: 0, left: 0, width: 0, height: 0 });
  popoverPos = signal({ top: 0, left: 0 });

  constructor() {
    effect(() => {
      if (this.tutorial.isActive()) {
        // Force recalculation when step changes
        this.tutorial.currentStepIndex();
        setTimeout(() => this.updatePosition(), 300); // Wait for navigation/animations
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.onResize);
      window.addEventListener('scroll', this.onResize, true);
    }
  }

  private onResize = () => {
    if (this.tutorial.isActive()) {
      this.updatePosition();
    }
  };

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onResize);
      window.removeEventListener('scroll', this.onResize, true);
    }
  }

  private updatePosition() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const step = this.tutorial.currentStep();
    if (!step) return;

    let target: HTMLElement | null = null;
    for (const selector of step.targetSelectors) {
      const elements = document.querySelectorAll(selector);
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i] as HTMLElement;
        if (el.offsetParent !== null && el.offsetWidth > 0) {
          target = el;
          break;
        }
      }
      if (target) break;
    }

    if (target) {
      const rect = target.getBoundingClientRect();
      this.targetPos.set({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });

      // Calculate popover position
      let pTop = rect.bottom + 24;
      let pLeft = rect.left + (rect.width / 2) - 144;

      // Adjust if it goes off screen bottom
      if (pTop + 180 > window.innerHeight) {
        pTop = rect.top - 180;
      }
      
      // Horizontal boundaries
      if (pLeft < 16) pLeft = 16;
      if (pLeft + 288 > window.innerWidth - 16) pLeft = window.innerWidth - 304;

      this.popoverPos.set({ top: Math.max(16, pTop), left: pLeft });
    } else {
      // Center of screen fallback
      this.targetPos.set({ top: -100, left: -100, width: 0, height: 0 });
      this.popoverPos.set({
        top: window.innerHeight / 2 - 90,
        left: window.innerWidth / 2 - 144
      });
    }
  }
}
