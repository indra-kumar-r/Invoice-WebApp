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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  originalPassword = 'indra';
  loginForm!: FormGroup;
  loggedIn = true;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const userlogin = sessionStorage.getItem('userlogin');
    this.loggedIn = userlogin === 'true';

    this.loginForm = this.fb.group({
      password: ['', Validators.required],
    });
  }

  onLogin() {
    const input = this.loginForm.get('password')?.value;

    if (input === this.originalPassword) {
      this.loggedIn = true;
      sessionStorage.setItem('userlogin', 'true');
    } else {
      this.loggedIn = false;
      sessionStorage.removeItem('userlogin');
    }
  }
}
