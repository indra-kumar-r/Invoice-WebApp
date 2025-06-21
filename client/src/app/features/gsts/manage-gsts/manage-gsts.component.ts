import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GstService } from '../../../core/services/gst/gst.service';
import { GSTRecords } from '../../../models/gst.model';

@Component({
  selector: 'app-manage-gsts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './manage-gsts.component.html',
  styleUrl: './manage-gsts.component.scss',
})
export class ManageGstsComponent {
  gsts: GSTRecords[] = [];
  selectedGst: GSTRecords | null = null;

  constructor(private router: Router, private gstService: GstService) {}

  ngOnInit(): void {
    this.getGsts();
  }

  createGst(): void {
    this.router.navigate(['/gsts/gst/create']);
  }

  getGsts(): void {
    this.gstService.getGsts().subscribe({
      next: (res: GSTRecords[]) => {
        this.gsts = res;
      },
      error: (err) => {
        console.error('Error: ', err);
      },
    });
  }

  editGst(uuid: string): void {
    this.router.navigate(['/gsts/gst/', uuid]);
  }

  selectGst(gst: GSTRecords): void {
    this.selectedGst = gst;
  }

  deleteGST(uuid: string): void {
    this.gstService.deleteGst(uuid).subscribe({
      next: () => {
        this.getGsts();
      },
      error: (err) => {
        console.error('Error: ', err);
      },
    });
  }

  viewGST(uuid: string): void {
    window.open(`/gsts/view-gst/${uuid}`, '_blank');
  }

  navigateToHome(): void {
    this.router.navigate(['home']);
  }
}
