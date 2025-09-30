import { Component, inject, input, OnChanges, OnInit, output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { BibleBook, IReading, Reading } from 'soap-models/plans';
import { PlanDeleteDialog } from '../plan-delete-dialog/plan-delete-dialog';

@Component({
  selector: 'app-plan-reading-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIcon,
    MatTooltip
  ],
  templateUrl: './plan-reading-component.html',
  styleUrl: './plan-reading-component.scss'
})
export class PlanReadingComponent implements OnInit, OnChanges {
  reading = input<Reading>();
  books = input<BibleBook[]>();
  key = input<string>();
  readings = input<number>();
  change = output<string>();
  readonly dialog = inject(MatDialog);
  showActions: boolean = false;
  readingForm = new FormGroup({
    book: new FormControl('', {
      nonNullable: true
    }),
    chapter: new FormControl(0, {
      nonNullable: true
    }),
    start: new FormControl(0, {
      nonNullable: true
    }),
    end: new FormControl(0, {
      nonNullable: true
    })
  })

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['reading'];
    if (change && change.currentValue) {
      const newIRead = change.currentValue as IReading;
      const reading = new Reading(newIRead);
      this.setReading(reading);
    }
  }

  ngOnInit(): void {
    this.setReading(this.reading()!);
  }

  setReading(reading: Reading) {
    this.readingForm.controls.book.setValue(reading.book);
    this.readingForm.controls.chapter.setValue(reading.chapter);
    this.readingForm.controls.start.setValue(reading.verseStart!);
    this.readingForm.controls.end.setValue(reading.verseEnd!);
  }

  onMenu() {
    this.showActions = !this.showActions;
  }

  onDelete(): void {
    const dialogRef = this.dialog.open(PlanDeleteDialog, {
      data: { level: "Day's Reading" },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result === 'yes') {
        console.log(this.key());
        const parts = this.key()?.split('-');
        if (parts) {
          const action = `${parts[0]}-${parts[1]}-${parts[2]}-deletereading-${parts[3]}`;
          this.change.emit(action);
        }
      }
    });
    this.onMenu();
  }

  onEdit(field: string) {
    let value = 'none';
    switch (field.toLowerCase()) {
      case "book":
        value = this.readingForm.controls.book.value;
        break;
      case "chapter":
        value = `${this.readingForm.controls.chapter.value}`;
        break;
      case "start":
        value = `${this.readingForm.controls.start.value}`;
        break;
      case "end":
        value = `${this.readingForm.controls.end.value}`;
        break;
    }
    if (value !== 'none' && value !== 'undefined') {
      const event = `${this.key()!}-${field}-${value}`;
      console.log(event);
      this.change.emit(event);
    }
  }

  onMove(direction: string) {
    this.change.emit(`${this.key()}-move-${direction}`);
    this.onMenu()
  }

  onMenuClear() {
    this.showActions = false;
  }
}
