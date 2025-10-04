import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StorageService } from './core/services/storage/storage.service';
import { ToasterComponent } from './shared/toaster/toaster.component';
import { ToasterService } from './core/services/toaster/toaster.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ToasterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  originalPassword = 'indra';
  loginForm!: FormGroup;
  loggedIn = true;

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private toasterService: ToasterService
  ) {}

  ngOnInit() {
    this.loggedIn = !!this.storageService.getAuth();

    this.loginForm = this.fb.group({
      password: ['', Validators.required],
    });
  }

  onLogin() {
    const input = this.loginForm.get('password')?.value;

    if (input === this.originalPassword) {
      this.loggedIn = true;
      this.storageService.setAuth('true');
      this.toasterService.toast('Login successful');
    }
  }
}
