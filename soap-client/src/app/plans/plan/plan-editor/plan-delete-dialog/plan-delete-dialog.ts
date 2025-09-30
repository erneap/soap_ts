import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface PlanDialogData {
  level: string;
}

@Component({
  selector: 'app-plan-delete-dialog',
  standalone: true,
  imports: [ MatDialogModule, MatButton ],
  templateUrl: './plan-delete-dialog.html',
  styleUrl: './plan-delete-dialog.scss'
})
export class PlanDeleteDialog {
  readonly dialogRef = inject(MatDialogRef<PlanDeleteDialog>);
  readonly data = inject<PlanDialogData>(MAT_DIALOG_DATA);
}
