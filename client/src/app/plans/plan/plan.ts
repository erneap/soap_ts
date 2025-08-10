import { Component, OnInit, signal } from '@angular/core';
import { AppStateService } from '../../services/app-state.service';
import { PlanService } from '../plan-service';
import { MatCard } from '@angular/material/card';
import { PlanList } from './plan-list/plan-list';
import { PlanEditor } from './plan-editor/plan-editor';

@Component({
  selector: 'app-plan',
  imports: [
    MatCard,
    PlanList,
    PlanEditor
  ],
  templateUrl: './plan.html',
  styleUrl: './plan.scss'
})
export class Plan implements OnInit {
  cardStyle = signal('');
  listStyle = signal('');
  editorStyle = signal('');

  constructor(
    private viewState: AppStateService,
    private planService: PlanService
  ) { }

  ngOnInit(): void {
    const width = this.viewState.viewWidth - 60;
    const height = this.viewState.viewHeight - 60;
    this.cardStyle.set(`height: ${height}px;width: ${width}px;`); 
    let lWidth = width * .3;
    if (lWidth > 300) { lWidth = 300; }
    let eWidth = width - (lWidth + 45);
    const lHeight = height - 20;
    this.listStyle.set(`height: ${lHeight}px; width: ${lWidth}px;`);
    this.editorStyle.set(`height: ${lHeight}px; width: ${eWidth};`);
  }
}
