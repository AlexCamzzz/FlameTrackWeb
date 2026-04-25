import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { BudgetsComponent } from './components/budgets/budgets.component';
import { GoalsComponent } from './components/goals/goals.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { authGuard } from './auth.guard';

import { AccountComponent } from './components/settings/account/account.component';
import { PreferencesComponent } from './components/settings/preferences/preferences.component';
import { LegalComponent } from './components/legal/legal.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'FlameTrack — Terminal Access' },
  { path: 'register', component: RegisterComponent, title: 'FlameTrack — Forge Identity' },
  { path: '', component: DashboardComponent, canActivate: [authGuard], title: 'FlameTrack — Intelligence Overview' },
  { path: 'transactions', component: TransactionsComponent, canActivate: [authGuard], title: 'FlameTrack — Financial Ledger' },
  { path: 'accounts', component: AccountsComponent, canActivate: [authGuard], title: 'FlameTrack — Liquidity Sources' },
  { path: 'budgets', component: BudgetsComponent, canActivate: [authGuard], title: 'FlameTrack — Capital Provisions' },
  { path: 'goals', component: GoalsComponent, canActivate: [authGuard], title: 'FlameTrack — Strategic Targets' },
  { path: 'categories', component: CategoriesComponent, canActivate: [authGuard], title: 'FlameTrack — Data Classification' },
  { path: 'account', component: AccountComponent, canActivate: [authGuard], title: 'FlameTrack — Profile Identity' },
  { path: 'preferences', component: PreferencesComponent, canActivate: [authGuard], title: 'FlameTrack — System Preferences' },
  { path: 'legal', component: LegalComponent, canActivate: [authGuard], title: 'FlameTrack — Governance & Rights' },
  { path: '**', redirectTo: '' }
];
