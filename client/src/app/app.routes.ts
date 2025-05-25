import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'Home - YHE Admin',
  },
  {
    path: 'companies',
    loadComponent: () =>
      import('./features/companies/companies.component').then(
        (m) => m.CompaniesComponent
      ),
    title: 'Companies - YHE Admin',
  },
  {
    path: 'invoices',
    loadComponent: () =>
      import('./features/invoice/invoice.component').then(
        (m) => m.InvoiceComponent
      ),
    title: 'Invoices - YHE Admin',
  },
  {
    path: 'gst',
    loadComponent: () =>
      import('./features/gst/gst.component').then((m) => m.GstComponent),
    title: 'GST - YHE Admin',
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
    title: 'Profile - YHE Admin',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
    title: 'Login - YHE Admin',
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings.component').then(
        (m) => m.SettingsComponent
      ),
    title: 'Settings - YHE Admin',
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
