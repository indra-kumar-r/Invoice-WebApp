import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GST, GSTItem } from '../../../models/gst.model';
import { GstService } from '../../../core/services/gst/gst.service';

@Component({
  selector: 'app-view-gst',
  imports: [CommonModule],
  templateUrl: './view-gst.component.html',
  styleUrl: './view-gst.component.scss',
})
export class ViewGstComponent {
  gst!: GST;

  sgstAmount: number = 0;
  cgstAmount: number = 0;
  igstAmount: number = 0;
  totalAmount: number = 0;

  isLoading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gstService: GstService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ uuid }) => {
      this.getGst(uuid);
    });
  }

  getGst(id: string): void {
    this.isLoading = true;
    this.gstService.getGst(id).subscribe({
      next: (gst: GST) => {
        this.gst = gst;

        this.sgstAmount =
          gst.gst_items?.reduce(
            (sum: number, item: GSTItem) => sum + (item.sgst || 0),
            0
          ) || 0;
        this.cgstAmount =
          gst.gst_items?.reduce(
            (sum: number, item: GSTItem) => sum + (item.cgst || 0),
            0
          ) || 0;
        this.igstAmount =
          gst.gst_items?.reduce(
            (sum: number, item: GSTItem) => sum + (item.igst || 0),
            0
          ) || 0;
        this.totalAmount =
          gst.gst_items?.reduce(
            (sum: number, item: GSTItem) => sum + (item.total || 0),
            0
          ) || 0;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error: ', err);
        this.gst = {} as GST;
        this.isLoading = false;
      },
    });
  }

  createGst(): void {
    this.router.navigate(['/gsts/gst/create']);
  }

  viewGsts(): void {
    this.router.navigate(['/gsts']);
  }

  editGst(uuid: string): void {
    this.router.navigate(['/gsts/gst/', uuid]);
  }

  printInvoice(): void {
    const printContent = document.querySelector(
      '.view-gst-wrapper'
    ) as HTMLElement;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      const printSection = printContent.innerHTML;
      document.body.innerHTML = printSection;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  }
}
