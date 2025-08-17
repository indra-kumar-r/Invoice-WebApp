import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Company } from '../../../models/company.model';
import { CompanyService } from '../../../core/services/company/company.service';

@Component({
  selector: 'app-manage-company',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './manage-company.component.html',
  styleUrl: './manage-company.component.scss',
})
export class ManageCompanyComponent {
  companies: Company[] = [];
  isLoading: boolean = false;

  constructor(private router: Router, private companyService: CompanyService) {}

  ngOnInit(): void {
    this.getCompanies();
  }

  createCompany(): void {
    this.router.navigate(['/companies/company/create']);
  }

  getCompanies(): void {
    this.isLoading = true;
    this.companyService.getCompanies().subscribe({
      next: (res: Company[]) => {
        this.companies = res.map((company) => ({
          ...company,
          color: this.getRandomColor(),
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error: ', err);
        this.companies = [];
        this.isLoading = false;
      },
    });
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
}
