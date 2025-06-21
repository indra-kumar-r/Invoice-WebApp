import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GstService } from '../../../core/services/gst/gst.service';
import { Invoice } from '../../../models/invoice.mode';
import { InvoiceService } from '../../../core/services/invoice/invoice.service';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../../shared/input/input.component';
import { GSTItem } from '../../../models/gst.model';

@Component({
  selector: 'app-gst',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, InputComponent],
  templateUrl: './gst.component.html',
  styleUrl: './gst.component.scss',
})
export class GstComponent {
  gstId: string = '';
  gstForm!: FormGroup;

  invoices: Invoice[] = [];
  selectedInvoices: string[] = [];

  sgstAmount: number = 0;
  cgstAmount: number = 0;
  igstAmount: number = 0;
  totalAmount: number = 0;

  showSearchFilterTab: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private gstService: GstService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ uuid }) => {
      this.gstId = uuid;
      this.initForm();

      this.getInvoices();

      if (this.gstId !== 'create') {
        this.getGst();
      }
    });
  }

  initForm(): void {
    this.gstForm = this.formBuilder.group({
      month_name: ['', Validators.required],
      year: ['', Validators.required],
      gst_items: [[], Validators.required],
    });
  }

  getControl(controlName: string): FormControl {
    return this.gstForm.get(controlName) as FormControl;
  }

  getGst(): void {
    this.gstService.getGst(this.gstId).subscribe({
      next: (gst) => {
        this.gstForm.patchValue({
          month_name: gst.month_name,
          year: gst.year,
          gst_items: gst.gst_items || [],
        });

        this.sgstAmount =
          gst.gst_items?.reduce(
            (sum: number, item: GSTItem) => sum + (item.sgst || 0),
            0
          ) || 0;
        this.cgstAmount =
          gst.gst_items?.reduce(
            (sum: number, item: GSTItem) => sum + (item.cgst || 0),
            0
          ) || 0;
        this.igstAmount =
          gst.gst_items?.reduce(
            (sum: number, item: GSTItem) => sum + (item.igst || 0),
            0
          ) || 0;
        this.totalAmount =
          gst.gst_items?.reduce(
            (sum: number, item: GSTItem) => sum + (item.total || 0),
            0
          ) || 0;

        this.selectedInvoices =
          gst.gst_items?.map((item: any) => item.invoice_no) || [];
      },
      error: (err) => {
        console.error('Error fetching GST record:', err);
      },
    });
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

  toggleSearchFiltersTab(): void {
    this.showSearchFilterTab = !this.showSearchFilterTab;
  }

  selectInvoice(invoice: string): void {
    const index = this.selectedInvoices.indexOf(invoice);
    if (index !== -1) {
      this.selectedInvoices.splice(index, 1);
    } else {
      this.selectedInvoices.push(invoice);
    }

    this.calculateGstTotals();
  }

  calculateGstTotals(): void {
    this.sgstAmount = 0;
    this.cgstAmount = 0;
    this.igstAmount = 0;
    this.totalAmount = 0;

    const gstItems: GSTItem[] = [];

    this.selectedInvoices.forEach((id) => {
      const invoice = this.invoices.find((inv) => inv.invoice_no === id);

      if (!invoice) {
        console.error('Invoice not found');
        return;
      }
      if (invoice) {
        this.sgstAmount += invoice.sgst || 0;
        this.cgstAmount += invoice.cgst || 0;
        this.igstAmount += invoice.igst || 0;
        this.totalAmount += invoice.grand_total || 0;

        gstItems.push({
          date: invoice.date || '',
          invoice_no: invoice.invoice_no || '',
          company_name: invoice.company_name || '',
          company_gst_number: invoice.company_gst_no || '',
          igst: invoice.igst || 0,
          cgst: invoice.cgst || 0,
          sgst: invoice.sgst || 0,
          total: invoice.grand_total || 0,
        });
      }
    });

    this.gstForm.patchValue({
      gst_items: gstItems,
    });
  }

  onSubmit(): void {
    if (this.gstForm.invalid) {
      console.error('Invalid form');
      return;
    }

    const formValue = { ...this.gstForm.getRawValue() };
    formValue.month_name = String(formValue.month_name).toUpperCase();

    if (this.gstId === 'create') {
      this.gstService.createGst(formValue).subscribe({
        next: (res) => {
          this.router.navigate(['/gsts']);
        },
        error: (err) => console.error('Create GST Error:', err),
      });
    } else {
      this.gstService.updateGst(this.gstId, formValue).subscribe({
        next: () => {
          this.router.navigate(['/gsts']);
        },
        error: (err) => console.error('Update GST Error:', err),
      });
    }
  }

  navigateToGsts(): void {
    this.router.navigate(['/gsts']);
  }
}
