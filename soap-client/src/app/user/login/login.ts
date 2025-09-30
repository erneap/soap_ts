import { Component, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { IUser } from 'soap-models/users';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatError,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: Validators.required
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: Validators.required
    })
  });
  errorMsg = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    if (this.loginForm.valid) {
      const email = this.loginForm.controls.email.value;
      const passwd = this.loginForm.controls.password.value;
      this.errorMsg.set('');
      this.authService.authenticate(email, passwd).subscribe({
        next: (res) => {
          const IUser = res.body as IUser;
          if (IUser.lastName !== '') {
            if (IUser.badAttempts < 0) {
              this.router.navigate(['/mustchange']);
            } else {
              this.router.navigate(['/entries']);
            }
          } else {
            this.errorMsg.set('No Last Name');
          }
        }, error: (err) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this.errorMsg.set(`Unauthorized: ${err.error}`);
            } else {
              this.errorMsg.set(`${err.status}: ${err.error}`);
            }
          }
        }
      });
    }
  }

  onClick(page: string) {
    this.router.navigate([`/${page}`]);
  }

  onForgot() {
    const email = this.loginForm.controls.email;
    if (email.hasError('required') || email.hasError('email')) {
      this.errorMsg.set("You need to provide Your Account Email Address")
    } else {
      this.authService.forgotStart(email.value).subscribe({
        next: (res) => {
          const IUser = res.body as IUser;
          if (IUser) {
            this.router.navigate(['/forgot']);
          }
        }, error: (err) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this.errorMsg.set(`Unauthorized: ${err.error}`);
            } else {
              this.errorMsg.set(`${err.status}: ${err.error}`);
            }
          }
        }
      });
    }
  }
}
