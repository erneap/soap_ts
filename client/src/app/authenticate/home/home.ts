import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  imports: [ 
    MatCardModule,
    MatInput,
    MatButton,
    MatFormField,
    MatLabel,
    MatError,
    ReactiveFormsModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  formGroup = new FormGroup({
    email: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true })
  });
  private authService: AuthService;

  constructor(
  ) {
    this.authService = new AuthService();
  }

  login() {
    const email = this.formGroup.controls.email.value;
    const password = this.formGroup.controls.password.value;
    console.log(`${email} - ${password}`);
  }
}
