import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Graphic } from 'soap-models/help';

@Component({
  selector: 'app-help-view-paragraph-graphic-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButton
  ],
  templateUrl: './help-view-paragraph-graphic-dialog.html',
  styleUrl: './help-view-paragraph-graphic-dialog.scss'
})
export class HelpViewParagraphGraphicDialog {
  readonly graphic = inject<Graphic>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<HelpViewParagraphGraphicDialog>);

  getGraphic(): string {
    const grph = new Graphic(this.graphic);
    let answer = `data:${grph.mimetype};base64, `;
    answer += grph.filedata;
    return answer;
  }

  onClose() {
    this.dialogRef.close();
  }
}
