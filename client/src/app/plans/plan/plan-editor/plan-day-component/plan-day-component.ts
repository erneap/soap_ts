import { Component, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { BibleBook, IPlanDay } from 'soap-models/dist/plans';

@Component({
  selector: 'app-plan-day-component',
  imports: [MatExpansionModule],
  templateUrl: './plan-day-component.html',
  styleUrl: './plan-day-component.scss'
})
export class PlanDayComponent {
  day = input<IPlanDay>();
  books = input<BibleBook[]>();
}
