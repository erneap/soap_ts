import { Component, input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatError, MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { Paragraph } from 'soap-models/dist/help';
import { HelpEditorParagraphBullet } from './help-editor-paragraph-bullet/help-editor-paragraph-bullet';
import { HelpEditorParagraphGraphic } from './help-editor-paragraph-graphic/help-editor-paragraph-graphic';

@Component({
  selector: 'app-help-editor-paragraph',
  imports: [
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormField,
    MatInputModule,
    MatLabel,
    MatError,
    MatIcon,
    MatTooltip,
    HelpEditorParagraphBullet,
    HelpEditorParagraphGraphic
],
  templateUrl: './help-editor-paragraph.html',
  styleUrl: './help-editor-paragraph.scss'
})
export class HelpEditorParagraph implements OnInit, OnChanges {
  paragraph = input<Paragraph>();
  key = input<string>();
  paraForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    text: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  ngOnInit(): void {
    if (this.paragraph()) {
      let text = '';
      this.paragraph()!.text.forEach(txt => {
        text += txt;
      });
      this.paraForm.controls.title.setValue(this.paragraph()!.title);
      this.paraForm.controls.text.setValue(text);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const newpara = changes['paragraph'];
    let text = '';
    this.paragraph()!.text.forEach(txt => {
      text += txt;
    });
    this.paraForm.controls.title.setValue(this.paragraph()!.title);
    this.paraForm.controls.text.setValue(text)
  }
}
