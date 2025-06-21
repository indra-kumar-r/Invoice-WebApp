import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-gsts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gsts.component.html',
  styleUrl: './gsts.component.scss',
})
export class GstsComponent {}
