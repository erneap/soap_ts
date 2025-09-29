import { Component, inject, input, OnChanges, OnInit, output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatError, MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { HelpPageUpdateRequest, IPage, Page, Paragraph } from 'soap-models/help';
import { HelpEditorParagraphBullet } from './help-editor-paragraph-bullet/help-editor-paragraph-bullet';
import { HelpEditorParagraphGraphic } from './help-editor-paragraph-graphic/help-editor-paragraph-graphic';
import { MatDialog } from '@angular/material/dialog';
import { HelpEditorGraphicDialog } from '../help-editor-graphic-dialog/help-editor-graphic-dialog';
import { HelpService } from '../../../help/help-service';
import { AuthService } from '../../../services/auth-service';
import { HttpErrorResponse } from '@angular/common/http';

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
  changed = output<HelpPageUpdateRequest>();
  readonly dialog = inject(MatDialog);

  constructor(
    private helpService: HelpService,
    private authService: AuthService
  ) {}

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

  addGraphic() {
    const parts = this.key()!.split("|");
    const dialogRef = this.dialog.open(HelpEditorGraphicDialog, {
      data: { pageid: parts[0], paragraphid: this.paragraph()!.id }
    });

    dialogRef.afterClosed().subscribe((result: IPage) => {
      const update: HelpPageUpdateRequest = {
        pageid: parts[0],
        field: 'addgraphic',
        value: ''
      }
      this.changed.emit(update);
    });
  }

  updateParagraph(field: string) {
    const parts = this.key()!.split('|');
    let value = '';
    switch (field.toLowerCase()) {
      case "title":
        value = this.paraForm.controls.title.value;
        break;
      case "text":
        value = this.paraForm.controls.text.value;
        break;
    }
    const update: HelpPageUpdateRequest = {
      pageid: parts[0],
      paragraphid: this.paragraph()!.id,
      field: field,
      value: value
    };
    this.changed.emit(update);
  }

  onChange(update: HelpPageUpdateRequest) {
    this.changed.emit(update);
  }
}
