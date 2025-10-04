import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { Subject, takeUntil, tap, catchError, of } from 'rxjs';
import { ToasterService } from '../../../core/services/toaster/toaster.service';

@Component({
  selector: 'app-invoice-amount-details',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './invoice-amount-details.component.html',
  styleUrl: './invoice-amount-details.component.scss',
})
export class InvoiceAmountDetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  invoice!: Invoice;
  invoiceId: string = '';
  invoiceItems: InvoiceItem[] = [];
  invoiceForm!: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private invoiceService: InvoiceService,
    private toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(({ uuid }) => {
      this.invoiceId = uuid;
      this.getInvoice();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(): void {
    this.invoiceForm = this.formBuilder.group({
      total: [0, Validators.required],
      sgst: [null],
      cgst: [null],
      igst: [null],
      include_sgst: [true],
      include_cgst: [true],
      include_igst: [false],
      sgst_rate: [2.5],
      cgst_rate: [2.5],
      igst_rate: [5],
      grand_total: [0, Validators.required],
      amount_in_words: [''],
    });
  }

  getInvoice(): void {
    this.invoiceService
      .getInvoice(this.invoiceId)
      .pipe(
        tap((res) => {
          this.invoice = res;
          this.invoiceItems = res.invoice_items || [];

          const total = this.invoiceItems.reduce(
            (sum, item) => sum + (item.amount || 0),
            0
          );

          this.invoiceForm.patchValue({
            total,
            include_sgst: res.include_sgst ?? true,
            include_cgst: res.include_cgst ?? true,
            include_igst: res.include_igst ?? false,
            sgst_rate: res.sgst_rate ?? 2.5,
            cgst_rate: res.cgst_rate ?? 2.5,
            igst_rate: res.igst_rate ?? 5,
          });

          this.calculateTaxValues(total);
        }),
        catchError((err) => {
          console.error('Invoice Error: ', err);
          this.toasterService.toast('Error fetching invoice.');
          this.router.navigate(['/invoices']);

          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  onTaxToggle(): void {
    const total = this.invoiceForm.get('total')?.value || 0;
    this.calculateTaxValues(total);
  }

  calculateTaxValues(total: number): void {
    const includeSgst = this.invoiceForm.get('include_sgst')?.value;
    const includeCgst = this.invoiceForm.get('include_cgst')?.value;
    const includeIgst = this.invoiceForm.get('include_igst')?.value;

    const sgstRate = this.invoiceForm.get('sgst_rate')?.value || 0;
    const cgstRate = this.invoiceForm.get('cgst_rate')?.value || 0;
    const igstRate = this.invoiceForm.get('igst_rate')?.value || 0;

    const sgst = includeSgst ? this.calculateTax(total, sgstRate) : null;
    const cgst = includeCgst ? this.calculateTax(total, cgstRate) : null;
    const igst = includeIgst ? this.calculateTax(total, igstRate) : null;

    const grandTotal = total + (sgst || 0) + (cgst || 0) + (igst || 0);
    const amountInWords = toWords(grandTotal.toFixed(0)).toUpperCase();

    this.invoiceForm.patchValue({
      sgst,
      cgst,
      igst,
      grand_total: Math.round(grandTotal),
      amount_in_words: amountInWords,
    });
  }

  calculateTax(amount: number, rate: number): number {
    return parseFloat(((amount * rate) / 100).toFixed(2));
  }

  toggleCheckbox(tax: 'sgst' | 'cgst' | 'igst'): void {
    const controlName = `include_${tax}`;
    const currentValue = this.invoiceForm.get(controlName)?.value;
    this.invoiceForm.patchValue({ [controlName]: !currentValue });

    this.onTaxToggle();
  }

  onSubmit(): void {
    if (this.invoiceForm.invalid || !this.invoiceItems.length) return;

    const formValues = this.invoiceForm.getRawValue();

    const payload = {
      ...formValues,
      sgst: formValues.include_sgst ? formValues.sgst : null,
      cgst: formValues.include_cgst ? formValues.cgst : null,
      igst: formValues.include_igst ? formValues.igst : null,
      sgst_rate: formValues.include_sgst ? formValues.sgst_rate : null,
      cgst_rate: formValues.include_cgst ? formValues.cgst_rate : null,
      igst_rate: formValues.include_igst ? formValues.igst_rate : null,
      amount_in_words: formValues.amount_in_words.toUpperCase(),
    };

    this.invoiceService
      .updateInvoice(this.invoiceId, payload)
      .pipe(
        tap(() => {
          this.router.navigate(['/invoices']);
          this.toasterService.toast('Invoice updated successfully.');
        }),
        catchError((err) => {
          console.error('Update Error: ', err);
          this.toasterService.toast('Error updating invoice.');
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  navigateBack(): void {
    this.router.navigate(['/invoices/items-details', this.invoiceId]);
  }
}
