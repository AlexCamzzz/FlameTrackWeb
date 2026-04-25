export enum TransactionTypeDto {
  Income = 0,
  Expense = 1
}

export interface TransactionDto {
  id: string;
  description: string;
  amount: number;
  date: string; // ISO string
  categoryId: string;
  type: TransactionTypeDto;
}

export interface CreateTransactionRequestDto {
  description: string;
  amount: number;
  date: string;
  categoryId: string;
  type: TransactionTypeDto;
}

export interface CategoryExpenseDto {
  categoryId: string;
  amount: number;
  percentage: number;
}

export interface DashboardBudgetDto {
  categoryId: string;
  limit: number;
  spent: number;
  percentage: number;
}

export interface GoalDto {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface CategoryDto {
  id: string;
  name: string;
  color: string;
  isStandard: boolean;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  nickname?: string;
  avatar?: string;
}

export interface UpdateUserRequestDto {
  name?: string;
  nickname?: string;
  avatar?: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  user: UserDto;
}

export interface DashboardSummaryDto {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  recentTransactions: TransactionDto[];
  categoryExpenses: CategoryExpenseDto[];
  budgets: DashboardBudgetDto[];
  goals: GoalDto[];
}
