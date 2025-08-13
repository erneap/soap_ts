import { Component, input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { BibleBook, IReading, Reading } from 'soap-models/dist/plans';

@Component({
  selector: 'app-plan-reading-component',
  imports: [
    ReactiveFormsModule,
    MatIcon
  ],
  templateUrl: './plan-reading-component.html',
  styleUrl: './plan-reading-component.scss'
})
export class PlanReadingComponent implements OnInit, OnChanges {
  reading = input<Reading>();
  books = input<BibleBook[]>();
  key = input<string>();
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
}
