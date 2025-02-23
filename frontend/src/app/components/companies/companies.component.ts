import { Component } from '@angular/core';

@Component({
  selector: 'app-companies',
  imports: [],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss',
})
export class CompaniesComponent {
  offcanvasTitle: string = 'Add Company';

  inputCompanyName: string = '';
  inputCompanyAddress: string = '';
  inputCompanyGSTINNumber: string = '';

  submitCompanyDetails() {
    console.log(
      this.inputCompanyName,
      this.inputCompanyAddress,
      this.inputCompanyGSTINNumber
    );
  }
}
