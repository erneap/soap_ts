import { Component, OnInit, signal } from '@angular/core';
import { MatCard, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { mustMatchValidator, passwordValidator } from '../../services/auth-password.validator';
import { AppStateService } from '../../services/app-state.service';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { IUser, User } from 'soap-models/users';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    MatCard,
    ReactiveFormsModule,
    MatCardHeader,
    MatCardTitle,
    MatFormField,
    MatInput,
    MatError,
    MatButton,
    MatLabel
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPasswordComponent implements OnInit {
cardStyle = signal('');
  errorMsg = signal('');
  changeForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email ]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [ Validators.required, passwordValidator]
    }),
    verify: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, mustMatchValidator ]
    }),
    token: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  constructor(
    private viewState: AppStateService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const width = this.viewState.viewWidth - 60;
    const height = this.viewState.viewHeight - 60;
    this.cardStyle.set(`height: ${height}px;width: ${width}px;`);
  }
  
  onCancel() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    this.errorMsg.set('');
    if (this.changeForm.valid) {
      this.authService.forgotChange(
        this.changeForm.controls.email.value,
        this.changeForm.controls.token.value,
        this.changeForm.controls.password.value
      ).subscribe({
        next: (res) => {
        const iUser = res.body as IUser;
        if (iUser) {
          this.router.navigate(['/login']);
        }
        }, error: (err) => {
          if (err instanceof HttpErrorResponse) {
            switch (err.status) {
              case 401:
                this.errorMsg.set(`Unauthorized: ${err.error}`);
                break;
              case 400:
                this.errorMsg.set(`Bad Request: ${err.error}`);
                break;
              case 403:
                this.errorMsg.set(`Forbidden: ${err.error}`);
                break;
              case 500:
                this.errorMsg.set(`Server Error: ${err.error}`);
                break;
              default:
                this.errorMsg.set(`${err.status}: ${err.error}`);
            }
          }
        }
      });
    } else {
      this.errorMsg.set('Form not valid');
    }
  }
}
