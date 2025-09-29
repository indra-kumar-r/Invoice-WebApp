import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { InvoiceService } from '../../../core/services/invoice/invoice.service';
import {
  Invoice,
  InvoiceFilters,
  InvoiceQuery,
  InvoiceResponse,
} from '../../../models/invoice.mode';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { Company } from '../../../models/company.model';
import { CompanyService } from '../../../core/services/company/company.service';

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
    fromDate: '',
    toDate: '',
    company: '',
    search: '',
    page: 1,
  };

  totalInvoices: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;

  pageControl = new FormControl(1, { nonNullable: true });
  searchControl = new FormControl('', { nonNullable: true });

  companies: Company[] = [];

  filters: InvoiceFilters = {
    fromDate: '',
    toDate: '',
    company: '',
  };

  isFiltersCanvasOpen: boolean = false;
  showCompanyDropdown: boolean = false;

  constructor(
    private router: Router,
    private invoiceService: InvoiceService,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.getInvoices();
    this.controllers();
    this.getCompanies();
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
      },
      error: (err) => {
        console.error('Error: ', err);
        this.invoices = [];
        this.isLoading = false;
      },
    });
  }

  getCompanies(): void {
    this.companyService.getCompanies().subscribe({
      next: (res: Company[]) => {
        this.companies = res;
      },
      error: (err) => {
        console.error('Error: ', err);
        this.companies = [];
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

  applyFilters(): void {
    if (this.filters.fromDate && this.filters.toDate) {
      this.invoiceQuery.fromDate = this.formatDateForQuery(
        this.filters.fromDate
      );
      this.invoiceQuery.toDate = this.formatDateForQuery(this.filters.toDate);
    } else {
      delete this.invoiceQuery.fromDate;
      delete this.invoiceQuery.toDate;
    }

    if (this.filters.company) {
      this.invoiceQuery.company = this.filters.company;
    } else {
      delete this.invoiceQuery.company;
    }

    this.invoiceQuery.page = 1;
    this.getInvoices();
  }

  resetFilters(): void {
    this.filters = { fromDate: '', toDate: '', company: '' };
    this.invoiceQuery = { search: this.invoiceQuery.search || '', page: 1 };
    this.getInvoices();
  }

  private formatDateForQuery(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString();
  }

  formatDisplayDate(date?: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
}
