import { Component } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { GstComponent } from './components/gst/gst.component';
import { CompaniesComponent } from './components/companies/companies.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomeComponent, InvoiceComponent, GstComponent, CompaniesComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  activeComponent: string = 'home';
  homeComponentAcive: boolean = true;
  invoiceComponentAcive: boolean = false;
  gstComponentAcive: boolean = false;
  companiesComponentAcive: boolean = false;

  ngOnChanges(changes: any): void {
    if (changes['activeComponent']) {
      console.log('Component chnages: ', this.activeComponent);
    }
  }

  switchComponent(component: string) {
    this.activeComponent = component;
    this.homeComponentAcive = component === 'home';
    this.invoiceComponentAcive = component === 'invoice';
    this.gstComponentAcive = component === 'gst';
    this.companiesComponentAcive = component === 'companies';
  }
}
