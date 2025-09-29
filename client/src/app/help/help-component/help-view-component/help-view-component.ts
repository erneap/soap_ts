import { Component, input, OnInit, signal } from '@angular/core';
import { IPage, Page } from 'soap-models/help';
import { AppStateService } from '../../../services/app-state.service';
import { HelpViewParagraph } from './help-view-paragraph/help-view-paragraph';

@Component({
  selector: 'app-help-view-component',
  imports: [
    HelpViewParagraph
  ],
  templateUrl: './help-view-component.html',
  styleUrl: './help-view-component.scss'
})
export class HelpViewComponent implements OnInit {
  formStyle = signal('');
  page = input<IPage>();

  constructor(
    private appState: AppStateService
  ) {}

  ngOnInit(): void {
    const height = this.appState.viewHeight - 144;
    const width = this.appState.viewWidth - 60;
    let lWidth = width * .3;
    if (lWidth > 300) { lWidth = 300; }
    let eWidth = width - (lWidth + 45);
    this.formStyle.set(`min-height: ${height}px; max-height: ${height}px;`
      + `width: ${eWidth}px;`);
  }
}
