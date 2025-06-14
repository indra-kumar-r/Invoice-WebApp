import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { InvoiceService } from '../../../core/services/invoice/invoice.service';
import { Invoice } from '../../../models/invoice.mode';

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

  constructor(private router: Router, private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.getInvoices();
  }

  createInvoice(): void {
    this.router.navigate(['/invoices/basic-details/create']);
  }

  getInvoices(): void {
    this.invoiceService.getInvoices().subscribe({
      next: (res: Invoice[]) => {
        this.invoices = res;
      },
      error: (err) => {
        console.error('Error: ', err);
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
        console.log(this.selectedInvoice);
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
    window.open(`/invoices/view-invoice/${uuid}`, '_blank');
  }

  navigateToHome(): void {
    this.router.navigate(['home']);
  }
}
