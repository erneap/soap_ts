import { Component, input, signal } from '@angular/core';
import { Page } from 'soap-models/dist/help';
import { HelpService } from '../../help-service';
import { AppStateService } from '../../../services/app-state.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-help-editor-component',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './help-editor-component.html',
  styleUrl: './help-editor-component.scss'
})
export class HelpEditorComponent {
  page = input<Page>(new Page());
  formStyle = signal('');
  pageForm = new FormGroup({
    page: new FormControl(1, { 
      nonNullable: true,
      validators: [ Validators.required, Validators.min(1) ]
    }),
    header: new FormControl('', {
      nonNullable: true,
      validators: Validators.required
    }),
    subheader: new FormControl('', {
      nonNullable: true
    }),
    admin: new FormControl(false, { nonNullable: true })
  })

  constructor(
    private helpService: HelpService,
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
