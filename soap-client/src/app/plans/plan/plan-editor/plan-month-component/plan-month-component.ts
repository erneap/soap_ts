import { Component, inject, input, OnChanges, OnInit, output, signal, SimpleChanges } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { BibleBook, IPlanDay, IPlanMonth, PlanDay, PlanMonth } from 'soap-models/plans';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatButton } from '@angular/material/button';
import { PlanReadingComponent } from '../plan-reading-component/plan-reading-component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PlanDeleteDialog } from '../plan-delete-dialog/plan-delete-dialog';

@Component({
  selector: 'app-plan-month-component',
  standalone: true,
  imports: [
    MatExpansionModule,
    PlanReadingComponent, 
    MatIcon, 
    MatTooltip,
    MatButton,
    ReactiveFormsModule
  ],
  templateUrl: './plan-month-component.html',
  styleUrl: './plan-month-component.scss'
})
export class PlanMonthComponent implements OnInit, OnChanges {
  plantype = input<string>('');
  month = input<PlanMonth>();
  books = input<BibleBook[]>();
  key = input<string>();
  day = signal<PlanDay>(new PlanDay())
  change = output<string>();
  months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];
  dayEditorMenu = false;
  monthMenu = false;
  dayForm = new FormGroup({
    days: new FormControl(1, {
      nonNullable: true
    })
  });
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    const month = this.month();
    if (month) {
      month.days.sort((a,b) => a.compareTo(b));
      month.days.forEach(day => {
        day.readings.sort((a,b) => a.compareTo(b));
      })
    }
  }

  onSelectDay(id: number) {
    const day = this.month()!.days.find(day => day.dayOfMonth === id);
    if (day) {
      this.day.set(day);
      this.dayEditorMenu = false;
    }
  }

  showEditor(): boolean {
    const day = this.day();
    return (day && day.dayOfMonth > 0);
  }

  onMonthMenu() {
    this.monthMenu = !this.monthMenu;
  }

  onDayEditorMenu() {
    this.dayEditorMenu = !this.dayEditorMenu;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['month'];
    if (change) {
      let found = false;
      const imonth = change.currentValue as IPlanMonth;
      if (imonth) {
        const month = new PlanMonth(imonth);
        month.days.sort((a,b) => a.compareTo(b));
        month.days.forEach(day => {
          day.readings.sort((a,b) => a.compareTo(b));
        });
        const dayid = this.day()?.dayOfMonth;
        month.days.forEach(day => {
          if (day.dayOfMonth === dayid) {
            found = true;
            const nday = new PlanDay(day);
            nday.readings.sort((a,b) => a.compareTo(b));
            this.day.set(nday);
          }
        });
      }
      if (!found) {
        this.day.set(new PlanDay());
      }
    }
  }

  onChange(action: string) {
    this.change.emit(action);
  }

  onAddDay(multi: boolean) {
    let days = 1;
    if (multi) {
      days = this.dayForm.controls.days.value;
    }
    const action = `${this.key()}-add-${days}`;
    this.change.emit(action);
    this.dayForm.controls.days.setValue(1);
  }

  onAddReading() {
    const action = `${this.key()}-${this.day().dayOfMonth}-addreading-`;
    this.change.emit(action);
  }

  onDayDelete(day: number) {
    const dialogRef = this.dialog.open(PlanDeleteDialog, {
      data: { level: 'Plan Day'},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === 'yes') {
        const action = `${this.key()}-deleteday-${day}`;
        this.change.emit(action);
      }
    });
  }

  onDayMove(direction: string) {
    let day = this.day().dayOfMonth;
    const action = `${this.key()}-${this.day().dayOfMonth}-move-${direction}`;
    (direction.substring(0,2).toLowerCase() === 'up') ? day-- : day++;
    if (this.month()) {
      this.month()!.days.forEach(dday => {
        if (dday.dayOfMonth === day) {
          this.day.set(dday);
        }
      });
    }
    this.change.emit(action);
    
  }
}
