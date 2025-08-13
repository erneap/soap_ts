import { Component, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { BibleBook, PlanMonth } from 'soap-models/dist/plans';
import { PlanDayComponent } from '../plan-day-component/plan-day-component';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-plan-month-component',
  imports: [MatExpansionModule, PlanDayComponent, MatIcon, MatTooltip],
  templateUrl: './plan-month-component.html',
  styleUrl: './plan-month-component.scss'
})
export class PlanMonthComponent {
  plantype = input<string>('');
  month = input<PlanMonth>();
  books = input<BibleBook[]>();
  key = input<string>();
  months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];
}
