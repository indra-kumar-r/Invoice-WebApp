import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Company } from '../../../models/company.model';
import { CompanyService } from '../../../core/services/company/company.service';
import { FormsModule } from '@angular/forms';
import { Subject, tap, catchError, of, takeUntil, finalize } from 'rxjs';

@Component({
  selector: 'app-manage-company',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './manage-company.component.html',
  styleUrl: './manage-company.component.scss',
})
export class ManageCompanyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  totalCompanies: Company[] = [];
  companies: Company[] = [];
  isLoading: boolean = false;

  searchTerm: string = '';

  constructor(private router: Router, private companyService: CompanyService) {}

  ngOnInit(): void {
    this.getCompanies();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createCompany(): void {
    this.router.navigate(['/companies/company/create']);
  }

  getCompanies(): void {
    this.isLoading = true;

    this.companyService
      .getCompanies()
      .pipe(
        tap((res: Company[]) => {
          this.totalCompanies = res.map((company) => ({
            ...company,
            color: this.getRandomColor(),
          }));
          this.companies = this.totalCompanies;
        }),
        catchError((err) => {
          console.error('Error: ', err);
          this.companies = [];
          return of([]);
        }),
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  viewCompanyDetails(uuid: string): void {
    this.router.navigate(['/companies/company/', uuid]);
  }

  searchCompanies(): void {
    if (!this.searchTerm) {
      this.companies = this.totalCompanies;
      return;
    }

    this.companies = this.totalCompanies.filter((company) =>
      company.company_name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
