import { Component, input, output, signal } from '@angular/core';
import { IPage } from 'soap-models/help';
import { AppStateService } from '../../../services/app-state.service';
import { AuthService } from '../../../services/auth-service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-help-list-component',
  standalone: true,
  imports: [],
  templateUrl: './help-list-component.html',
  styleUrl: './help-list-component.scss'
})
export class HelpListComponent {
  compStyle = signal('');
  labelMainStyle = signal('');
  buttonStyle = signal('');
  labelStyle = signal('');
  listStyle = signal('');
  select = input<string>();
  pages = input<IPage[]>();
  page = output<string>();
  editPage = signal<boolean>(false);
  edit = output<boolean>();

  constructor(
    private appState: AppStateService,
    protected authService: AuthService
  ) {  }

  ngOnInit(): void {
    const width = this.appState.viewWidth - 60;
    const height = this.appState.viewHeight - 60;
    let lWidth = width * .3;
    if (lWidth > 300) { lWidth = 300; }
    const ratio = lWidth / 300;
    const lHeight = height - 70;
    this.compStyle.set(`height: ${lHeight}px; width: ${lWidth}px;`);
    this.labelMainStyle.set(`height:${40 * ratio}px;`)
    this.buttonStyle.set(`height: ${40 * ratio}px;width: ${40 * ratio}px;`
      + `font-size: ${ratio}rem;`);
    const labelWidth = lWidth - (160 * ratio);
    this.labelStyle.set(`height: ${40 * ratio}px; width: ${labelWidth}px;`);
    this.listStyle.set(`width: ${lWidth}px;`
      + `min-height: ${lHeight - ((60 * ratio) + 2)}px;`
      + `max-height: ${lHeight - ((60 * ratio) + 2)}px;`);
  }
  
  itemClasses(page: IPage): string {
    if (page.id && page.id === this.select()) {
      return 'item selected';
    } else {
      return 'item';
    }
  }

  onSelect(id: string) {
    this.page.emit(id);
  }

  onCycleEdit() {
    this.editPage.set(!this.editPage());
    this.edit.emit(this.editPage());
  }
}
