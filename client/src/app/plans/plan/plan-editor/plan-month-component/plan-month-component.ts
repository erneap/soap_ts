import { Component, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { BibleBook, IPlanMonth } from 'soap-models/dist/plans';
import { PlanDayComponent } from '../plan-day-component/plan-day-component';

@Component({
  selector: 'app-plan-month-component',
  imports: [MatExpansionModule, PlanDayComponent],
  templateUrl: './plan-month-component.html',
  styleUrl: './plan-month-component.scss'
})
export class PlanMonthComponent {
  plantype = input<string>('');
  month = input<IPlanMonth>();
  books = input<BibleBook[]>();
  months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];
}
