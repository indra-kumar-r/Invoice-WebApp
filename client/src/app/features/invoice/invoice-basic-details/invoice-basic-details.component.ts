import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
import { Subject, takeUntil, tap, catchError, of } from 'rxjs';
import { ToasterService } from '../../../core/services/toaster/toaster.service';

@Component({
  selector: 'app-invoice-basic-details',
  imports: [CommonModule, ReactiveFormsModule, InputComponent, FormsModule],
  templateUrl: './invoice-basic-details.component.html',
  styleUrl: './invoice-basic-details.component.scss',
})
export class InvoiceBasicDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('companyDropdown', { static: false })
  companyDropdownRef!: ElementRef;

  private destroy$ = new Subject<void>();

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
    private companyService: CompanyService,
    private toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(({ uuid }) => {
      this.invoiceId = uuid;
      this.getCompanies();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.companyDropdownRef?.nativeElement.contains(
      event.target
    );
    if (!clickedInside) this.showCompanyDropdown = false;
  }

  initForm(): void {
    this.invoiceForm = this.formBuilder.group({
      invoice_no: ['', Validators.required],
      company_name: ['', Validators.required],
      company_address: ['', Validators.required],
      company_gst_no: ['', Validators.required],
      date: [new Date(), Validators.required],
      dc_nos: [[]],
      order_nos: [[]],
    });
  }

  getCompanies(): void {
    this.companyService
      .getCompanies()
      .pipe(
        tap((res: Company[]) => {
          this.companies = res;

          if (this.invoiceId !== 'create') {
            this.getInvoice();
          } else {
            this.setInvoiceID();
          }
        }),
        catchError((err) => {
          console.error('Company Error: ', err);
          this.toasterService.toast('Error fetching companies.');
          return of([]);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  setInvoiceID(): void {
    this.invoiceService
      .getInvoices({ page: 1 })
      .pipe(
        tap(({ data }) => {
          this.invoiceForm.patchValue({
            invoice_no: (
              parseInt(data[0].invoice_no || '202526000') + 1
            ).toString(),
          });
        }),
        catchError((err) => {
          console.error('Error: ', err);
          this.toasterService.toast('Error setting invoice ID.');
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  getInvoice(): void {
    this.invoiceService
      .getInvoice(this.invoiceId)
      .pipe(
        tap((res) => {
          this.isEditingDisabled = true;
          this.invoice = res;
          this.dcNos = res.dc_nos || [];
          this.orderNos = res.order_nos || [];

          this.invoiceForm.patchValue({
            ...res,
            date: res.date ? new Date(res.date) : new Date(),
          });

          const company = this.companies.find(
            (c) => c?.company_name === res?.company_name
          );
          if (company) this.onCompanySelect(company);
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

    const request$ =
      this.invoiceId === 'create'
        ? this.invoiceService.createInvoice(formValue)
        : this.invoiceService.updateInvoice(this.invoiceId, formValue);

    request$
      .pipe(
        tap((res: any) => {
          const uuid = this.invoiceId === 'create' ? res.uuid : this.invoiceId;
          this.toasterService.toast(
            this.invoiceId === 'create'
              ? 'Invoice created successfully.'
              : 'Invoice updated successfully.'
          );
          this.router.navigate(['/invoices/items-details', uuid]);
        }),
        catchError((err) => {
          console.error(
            this.invoiceId === 'create' ? 'Create Error: ' : 'Update Error: ',
            err
          );
          this.toasterService.toast(
            this.invoiceId === 'create'
              ? 'Error creating invoice.'
              : 'Error updating invoice.'
          );
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  createCompany(): void {
    this.router.navigate(['/companies/company/create']);
  }

  navigateBack(): void {
    this.router.navigate(['/invoices']);
  }
}
