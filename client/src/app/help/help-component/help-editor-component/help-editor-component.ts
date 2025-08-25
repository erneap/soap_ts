import { Component, input } from '@angular/core';
import { Page } from 'soap-models/dist/help';
import { HelpService } from '../../help-service';

@Component({
  selector: 'app-help-editor-component',
  imports: [],
  templateUrl: './help-editor-component.html',
  styleUrl: './help-editor-component.scss'
})
export class HelpEditorComponent {
  page = input<Page>(new Page());

  constructor(
    private helpService: HelpService
  ) { }
}
