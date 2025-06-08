import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputComponent } from '../../../shared/input/input.component';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../../core/services/company/company.service';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss',
})
export class CompanyComponent implements OnInit {
  companyId: string = '';
  companyForm!: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ uuid }) => {
      this.companyId = uuid;
      this.initForm();

      if (this.companyId !== 'create') {
        this.getCompany();
      }
    });
  }

  initForm(): void {
    this.companyForm = this.formBuilder.group({
      company_name: ['', Validators.required],
      company_address: ['', Validators.required],
      company_gst_no: ['', Validators.required],
    });
  }

  getCompany(): void {
    this.companyService.getCompany(this.companyId).subscribe({
      next: (res) => {
        this.companyForm.patchValue(res);
      },
      error: (err) => {
        this.router.navigate(['/companies']);
        console.error('Error: ', err);
      },
    });
  }

  getControl(controlName: string): FormControl {
    return this.companyForm.get(controlName) as FormControl;
  }

  deleteCompany(): void {
    this.companyService.deleteCompany(this.companyId).subscribe({
      next: () => {
        this.router.navigate(['/companies']);
      },
      error: (err) => {
        console.error('Error: ', err);
      },
    });
  }

  onSubmit(): void {
    if (this.companyForm.invalid) return;

    const formValue = this.companyForm.value;

    if (this.companyId === 'create') {
      this.companyForm.reset();
      this.companyService.createCompany(formValue).subscribe({
        next: () => {
          this.router.navigate(['/companies']);
        },
        error: (err) => {
          console.error('Error: ', err);
        },
      });
    } else {
      this.companyService.updateCompany(this.companyId, formValue).subscribe({
        next: () => {
          this.router.navigate(['/companies']);
        },
        error: (err) => {
          console.error('Error: ', err);
        },
      });
    }
  }

  navigateToCompanies(): void {
    this.router.navigate(['/companies']);
  }
}
