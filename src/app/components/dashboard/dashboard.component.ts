import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { TransactionTypeDto } from '../../models/transaction.dto';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  protected transactionService = inject(TransactionService);
  protected categoryService = inject(CategoryService);
  protected TransactionTypeDto = TransactionTypeDto;

  ngOnInit() {
    this.transactionService.loadDashboardSummary();
    this.categoryService.loadCategories();
  }
}
