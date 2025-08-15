import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-user',
  imports: [],
  templateUrl: './create-user.html',
  styleUrl: './create-user.scss'
})
export class CreateUserComponent {
  newUserForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email ]
    }),
    first: new FormControl('', {
      nonNullable: true,
      validators: [ Validators.required ]
    }),
    middle: new FormControl(''),
    last: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    plan: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    translation: new FormControl('NKJV', {
      nonNullable: true,
      validators: [ Validators.required ]
    }),
    start: new FormControl(new Date(), {
      nonNullable: true
    })
  });
}
