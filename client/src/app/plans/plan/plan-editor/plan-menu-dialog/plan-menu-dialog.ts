import { Component, inject, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PlanDialogData } from '../plan-delete-dialog/plan-delete-dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-plan-menu-dialog',
  imports: [ MatDialogModule, MatIconButton, MatIcon, MatTooltip ],
  templateUrl: './plan-menu-dialog.html',
  styleUrl: './plan-menu-dialog.scss'
})
export class PlanMenuDialog implements OnInit {
  readonly dialogRef = inject(MatDialogRef<PlanMenuDialog>);
  readonly data = inject<PlanDialogData>(MAT_DIALOG_DATA);

  onClick(action: string) {
    const result = `${this.data.key}-${action}`;
    this.dialogRef.close(result);
  }

  ngOnInit(): void {
    console.log(JSON.stringify(this.data));
  }
}
