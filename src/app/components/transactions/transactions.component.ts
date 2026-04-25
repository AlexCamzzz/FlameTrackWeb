import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { TransactionTypeDto } from '../../models/transaction.dto';
import { CreateTransactionModalComponent } from './create-transaction-modal.component';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, CreateTransactionModalComponent],
  templateUrl: './transactions.component.html',
})
export class TransactionsComponent implements OnInit {
  protected transactionService = inject(TransactionService);
  protected categoryService = inject(CategoryService);
  protected TransactionTypeDto = TransactionTypeDto;
  isModalOpen = false;

  ngOnInit() {
    this.transactionService.loadTransactions();
    this.categoryService.loadCategories();
  }
}

