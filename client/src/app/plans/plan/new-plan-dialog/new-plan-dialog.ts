import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef
} from '@angular/material/dialog';
import { NewPlanRequest } from 'soap-models/plans';

@Component({
  selector: 'app-new-plan-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatError,
    MatSelect,
    MatOption,
    MatButton,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose
],
  templateUrl: './new-plan-dialog.html',
  styleUrl: './new-plan-dialog.scss'
})
export class NewPlanDialog {
  readonly dialogRef = inject(MatDialogRef<NewPlanDialog>);
  dialogForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    plantype: new FormControl('circular', {
      nonNullable: true,
      validators: [Validators.required ]
    })
  });
  answer: NewPlanRequest = {
    name: '',
    plantype: 'circular',
    months: 1
  };

  onCancelClick(): void {
    this.dialogRef.close();
  }

  changeName(): void {
    this.answer.name = this.dialogForm.controls.name.value;
  }

  changeType(): void {
    this.answer.plantype = this.dialogForm.controls.plantype.value;
    if (this.answer.plantype === 'bydate') {
      this.answer.months = 12;
    } else {
      this.answer.months = 1;
    }
  }
}
