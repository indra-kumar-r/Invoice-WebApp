import { Component, OnDestroy, OnInit } from '@angular/core';
import { Toast } from '../../models/shared.model';
import { ToasterService } from '../../core/services/toaster/toaster.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-toaster',
  imports: [CommonModule],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate(
          '500ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '1000ms ease-in',
          style({ opacity: 0, transform: 'translateY(-10px)' })
        ),
      ]),
    ]),
  ],
})
export class ToasterComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subscription?: Subscription;

  constructor(private toasterService: ToasterService) {}

  ngOnInit() {
    this.subscription = this.toasterService.toasts$.subscribe((toasts) => {
      this.toasts = toasts;
    });
  }

  dismiss(id: number) {
    this.toasterService.dismiss(id);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
