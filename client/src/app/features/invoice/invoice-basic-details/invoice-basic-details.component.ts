import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { InputComponent } from '../../../shared/input/input.component';
import { Company } from '../../../models/company.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../../core/services/company/company.service';
import { InvoiceService } from '../../../core/services/invoice/invoice.service';
import { Invoice } from '../../../models/invoice.mode';

@Component({
  selector: 'app-invoice-basic-details',
  imports: [CommonModule, ReactiveFormsModule, InputComponent, FormsModule],
  templateUrl: './invoice-basic-details.component.html',
  styleUrl: './invoice-basic-details.component.scss',
})
export class InvoiceBasicDetailsComponent {
  @ViewChild('companyDropdown', { static: false })
  companyDropdownRef!: ElementRef;

  invoice!: Invoice;
  invoiceId: string = '';
  invoiceForm!: FormGroup;

  companies: Company[] = [];
  showCompanyDropdown = false;
  selectedCompany: Company | null = null;

  dcNos: string[] = [];
  dcNo: string = '';

  orderNos: string[] = [];
  orderNo: string = '';

  isEditingDisabled: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private invoiceService: InvoiceService,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ uuid }) => {
      this.invoiceId = uuid;
      this.initForm();
      this.getCompanies();
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.companyDropdownRef?.nativeElement.contains(
      event.target
    );
    if (!clickedInside) {
      this.showCompanyDropdown = false;
    }
  }

  initForm(): void {
    this.invoiceForm = this.formBuilder.group({
      invoice_no: ['', Validators.required],
      company_name: ['', Validators.required],
      company_address: ['', Validators.required],
      company_gst_no: ['', Validators.required],
      date: ['', Validators.required],
      dc_nos: [[]],
      order_nos: [[]],
    });
  }

  setTodayDate(): void {
    const today = new Date();
    const formatted = today.toLocaleDateString('en-GB').split('/').join('-');

    this.invoiceForm.patchValue({ date: formatted });
  }

  setInvoiceID(): void {
    this.invoiceService.getInvoices({ page: 1 }).subscribe({
      next: ({ data }) => {
        this.invoiceForm.patchValue({
          invoice_no: (
            parseInt(data[0].invoice_no || '202526000') + 1
          ).toString(),
        });
      },
      error: (err) => {
        console.error('Error: ', err);
      },
    });
  }

  toggleCompanyDropdown(): void {
    if (this.isEditingDisabled) return;
    this.showCompanyDropdown = !this.showCompanyDropdown;
  }

  onCompanySelect(company: Company): void {
    this.selectedCompany = company;
    this.showCompanyDropdown = false;

    this.invoiceForm.patchValue({
      company_name: company?.company_name,
      company_address: company?.company_address,
      company_gst_no: company?.company_gst_no,
    });
  }

  addDcNo(): void {
    if (this.dcNo) {
      this.dcNos.push(this.dcNo.trim());
      this.dcNo = '';
      this.invoiceForm.patchValue({ dc_nos: [...this.dcNos] });
    }
  }

  removeDcNo(index: number): void {
    this.dcNos.splice(index, 1);
    this.invoiceForm.patchValue({ dc_nos: [...this.dcNos] });
  }

  addOrderNo(): void {
    if (this.orderNo) {
      this.orderNos.push(this.orderNo.trim());
      this.orderNo = '';
      this.invoiceForm.patchValue({ order_nos: [...this.orderNos] });
    }
  }

  removeOrderNo(index: number): void {
    this.orderNos.splice(index, 1);
    this.invoiceForm.patchValue({ order_nos: [...this.orderNos] });
  }

  getControl(controlName: string): FormControl {
    return this.invoiceForm.get(controlName) as FormControl;
  }

  getCompanies(): void {
    this.companyService.getCompanies().subscribe({
      next: (res: Company[]) => {
        this.companies = res;

        if (this.invoiceId !== 'create') {
          this.getInvoice();
        } else {
          this.setInvoiceID();
          this.setTodayDate();
        }
      },
      error: (err) => console.error('Company Error: ', err),
    });
  }

  getInvoice(): void {
    this.invoiceService.getInvoice(this.invoiceId).subscribe({
      next: (res) => {
        this.isEditingDisabled = true;
        this.invoice = res;
        this.dcNos = res.dc_nos || [];
        this.orderNos = res.order_nos || [];

        this.invoiceForm.patchValue(res);

        const company = this.companies.find(
          (company) => company?.company_name === res?.company_name
        );
        this.onCompanySelect(company as Company);
      },
      error: (err) => console.error('Invoice Error: ', err),
    });
  }

  onSubmit(): void {
    if (this.invoiceForm.invalid) {
      console.error('Invalid form');
      return;
    }

    const formValue = {
      ...this.invoiceForm.getRawValue(),
      dc_nos: this.dcNos.length ? this.dcNos : null,
      order_nos: this.orderNos.length ? this.orderNos : null,
    };

    if (this.invoiceId === 'create') {
      this.invoiceService.createInvoice(formValue).subscribe({
        next: (res) => {
          this.router.navigate(['/invoices/items-details', res.uuid]);
        },
        error: (err) => console.error('Create Error: ', err),
      });
    } else {
      this.invoiceService.updateInvoice(this.invoiceId, formValue).subscribe({
        next: () =>
          this.router.navigate(['/invoices/items-details', this.invoiceId]),
        error: (err) => console.error('Update Error: ', err),
      });
    }
  }

  createCompany(): void {
    this.router.navigate(['/companies/company/create']);
  }

  navigateBack(): void {
    this.router.navigate(['/invoices']);
  }
}
