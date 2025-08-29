import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { InvoiceService } from '../../../core/services/invoice/invoice.service';
import { Invoice } from '../../../models/invoice.mode';
import { StorageService } from '../../../core/services/storage/storage.service';

@Component({
  selector: 'app-manage-invoices',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './manage-invoices.component.html',
  styleUrl: './manage-invoices.component.scss',
})
export class ManageInvoicesComponent {
  invoices: Invoice[] = [];
  selectedInvoice: Invoice | null = null;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private invoiceService: InvoiceService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.getInvoices();
  }

  createInvoice(): void {
    this.router.navigate(['/invoices/basic-details/create']);
  }

  getInvoices(): void {
    this.isLoading = true;
    this.invoiceService.getInvoices().subscribe({
      next: (res: Invoice[]) => {
        this.invoices = res;
        this.isLoading = false;
        this.storageService.setNewInvoiceID(res[0]?.invoice_no);
      },
      error: (err) => {
        console.error('Error: ', err);
        this.invoices = [];
        this.isLoading = false;
      },
    });
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
