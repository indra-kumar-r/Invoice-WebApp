import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { InvoiceService } from '../../../core/services/invoice/invoice.service';
import {
  Invoice,
  InvoiceQuery,
  InvoiceResponse,
} from '../../../models/invoice.mode';
import { StorageService } from '../../../core/services/storage/storage.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-manage-invoices',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './manage-invoices.component.html',
  styleUrl: './manage-invoices.component.scss',
})
export class ManageInvoicesComponent {
  invoices: Invoice[] = [];
  selectedInvoice: Invoice | null = null;
  isLoading: boolean = false;

  invoiceQuery: InvoiceQuery = {
    search: '',
    page: 1,
  };

  totalInvoices: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;

  pageControl = new FormControl(1, { nonNullable: true });
  searchControl = new FormControl('', { nonNullable: true });

  constructor(
    private router: Router,
    private invoiceService: InvoiceService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.getInvoices();
    this.controllers();
  }

  controllers(): void {
    this.pageControl.valueChanges.pipe(debounceTime(300)).subscribe((page) => {
      if (!page) return;
      this.changePage(page);
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((term) => {
        this.invoiceQuery.search = term;
        this.invoiceQuery.page = 1;
        this.getInvoices();
      });
  }

  createInvoice(): void {
    this.router.navigate(['/invoices/basic-details/create']);
  }

  getInvoices(): void {
    this.isLoading = true;

    this.invoiceService.getInvoices(this.invoiceQuery).subscribe({
      next: (res: InvoiceResponse) => {
        this.invoices = res.data;
        this.totalInvoices = res.total;
        this.currentPage = res.page;
        this.totalPages = res.totalPages;
        this.isLoading = false;

        this.pageControl.setValue(this.currentPage, { emitEvent: false });

        if (res.data.length && this.currentPage === 1) {
          this.storageService.setNewInvoiceID(res.data[0].invoice_no);
        }
      },
      error: (err) => {
        console.error('Error: ', err);
        this.invoices = [];
        this.isLoading = false;
      },
    });
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      this.pageControl.setValue(this.currentPage, { emitEvent: false });
      return;
    }
    this.currentPage = page;
    this.invoiceQuery.page = page;
    this.getInvoices();
  }

  editInvoice(uuid: string): void {
    this.router.navigate(['/invoices/basic-details/', uuid]);
  }

  selectInvoice(id: string, invoiceNumber: string): void {
    this.invoiceService.getInvoice(id).subscribe({
      next: (res: Invoice) => {
        this.selectedInvoice = res;
      },
      error: (err) => {
        console.error('Error: ', err);
      },
    });
  }

  deleteInvoice(uuid: string): void {
    this.invoiceService.deleteInvoice(uuid).subscribe({
      next: () => {
        this.getInvoices();
      },
      error: (err) => {
        console.error('Error: ', err);
      },
    });
  }

  viewInvoice(uuid: string): void {
    this.router.navigate(['/invoices/view-invoice/', uuid]);
  }
}
