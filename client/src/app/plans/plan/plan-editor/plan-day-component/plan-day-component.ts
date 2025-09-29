import { Component, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { BibleBook, PlanDay } from 'soap-models/plans';
import { PlanReadingComponent } from '../plan-reading-component/plan-reading-component';

@Component({
  selector: 'app-plan-day-component',
  imports: [MatExpansionModule, MatIcon, MatTooltip, PlanReadingComponent],
  templateUrl: './plan-day-component.html',
  styleUrl: './plan-day-component.scss'
})
export class PlanDayComponent {
  day = input<PlanDay>();
  books = input<BibleBook[]>();
  key = input<string>();
}
