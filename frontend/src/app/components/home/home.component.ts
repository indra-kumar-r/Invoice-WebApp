import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  @Output() switchComponentEvent = new EventEmitter<string>();

  switchComponent(component: string) {
    this.switchComponentEvent.emit(component);
  }
}
