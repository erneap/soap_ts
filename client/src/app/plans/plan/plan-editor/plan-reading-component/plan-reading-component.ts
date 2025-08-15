import { Component, inject, input, OnChanges, OnInit, output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { BibleBook, IReading, Reading } from 'soap-models/dist/plans';
import { PlanDeleteDialog } from '../plan-delete-dialog/plan-delete-dialog';

@Component({
  selector: 'app-plan-reading-component',
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
    const newIRead = change.currentValue as IReading;
    const reading = new Reading(newIRead);
    this.setReading(reading);
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
      data: { plantype: 'reading' },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result === 'yes') {
        console.log(this.key());
        this.change.emit(`${this.key()}-delete`);
      }
    });
    this.onMenu();
  }

  onMove(direction: string) {
    console.log(direction);
    this.onMenu()
  }

  onMenuClear() {
    this.showActions = false;
  }
}
