import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { AppStateService } from '../../../services/app-state.service';
import { MatIcon } from '@angular/material/icon';
import { IPlan, Plan } from 'soap-models/plans';
import { MatDialog } from '@angular/material/dialog';
import { NewPlanDialog } from '../new-plan-dialog/new-plan-dialog';
import { PlanDeleteDialog } from '../plan-editor/plan-delete-dialog/plan-delete-dialog';

@Component({
  selector: 'app-plan-list',
  standalone: true,
  imports: [
    MatIcon
  ],
  templateUrl: './plan-list.html',
  styleUrl: './plan-list.scss'
})
export class PlanList implements OnInit {
  compStyle = signal('');
  labelMainStyle = signal('');
  buttonStyle = signal('');
  labelStyle = signal('');
  listStyle = signal('');
  select = input<string>();
  plans = input<IPlan[]>();
  plan = output<string>()
  readonly dialog = inject(MatDialog)

  constructor(
    private appState: AppStateService
  ) {  }

  ngOnInit(): void {
    const width = this.appState.viewWidth - 60;
    const height = this.appState.viewHeight - 60;
    let lWidth = width * .3;
    if (lWidth > 300) { lWidth = 300; }
    const ratio = lWidth / 300;
    const lHeight = height - 20;
    this.compStyle.set(`height: ${lHeight}px; width: ${lWidth}px;`);
    this.labelMainStyle.set(`height:${40 * ratio}px;`)
    this.buttonStyle.set(`height: ${40 * ratio}px;width: ${40 * ratio}px;`
      + `font-size: ${ratio}rem;`);
    const labelWidth = lWidth - (160 * ratio);
    this.labelStyle.set(`height: ${40 * ratio}px; width: ${labelWidth}px;`);
    this.listStyle.set(`width: ${lWidth}px;`
      + `min-height: ${lHeight - ((40 * ratio) + 2)}px;`
      + `max-height: ${lHeight - ((40 * ratio) + 2)}px;`);
  }
  
  itemClasses(entry: IPlan): string {
    if (entry.id && entry.id === this.select()) {
      return 'item selected';
    } else {
      return 'item';
    }
  }

  onSelect(id: string) {
    this.plan.emit(id);
  }

  onAdd() {
    const dialogRef = this.dialog.open(NewPlanDialog);

    dialogRef.afterClosed().subscribe(result => {
      const key = `new|${result.name}|${result.plantype}|${result.months}`;
      this.plan.emit(key);
    });
  }

  onDelete() {
    const dialogRef = this.dialog.open(PlanDeleteDialog, {
      data: { level: 'Reading Plan'},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === 'yes') {
        this.plan.emit(`delete|${this.select()}`);
      }
    })
  }
}
