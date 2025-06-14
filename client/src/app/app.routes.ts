import { Routes } from '@angular/router';
import { CompanyComponent } from './features/companies/company/company.component';
import { ManageCompanyComponent } from './features/companies/manage-company/manage-company.component';
import { ManageInvoicesComponent } from './features/invoice/manage-invoices/manage-invoices.component';
import { ViewInvoiceComponent } from './features/invoice/view-invoice/view-invoice.component';
import { InvoiceBasicDetailsComponent } from './features/invoice/invoice-basic-details/invoice-basic-details.component';
import { InvoiceItemsDetailsComponent } from './features/invoice/invoice-items-details/invoice-items-details.component';
import { InvoiceAmountDetailsComponent } from './features/invoice/invoice-amount-details/invoice-amount-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
    title: 'Login - YHE Admin',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'Home - YHE Admin',
  },
  {
    path: 'invoices',
    loadComponent: () =>
      import('./features/invoice/invoice.component').then(
        (m) => m.InvoiceComponent
      ),
    title: 'Invoices - YHE Admin',
    children: [
      {
        path: '',
        component: ManageInvoicesComponent,
      },
      {
        path: 'basic-details/:uuid',
        component: InvoiceBasicDetailsComponent,
      },
      {
        path: 'items-details/:uuid',
        component: InvoiceItemsDetailsComponent,
      },
      {
        path: 'amount-details/:uuid',
        component: InvoiceAmountDetailsComponent,
      },
      {
        path: 'invoice/:uuid',
        component: ViewInvoiceComponent,
      },
    ],
  },
  {
    path: 'gst',
    loadComponent: () =>
      import('./features/gst/gst.component').then((m) => m.GstComponent),
    title: 'GST - YHE Admin',
  },
  {
    path: 'companies',
    loadComponent: () =>
      import('./features/companies/companies.component').then(
        (m) => m.CompaniesComponent
      ),
    title: 'Companies - YHE Admin',
    children: [
      {
        path: '',
        component: ManageCompanyComponent,
      },
      {
        path: 'company/:uuid',
        component: CompanyComponent,
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent
      ),
    title: '404 - YHE Admin',
  },
];
