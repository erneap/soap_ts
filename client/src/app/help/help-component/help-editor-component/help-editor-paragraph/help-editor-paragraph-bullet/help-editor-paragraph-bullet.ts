import { Component, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Bullet } from 'soap-models/dist/help';

@Component({
  selector: 'app-help-editor-paragraph-bullet',
  imports: [
    ReactiveFormsModule,
    MatIcon
  ],
  templateUrl: './help-editor-paragraph-bullet.html',
  styleUrl: './help-editor-paragraph-bullet.scss'
})
export class HelpEditorParagraphBullet {
  bullet = input<Bullet>();
  bulletForm = new FormGroup({
    text: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });
}
