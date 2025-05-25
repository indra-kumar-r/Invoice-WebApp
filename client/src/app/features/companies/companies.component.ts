import { Component } from '@angular/core';
import { Company } from '../../models/company.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-companies',
  imports: [CommonModule],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss',
})
export class CompaniesComponent {
  companies: Company[] = [
    {
      uuid: 'uuid',
      company_name: 'company_name',
      company_address: 'company_address',
      company_gst_no: 'company_gst_no',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      uuid: 'uuid',
      company_name: 'company_name',
      company_address: 'company_address',
      company_gst_no: 'company_gst_no',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  constructor(private router: Router) {}

  goToHome(): void {
    this.router.navigate(['home']);
  }
}
