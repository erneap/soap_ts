import { Component, input, OnChanges, output, signal, SimpleChanges } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { BibleBook, IPlanDay, PlanDay, PlanMonth } from 'soap-models/dist/plans';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatButton } from '@angular/material/button';
import { PlanReadingComponent } from '../plan-reading-component/plan-reading-component';

@Component({
  selector: 'app-plan-month-component',
  imports: [
    MatExpansionModule,
    PlanReadingComponent, 
    MatIcon, 
    MatTooltip,
    MatButton
  ],
  templateUrl: './plan-month-component.html',
  styleUrl: './plan-month-component.scss'
})
export class PlanMonthComponent implements OnChanges {
  plantype = input<string>('');
  month = input<PlanMonth>();
  books = input<BibleBook[]>();
  key = input<string>();
  day = signal<PlanDay>(new PlanDay())
  change = output<string>();
  months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];

  onSelectDay(id: number) {
    const day = this.month()!.days.find(day => day.dayOfMonth === id);
    if (day) {
      this.day.set(day);
    }
  }

  showEditor(): boolean {
    const day = this.day();
    return (day && day.dayOfMonth > 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['day'];

  }

  onChange(action: string) {
    console.log(action);
    this.change.emit(action);
  }
}
