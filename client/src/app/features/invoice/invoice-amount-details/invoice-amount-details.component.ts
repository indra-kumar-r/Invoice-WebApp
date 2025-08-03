import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../../core/services/invoice/invoice.service';
import { Invoice, InvoiceItem } from '../../../models/invoice.mode';
import { toWords } from 'number-to-words';

@Component({
  selector: 'app-invoice-amount-details',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './invoice-amount-details.component.html',
  styleUrl: './invoice-amount-details.component.scss',
})
export class InvoiceAmountDetailsComponent {
  invoice!: Invoice;
  invoiceId: string = '';
  invoiceItems: InvoiceItem[] = [];
  invoiceForm!: FormGroup;

  includeSgst = true;
  includeCgst = true;
  includeIgst = false;

  sgstRate: number = 2.5;
  cgstRate: number = 2.5;
  igstRate: number = 5;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ uuid }) => {
      this.invoiceId = uuid;
      this.initForm();
      this.getInvoice();
    });
  }

  initForm(): void {
    this.invoiceForm = this.formBuilder.group({
      total: [0, Validators.required],
      sgst: [null],
      cgst: [null],
      igst: [null],
      grand_total: [0, Validators.required],
      amount_in_words: [''],
    });
  }

  getInvoice(): void {
    this.invoiceService.getInvoice(this.invoiceId).subscribe({
      next: (res) => {
        this.invoice = res;
        this.invoiceItems = res.invoice_items || [];

        const total = this.invoiceItems.reduce(
          (sum, item) => sum + (item.amount || 0),
          0
        );

        this.invoiceForm.patchValue({ total });

        this.setDefaultTaxOptions();

        this.calculateTaxValues(total);
      },
      error: (err) => console.error('Invoice Error: ', err),
    });
  }

  setDefaultTaxOptions(): void {
    this.includeSgst = true;
    this.includeCgst = true;
    this.includeIgst = false;
  }

  onTaxToggle(): void {
    const total = this.invoiceForm.get('total')?.value || 0;
    this.calculateTaxValues(total);
  }

  calculateTaxValues(total: number): void {
    const sgst = this.includeSgst
      ? this.calculateTax(total, this.sgstRate)
      : null;
    const cgst = this.includeCgst
      ? this.calculateTax(total, this.cgstRate)
      : null;
    const igst = this.includeIgst
      ? this.calculateTax(total, this.igstRate)
      : null;

    const grandTotal = total + (sgst || 0) + (cgst || 0) + (igst || 0);
    const amountInWords = toWords(grandTotal.toFixed(0)).toUpperCase();

    this.invoiceForm.patchValue({
      sgst,
      cgst,
      igst,
      grand_total: grandTotal.toFixed(0),
      amount_in_words: amountInWords,
    });
  }

  calculateTax(amount: number, rate: number): number {
    return parseFloat(((amount * rate) / 100).toFixed(2));
  }

  toggleCheckbox(value: string): void {
    switch (value) {
      case 'sgst':
        this.includeSgst = !this.includeSgst;
        break;
      case 'cgst':
        this.includeCgst = !this.includeCgst;
        break;
      case 'igst':
        this.includeIgst = !this.includeIgst;
        break;
    }

    this.onTaxToggle();
  }

  onSubmit(): void {
    if (this.invoiceForm.invalid || !this.invoiceItems.length) return;

    const formValues = this.invoiceForm.getRawValue();

    const payload = {
      ...formValues,
      sgst: this.includeSgst ? formValues.sgst : null,
      cgst: this.includeCgst ? formValues.cgst : null,
      igst: this.includeIgst ? formValues.igst : null,
    };

    this.invoiceService.updateInvoice(this.invoiceId, payload).subscribe({
      next: () => this.router.navigate(['/invoices']),
      error: (err) => console.error('Update Error: ', err),
    });
  }

  navigateBack(): void {
    this.router.navigate(['/invoices/items-details', this.invoiceId]);
  }
}
