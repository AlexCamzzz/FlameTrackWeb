import { TransactionTypeDto } from './transaction.dto';

export interface SandboxDto {
  id: string;
  month: number;
  year: number;
  initialBalances: { [key: string]: number };
  projectedTotalBalance: number;
  movements: SandboxMovementDto[];
}

export interface SandboxMovementDto {
  id?: string;
  accountId: string;
  categoryId: string;
  description: string;
  amount: number;
  type: TransactionTypeDto;
  date: string;
  isIncludedInBalance: boolean;
}

export interface CreateSandboxMovementRequest {
  accountId: string;
  categoryId: string;
  description: string;
  amount: number;
  type: TransactionTypeDto;
  isIncludedInBalance: boolean;
}
