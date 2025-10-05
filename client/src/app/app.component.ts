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
import { environment } from '../environments/environment';

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
  password = environment.loginDetails.password;
  loginForm!: FormGroup;
  isLoggedIn = true;

  constructor(
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    private toasterService: ToasterService
  ) {}

  ngOnInit() {
    this.isLoggedIn = !!this.storageService.getAuth();

    this.loginForm = this.formBuilder.group({
      password: ['', Validators.required],
    });
  }

  onLogin() {
    const input = this.loginForm.get('password')?.value;

    if (input === this.password) {
      this.isLoggedIn = true;
      this.storageService.setAuth('true');
      this.toasterService.toast('Login successful');
    }
  }
}
