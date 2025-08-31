import { Component, input, OnChanges, SimpleChanges } from '@angular/core';
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
export class HelpEditorParagraphBullet implements OnChanges {
  bullet = input<Bullet>();
  key = input<string>();
  bulletForm = new FormGroup({
    text: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  ngOnChanges(changes: SimpleChanges): void {
    const newBullet = changes['bullet'];
    this.bulletForm.controls.text.setValue(this.bullet()!.text);
  }
}
