import { Component } from '@angular/core';
import { InvoiceService } from '../../../core/services/invoice/invoice.service';
import { Invoice } from '../../../models/invoice.mode';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-invoice',
  imports: [CommonModule],
  templateUrl: './view-invoice.component.html',
  styleUrl: './view-invoice.component.scss',
})
export class ViewInvoiceComponent {
  invoice!: Invoice;

  isSigned: boolean = false;
  isLoading: boolean = false;

  conditions = [
    'Goods once sold cannot be taken back or exchanged.',
    'Subject to Bangalore Jurisdictions.',
    'Interest will be charged 24%p.a. if bill not paid within 15 days.',
    'Our responsibility ceases once goods leave our premises',
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ uuid }) => {
      this.getInvoice(uuid);
    });
  }

  getInvoice(id: string): void {
    this.isLoading = true;
    this.invoiceService.getInvoice(id).subscribe({
      next: (res: Invoice) => {
        this.invoice = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error: ', err);
        this.isLoading = false;
        this.invoice = {} as Invoice;
      },
    });
  }

  createInvoice(): void {
    this.router.navigate(['/invoices/basic-details/create']);
  }

  viewInvoices(): void {
    this.router.navigate(['/invoices']);
  }

  editInvoice(uuid: string): void {
    this.router.navigate(['/invoices/basic-details/', uuid]);
  }

  toggleSigned(): void {
    this.isSigned = !this.isSigned;
  }

  printInvoice(): void {
    const printContent = document.querySelector(
      '.view-invoice-wrapper'
    ) as HTMLElement;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      const printSection = printContent.innerHTML;
      document.body.innerHTML = printSection;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  }
}
