import { Component, OnInit, OnDestroy } from '@angular/core';
import { InvoiceService } from '../../../core/services/invoice/invoice.service';
import { Invoice } from '../../../models/invoice.mode';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, tap, catchError, of, finalize } from 'rxjs';
import { FormatDatePipe } from '../../../core/pipes/format-date.pipe';
import { ToasterService } from '../../../core/services/toaster/toaster.service';
import { environment } from '../../../../environments/environment';
import { CompanyDetails } from '../../../models/shared.model';

@Component({
  selector: 'app-view-invoice',
  imports: [CommonModule, RouterLink, FormatDatePipe],
  templateUrl: './view-invoice.component.html',
  styleUrl: './view-invoice.component.scss',
})
export class ViewInvoiceComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  invoice!: Invoice;
  isSigned: boolean = false;
  isLoading: boolean = false;

  companyDetails: CompanyDetails = environment.companyDetails;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ uuid }) => this.getInvoice(uuid));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getInvoice(id: string): void {
    this.isLoading = true;

    this.invoiceService
      .getInvoice(id)
      .pipe(
        tap((res: Invoice) => {
          this.invoice = res;
        }),
        catchError((err) => {
          console.error('Error fetching invoice: ', err);
          this.toasterService.toast('Error fetching invoice.');
          this.router.navigate(['/invoices']);
          this.invoice = {} as Invoice;

          return of({} as Invoice);
        }),
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
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
