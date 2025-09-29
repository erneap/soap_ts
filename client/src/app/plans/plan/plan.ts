import { Component, OnInit, signal } from '@angular/core';
import { AppStateService } from '../../services/app-state.service';
import { PlanService } from '../plan-service';
import { MatCard } from '@angular/material/card';
import { PlanList } from './plan-list/plan-list';
import { PlanEditor } from './plan-editor/plan-editor';
import { IPlan, Plan } from 'soap-models/plans';
import { AuthService } from '../../services/auth-service';
import { HttpErrorResponse } from '@angular/common/http';
import { Message } from 'soap-models/common';

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
  plan = signal<Plan>(new Plan());
  plans = signal<Plan[]>([]);

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
      if (id.startsWith('new')) {
        const parts = id.split('|');
        const months = Number(parts[3]);
        this.planService.addPlan(parts[1], parts[2], months).subscribe({
          next: (res) => {
            const iplan = res.body as IPlan;
            if (iplan) {
              this.plan.set(new Plan(iplan));
              let found = false;
              const plans = this.plans();
              plans.forEach((plan, p) => {
                if (plan.id === iplan.id) {
                  found = true;
                  plans[p] = new Plan(iplan);
                }
              });
              if (!found) {
                plans.push(new Plan(iplan));

              }
              plans.sort((a,b) => a.compareTo(b));
              this.plans.set(plans);
            }
          }, error: (err) => {
            if (err instanceof HttpErrorResponse) {
              switch (err.status) {
                case 401:
                  this.authService.errorMsg.set(`Unauthorized: ${err.error}`);
                  break;
                case 400:
                  this.authService.errorMsg.set(`Bad Request: ${err.error}`);
                  break;
                case 403:
                  this.authService.errorMsg.set(`Forbidden: ${err.error}`);
                  break;
                case 500:
                  this.authService.errorMsg.set(`Server Error: ${err.error}`);
                  break;
                default:
                  this.authService.errorMsg.set(`${err.status}: ${err.error}`);
              }
            }
          }
        });
      } else if (id.startsWith('delete')) {
        const parts = id.split('|');
        this.planService.deletePlan(parts[1]).subscribe({
          next: (res) => {
            const msg = res.body as Message;
            if (msg && msg.message.toLowerCase() === 'plan deleted') {
              const plans = this.plans();
              if (plans) {
                let found = -1;
                plans.forEach((plan, p) => {
                  if (plan.id === parts[1]) {
                    found = p;
                  }
                });
                if (found >= 0) {
                  plans.splice(found, 1);
                }
                this.plans.set(plans);
                this.plan.set(new Plan());
              }
            }
          }, error: (err) => {
            if (err instanceof HttpErrorResponse) {
              switch (err.status) {
                case 401:
                  this.authService.errorMsg.set(`Unauthorized: ${err.error}`);
                  break;
                case 400:
                  this.authService.errorMsg.set(`Bad Request: ${err.error}`);
                  break;
                case 403:
                  this.authService.errorMsg.set(`Forbidden: ${err.error}`);
                  break;
                case 500:
                  this.authService.errorMsg.set(`Server Error: ${err.error}`);
                  break;
                default:
                  this.authService.errorMsg.set(`${err.status}: ${err.error}`);
              }
            }
          }
        });
      } else {
        this.plans().forEach(plan => {
          if (plan.id && plan.id === id) {
            this.plan.set(plan);
          }
        });
      }
    }
  }

  onChange(action: string) {
    if (typeof action === 'string') {
      const parts = action.split('-');
      let id = parts[0];
      let month: number | undefined = undefined;
      let day: number | undefined = undefined;
      let reading: number | undefined = undefined;
      let field = '';
      let value = '';
      switch (parts.length) {
        case 3:
          field = parts[1];
          value = parts[2];
          break;
        case 4:
          month = Number(parts[1]);
          field = parts[2];
          value = parts[3];
          break;
        case 5:
          month = Number(parts[1]);
          day = Number(parts[2]);
          field = parts[3];
          value = parts[4];
          break;
        case 6:
          month = Number(parts[1]);
          day = Number(parts[2]);
          reading = Number(parts[3]);
          field = parts[4];
          value = parts[5];
          break;
        default:
          console.log("Too many values in update");
          break;
      }
      if (field !== '') {
        this.planService.updatePlan(id, field, value, month, day, reading)
          .subscribe({
          next: (res) => {
            const iplan = res.body as IPlan;
            if (iplan) {
              this.plan.set(new Plan(iplan));
              this.plans().forEach((plan, p) => {
                if (plan.id === iplan.id) {
                  this.plans()[p]=new Plan(iplan);
                }
              });
            }
          }, error: (err) => {
            if (err instanceof HttpErrorResponse) {
              switch (err.status) {
                case 401:
                  this.authService.errorMsg.set(`Unauthorized: ${err.error}`);
                  break;
                case 400:
                  this.authService.errorMsg.set(`Bad Request: ${err.error}`);
                  break;
                case 403:
                  this.authService.errorMsg.set(`Forbidden: ${err.error}`);
                  break;
                case 500:
                  this.authService.errorMsg.set(`Server Error: ${err.error}`);
                  break;
                default:
                  this.authService.errorMsg.set(`${err.status}: ${err.error}`);
              }
            }
          }
        });
      }
    }
  }
}
