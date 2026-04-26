import { Injectable, inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

export interface TutorialStep {
  title: string;
  content: string;
  targetSelectors: string[];
}

export interface RouteTutorial {
  [route: string]: TutorialStep[];
}

@Injectable({
  providedIn: 'root'
})
export class TutorialService {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private readonly STORAGE_KEY = 'flametrack_tutorial_completed';
  private readonly HELP_BTN_KEY = 'flametrack_help_btn_visible';

  private tutorialsByRoute: RouteTutorial = {
    '/': [
      {
        title: 'Your Financial Pulse',
        content: 'The **Net Worth** card is your most important metric. It consolidates all your liquid assets and debts into a single value, allowing you to track your real wealth growth over time.',
        targetSelectors: ['[data-tutorial="dashboard-summary"]']
      },
      {
        title: 'The Backbone: Accounts',
        content: 'Before logging activity, you need a source. We recommend creating separate accounts for **Cash, Savings, and Credit Cards** to mirror your real-world wallet accurately.',
        targetSelectors: ['[data-tutorial="nav-accounts-desktop"]', '[data-tutorial="nav-accounts-mobile"]']
      },
      {
        title: 'Discover Custom Categories',
        content: 'Standard categories are just the start. You can create custom labels like "Pet Care" or "Subscribed Services" in the **Settings Menu** to make your analytics truly yours.',
        targetSelectors: ['button.group'] 
      },
      {
        title: 'Help is Always Here',
        content: 'If you ever need guidance on a specific screen, this floating button will provide contextual tips for your current view.',
        targetSelectors: ['[data-tutorial="help-fab"]']
      }
    ],
    '/accounts': [
      {
        title: 'Mastering Liquidity',
        content: 'Every card here represents a real money source. Keeping these balances updated is crucial for accurate forecasting and net worth calculation.',
        targetSelectors: ['.card']
      },
      {
        title: 'Why Initial Balance matters?',
        content: 'When creating a new account, the **Initial Balance** acts as your day-zero state. FlameTrack uses this to calculate your financial trajectory from the moment you join.',
        targetSelectors: ['[data-tutorial="btn-new-account"]']
      }
    ],
    '/transactions': [
      {
        title: 'Auditing the Ledger',
        content: 'This list is your "Source of Truth". Audit every entry here to ensure your bank statements match your digital records. Use filters to spot unusual spending.',
        targetSelectors: ['table', '.card']
      },
      {
        title: 'Automation via Recurring',
        content: 'Don\'t log the same rent or gym payment every month. Use **Recurring Transactions** to automate fixed costs, ensuring your budgets are always realistic without the manual work.',
        targetSelectors: ['[data-tutorial="tab-recurring"]']
      },
      {
        title: 'Manual Logging',
        content: 'Use the **Entry** button for one-off expenses or unexpected income. Capturing small cash expenses is the secret to a perfect financial map.',
        targetSelectors: ['[data-tutorial="btn-new-transaction"]']
      }
    ],
    '/budgets': [
      {
        title: 'Your Spending Shield',
        content: 'Budgets are not restrictions; they are tools for discipline. Set a limit for "Dining Out" or "Shopping" to receive visual warnings before you overspend.',
        targetSelectors: ['.card']
      },
      {
        title: 'Provisioning Funds',
        content: 'Establish a new budget parameter here. Pro tip: align your budget cycles with your monthly income for better cash flow management.',
        targetSelectors: ['[data-tutorial="btn-new-budget"]']
      }
    ],
    '/goals': [
      {
        title: 'Visualizing Your Future',
        content: 'Saving is psychological. Seeing your "Travel Fund" or "Emergency Reserve" progress bar move is the best motivation to keep allocating capital.',
        targetSelectors: ['.card']
      },
      {
        title: 'Establish a Target',
        content: 'Set clear, reachable goals. Start with a small "Emergency Fund" before aiming for larger purchases.',
        targetSelectors: ['[data-tutorial="btn-new-goal"]']
      }
    ],
    '/categories': [
      {
        title: 'Personalizing Analytics',
        content: 'Categories define how you see your money. Use unique colors for different life areas (e.g., Red for Housing, Green for Income) to spot trends at a glance.',
        targetSelectors: ['[data-tutorial="category-list"]']
      },
      {
        title: 'Strategic Labeling',
        content: 'If you spend significantly on a specific hobby, give it its own category instead of hiding it in "General". Granularity leads to better control.',
        targetSelectors: ['[data-tutorial="category-create-form"]']
      }
    ],
    '/account': [
      {
        title: 'Identity Control',
        content: 'Personalize your profile here. A recognizable avatar and nickname make the interface feel more like your personal financial workspace.',
        targetSelectors: ['[data-tutorial="profile-card"]']
      }
    ],
    '/preferences': [
      {
        title: 'Environment Tuning',
        content: 'From Dark Mode themes to Privacy Obfuscation (blurring balances), this is where you adapt FlameTrack to your environment and security needs.',
        targetSelectors: ['h1']
      }
    ],
    'modal-transaction': [
      {
        title: 'The Art of Logging',
        content: 'Always add a clear description. An expense of $50 called "Misc" means nothing in six months. "Oil Change" or "Grocery Haul" provides actionable data.',
        targetSelectors: ['[data-tutorial="input-amount"]']
      },
      {
        title: 'Categorical Accuracy',
        content: 'Selecting the right category ensures your monthly reports are accurate. Use the picker to find the best fit for this transaction.',
        targetSelectors: ['[data-tutorial="btn-category-picker"]']
      }
    ],
    'modal-recurring': [
      {
        title: 'Subscription Management',
        content: 'For Netflix, Spotify, or Rent, set a **Monthly** frequency. FlameTrack will automatically register the outflow on the scheduled date.',
        targetSelectors: ['[data-tutorial="select-frequency"]']
      },
      {
        title: 'Genesis Date',
        content: 'This is when the first transaction will be recorded. You can set an end date if the contract is for a limited time.',
        targetSelectors: ['[data-tutorial="input-start-date"]']
      }
    ],
    'modal-account': [
      {
        title: 'Linking Reality',
        content: 'The **Account Label** should match your bank\'s name. Use the **Type** (Debit, Credit, Invest) to help FlameTrack understand the nature of your liquidity.',
        targetSelectors: ['[data-tutorial="input-account-name"]']
      },
      {
        title: 'Day Zero Balance',
        content: 'Enter exactly what you have in this account *right now*. This ensures your total Net Worth is accurate from your very first transaction.',
        targetSelectors: ['[data-tutorial="input-initial-balance"]']
      }
    ],
    'modal-budget': [
      {
        title: 'Allocating Limits',
        content: 'Pick a category and set a realistic ceiling. A budget that is too strict is often ignored—aim for balance.',
        targetSelectors: ['[data-tutorial="select-category"]']
      },
      {
        title: 'Monthly Cap',
        content: 'This amount resets every month. FlameTrack will track your expenses against this value in real-time.',
        targetSelectors: ['[data-tutorial="input-budget-limit"]']
      }
    ],
    'modal-goal': [
      {
        title: 'Targeting Success',
        content: 'Give your goal an inspiring name. "Dream Home Downpayment" is more motivating than "Savings 1".',
        targetSelectors: ['[data-tutorial="input-goal-name"]']
      },
      {
        title: 'The Finish Line',
        content: 'Set the total amount needed. You don\'t need the money now—this is your final destination.',
        targetSelectors: ['[data-tutorial="input-target-amount"]']
      }
    ],
    'modal-deposit-goal': [
      {
        title: 'Capital Migration',
        content: 'Select which account the money is coming from. This will decrease the account balance and increase the goal progress.',
        targetSelectors: ['[data-tutorial="picker-source-account"]']
      },
      {
        title: 'Stashing Cash',
        content: 'Enter the amount you want to "lock away" for this goal. It\'s a transfer from your liquid cash to your future dreams.',
        targetSelectors: ['[data-tutorial="input-deposit-amount"]']
      }
    ],
    'modal-transfer': [
      {
        title: 'Internal Movement',
        content: 'Moving money from your Checking to your Savings? Or paying off a Credit Card? Use this to keep both balances in sync without affecting your net income.',
        targetSelectors: ['[data-tutorial="picker-from"]']
      },
      {
        title: 'Destination',
        content: 'Select the receiving account. FlameTrack will automatically create balanced ledger entries for both sources.',
        targetSelectors: ['[data-tutorial="picker-to"]']
      }
    ]
  };

  private currentRouteSteps = signal<TutorialStep[]>([]);
  isActive = signal(false);
  currentStepIndex = signal(0);
  helpButtonVisible = signal(true);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.HELP_BTN_KEY);
      if (saved !== null) {
        this.helpButtonVisible.set(saved === 'true');
      }
    }
  }

  currentStep = computed(() => {
    const steps = this.currentRouteSteps();
    if (!steps || steps.length === 0) return null;
    return steps[this.currentStepIndex()];
  });
  
  isFirstStep = computed(() => this.currentStepIndex() === 0);
  isLastStep = computed(() => {
    const steps = this.currentRouteSteps();
    return steps.length === 0 || this.currentStepIndex() === steps.length - 1;
  });
  
  progress = computed(() => {
    const steps = this.currentRouteSteps();
    if (steps.length === 0) return '0 / 0';
    return `${this.currentStepIndex() + 1} / ${steps.length}`;
  });

  toggleHelpButton(visible: boolean) {
    this.helpButtonVisible.set(visible);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.HELP_BTN_KEY, visible.toString());
    }
  }

  start(contextKey?: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    
    let key = contextKey || this.router.url.split('?')[0];
    let steps = this.tutorialsByRoute[key];
    
    if (!steps || steps.length === 0) {
       steps = [{
          title: 'Exploration Mode',
          content: 'There is no specific tutorial for this page yet, but feel free to explore! You can disable this help button in Preferences.',
          targetSelectors: ['[data-tutorial="help-fab"]']
       }];
    }

    this.currentRouteSteps.set(steps);
    this.currentStepIndex.set(0);
    this.isActive.set(true);
  }

  nextStep() {
    if (this.isLastStep()) {
      this.finish();
      return;
    }
    this.currentStepIndex.update(i => i + 1);
  }

  prevStep() {
    if (this.isFirstStep()) return;
    this.currentStepIndex.update(i => i - 1);
  }

  skip() {
    this.finish();
  }

  private finish() {
    this.isActive.set(false);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, 'true');
    }
  }
}
