import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HelpService } from '../../../help/help-service';
import { IPage } from 'soap-models/help';

export interface HelpDialogData {
  pageid: string;
  paragraphid: number;
}

@Component({
  selector: 'app-help-editor-graphic-dialog',
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatDialogModule
  ],
  templateUrl: './help-editor-graphic-dialog.html',
  styleUrl: './help-editor-graphic-dialog.scss'
})
export class HelpEditorGraphicDialog {
  readonly dialogRef = inject(MatDialogRef<HelpEditorGraphicDialog>);
  readonly data = inject<HelpDialogData>(MAT_DIALOG_DATA);
  selectedFile: File | null = null;
  graphForm = new FormGroup({
    caption: new FormControl('', {
      nonNullable: true
    })
  });

  constructor(
    private helpService: HelpService
  ) { }

  onCancel() {
    this.dialogRef.close();
  }

  onSelectFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
    }
  }

  onAdd() {
    if (this.selectedFile) {
      const mimetype = this.selectedFile.type;
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (result !== null) {
          const base64String = result.toString().replace('data:', '')
            .replace(/^.+,/, '');
          this.helpService.addGraphicToHelp(this.data.pageid, 
            this.data.paragraphid, 
            this.graphForm.controls.caption.value,
            mimetype, base64String).subscribe({
            next: (result) => {
              const ipage = result.body as IPage;
              this.dialogRef.close(ipage);
            },
            error: (err) => {
              console.log(err);
            }
          });
        }
      }
      reader.readAsDataURL(this.selectedFile);
      
    }

  }
}
