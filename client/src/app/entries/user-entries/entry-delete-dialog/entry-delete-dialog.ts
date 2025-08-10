import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-entry-delete-dialog',
  imports: [ 
    MatButton, 
    MatDialogModule 
  ],
  templateUrl: './entry-delete-dialog.html',
  styleUrl: './entry-delete-dialog.scss'
})
export class EntryDeleteDialog {

}
