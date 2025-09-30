import { Component, input, OnChanges, OnInit, output, signal, SimpleChanges } from '@angular/core';
import { HelpPageUpdateRequest, IPage, Page } from 'soap-models/help';
import { HelpService } from '../../help/help-service';
import { AppStateService } from '../../services/app-state.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAccordion } from "@angular/material/expansion";
import { HelpEditorParagraph } from './help-editor-paragraph/help-editor-paragraph';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatCheckbox } from '@angular/material/checkbox';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-help-editor-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatAccordion,
    HelpEditorParagraph,
    MatButtonModule,
    MatIcon,
    MatTooltip,
    MatCheckbox
],
  templateUrl: './help-editor-component.html',
  styleUrl: './help-editor-component.scss'
})
export class HelpEditorComponent implements OnInit, OnChanges {
  page = input<Page>(new Page());
  formStyle = signal('');
  accordionStyle = signal('');
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
  });
  changed = output<HelpPageUpdateRequest>();

  constructor(
    private helpService: HelpService,
    private appState: AppStateService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const height = this.appState.viewHeight - 144;
    const width = this.appState.viewWidth - 60;
    let lWidth = width * .3;
    if (lWidth > 300) { lWidth = 300; }
    let eWidth = width - (lWidth + 80);
    this.formStyle.set(`width: ${eWidth}px;`);
    this.accordionStyle.set(`width: ${eWidth}px;`);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const newpage = changes['page'];
    this.pageForm.controls.page.setValue(this.page()!.page);
    this.pageForm.controls.header.setValue(this.page()!.header);
    this.pageForm.controls.subheader.setValue(this.page()!.subheader);
    this.pageForm.controls.admin.setValue(this.page()!.hasPermission(4));
  }

  onChange(newpage: HelpPageUpdateRequest) {
    this.changed.emit(newpage);
  }

  updateField(field: string) {
    let value = '';
    switch (field.toLowerCase()) {
      case "page":
        value = this.pageForm.controls.page.value.toString();
        break;
      case "header":
        value = this.pageForm.controls.header.value;
        break;
      case "subheader":
        value = this.pageForm.controls.subheader.value;
        break;
      case "admin":
        value = (this.pageForm.controls.admin.value) ? 'true' : 'false';
        break;
      case "add":
      case "addparagraph":
        break
    }
    const update: HelpPageUpdateRequest = {
      pageid: this.page().id,
      field: field,
      value: value
    };
    this.changed.emit(update);
  }

  onDelete() {
    const update: HelpPageUpdateRequest = {
      pageid: this.page()!.id,
      field: 'delete',
      value: ''
    }
    this.changed.emit(update);
  }
}
