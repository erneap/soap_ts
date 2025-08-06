import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user-service';
import { IUser } from 'soap-models/dist/users';
import { Router } from '@angular/router';

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

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  login() {
    if (this.loginForm.valid) {
      const email = this.loginForm.controls.email.value;
      const password = this.loginForm.controls.password.value;
      this.userService.authenticate(email, password).subscribe(res => {
        const iUser = res.body as IUser;
        if (iUser.email === email) {
          this.router.navigate(['/users'])
        }
      });
    }
  }
}
