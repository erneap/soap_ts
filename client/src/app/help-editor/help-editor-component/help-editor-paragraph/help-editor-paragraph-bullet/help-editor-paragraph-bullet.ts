import { Component, input, OnChanges, output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Bullet, HelpPageUpdateRequest } from 'soap-models/help';

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
  changed = output<HelpPageUpdateRequest>();

  ngOnChanges(changes: SimpleChanges): void {
    const newBullet = changes['bullet'];
    this.bulletForm.controls.text.setValue(this.bullet()!.text);
  }

  onUpdate(field: string) {
    let value = '';
    if (field.toLowerCase() === 'text') {
      value = this.bulletForm.controls.text.value;
    }
    const parts = this.key()!.split('|')
    const change: HelpPageUpdateRequest = {
      pageid: parts[0],
      paragraphid: Number(parts[1]),
      bulletid: Number(parts[2]),
      field: field,
      value: value
    }
    this.changed.emit(change);
  }
}
