import { Component, OnInit, signal } from '@angular/core';
import { AppStateService } from '../../services/app-state.service';
import { PlanService } from '../plan-service';
import { MatCard } from '@angular/material/card';
import { PlanList } from './plan-list/plan-list';
import { PlanEditor } from './plan-editor/plan-editor';
import { IPlan, Plan } from 'soap-models/dist/plans';
import { AuthService } from '../../services/auth-service';
import { HttpErrorResponse } from '@angular/common/http';

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
export class PlanComponent implements OnInit {
  cardStyle = signal('');
  listStyle = signal('');
  editorStyle = signal('');
  plan = signal<IPlan>(new Plan());
  plans = signal<IPlan[]>([]);

  constructor(
    private viewState: AppStateService,
    private planService: PlanService,
    private authService: AuthService
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
    this.planService.getPlans().subscribe({
      next: (res) => {
        const plist: Plan[] = [];
        const list = res.body as IPlan[];
        list.forEach(plan => {
          plist.push(new Plan(plan));
        });
        plist.sort((a,b) => a.compareTo(b));
        this.plans.set(plist);
      }, error: (err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.authService.errorMsg.set(`Unauthorized: ${err.error}`);
          } else {
            this.authService.errorMsg.set(`${err.status}: ${err.error}`);
          }
        }
      }
    });
  }

  onSelect(id: string) {
    if (id) {
      this.plans().forEach(plan => {
        if (plan.id && plan.id === id) {
          this.plan.set(plan);
        }
      });
    }
  }
}
