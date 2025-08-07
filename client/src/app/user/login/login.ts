import { Component, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { IUser } from 'soap-models/dist/users';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
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
            this.router.navigate(['//entries']);
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
      })
    }
  }
}
