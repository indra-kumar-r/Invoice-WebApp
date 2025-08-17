import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  tabs = [
    {
      title: 'Invoices',
      path: 'invoices',
      image: 'invoices.jpg',
    },
    {
      title: 'Companies',
      path: 'companies',
      image: 'companies.jpg',
    },
  ];

  activeTab = this.tabs[0];

  constructor(private router: Router) {}

  navigateToTab(path: string): void {
    this.router.navigate([path]);
  }
}
