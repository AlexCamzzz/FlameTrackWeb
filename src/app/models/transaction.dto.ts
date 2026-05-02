// DTOs for financial transactions and entities
export enum TransactionTypeDto {
  Income = 0,
  Expense = 1
}

export enum AccountType {
  Cash = 0,
  Debit = 1,
  Credit = 2,
  Voucher = 3,
  Digital = 4,
  Investment = 5
}

export interface TransactionDto {
  id: string;
  userId: string;
  accountId: string;
  description: string;
  amount: number;
  date: string;
  categoryId: string;
  type: TransactionTypeDto;
}

export interface CreateTransactionRequestDto {
  description: string;
  accountId: string;
  amount: number;
  date: string;
  categoryId: string;
  type: TransactionTypeDto;
}

export interface AccountDto {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  initialBalance: number;
  color: string;
  currency: string;
  isArchived: boolean;
}

export interface CreateAccountRequestDto {
  name: string;
  type: AccountType;
  initialBalance: number;
  color: string;
  currency: string;
}

export interface UpdateAccountRequestDto {
  name?: string;
  color?: string;
}

export interface TransferDto {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  note?: string;
  date: string;
}

export interface CreateTransferRequestDto {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  note?: string;
  date: string;
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

export enum BudgetFrequency {
  Monthly = 0,
  Annual = 1
}

export interface BudgetDto {
  id?: string;
  categoryId: string;
  limit: number;
  spent: number;
  month: number;
  year: number;
  frequency: BudgetFrequency;
}

export interface CreateBudgetRequestDto {
  categoryId: string;
  limit: number;
  month: number;
  year: number;
  frequency: BudgetFrequency;
}

export enum RecurrenceFrequency {
  Daily = 0,
  Weekly = 1,
  Monthly = 2,
  Yearly = 3
}

export interface RecurringTransactionDto {
  id: string;
  accountId: string;
  categoryId: string;
  description: string;
  amount: number;
  type: TransactionTypeDto;
  frequency: RecurrenceFrequency;
  startDate: string;
  endDate?: string;
  lastExecutedAt?: string;
  nextExecutionDate: string;
  isActive: boolean;
}

export interface CreateRecurringTransactionRequestDto {
  accountId: string;
  categoryId: string;
  description: string;
  amount: number;
  type: TransactionTypeDto;
  frequency: RecurrenceFrequency;
  startDate: string;
  endDate?: string;
}

export interface GoalDto {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface CreateGoalRequestDto {
  name: string;
  targetAmount: number;
  deadline: string;
}

export interface DepositGoalRequestDto {
  amount: number;
  fromAccountId: string;
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
  hasAcceptedTerms: boolean;
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
  refreshToken: string;
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
  accounts: AccountDto[];
}

export interface PaginatedResponseDto<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
