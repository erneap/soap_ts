import { Component, input, OnInit, signal } from '@angular/core';
import { AppStateService } from '../../../services/app-state.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-plan-list',
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
}
