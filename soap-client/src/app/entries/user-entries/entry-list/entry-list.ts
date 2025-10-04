import { Component, inject, input, OnChanges, OnInit, output, signal, SimpleChanges } from '@angular/core';
import { ISoapEntry, SoapEntry } from 'soap-models/entries';
import { AppStateService } from '../../../services/app-state.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { EntryDeleteDialog } from '../entry-delete-dialog/entry-delete-dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-entry-list',
  standalone: true,
  imports: [
    MatTooltipModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatIcon
  ],
  templateUrl: './entry-list.html',
  styleUrl: './entry-list.scss'
})
export class EntryList implements OnInit, OnChanges {
  readonly dialog = inject(MatDialog);
  entries = input<{ entries: ISoapEntry[] }>();
  select = input<string>();
  fontsize = input<number>();
  selected = output<string>();
  compStyle = signal('');
  labelMainStyle = signal('');
  buttonStyle = signal('');
  labelStyle = signal('');
  listStyle = signal('');
  entryArray: SoapEntry[] = [];
  mobileForm = new FormGroup({
    entryList: new FormControl('', { nonNullable: true })
  });

  constructor(
    protected appState: AppStateService
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

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['entries'];
    if (change) {
      const newEntries = change.currentValue;
    }
  }

  getLabel(entry: ISoapEntry): string {
    const months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec' ];
    let bNew = '';
    if (entry && !entry.read) {
      bNew = ' * '
    }
    return `${bNew}${months[entry.entryDate.getMonth()]} ${entry.entryDate.getDate()}, `
      + `${entry.entryDate.getFullYear()} - ${entry.title}`;
  }

  chooseSoapEntry(id: string) {
    this.selected.emit(id);
  }

  onSelectEntry() {
    const entry = this.mobileForm.controls.entryList.value;
    if (entry !== '') {
      this.selected.emit(entry);
    }
  }

  onNew() {
    this.selected.emit('new');
  }

  onDelete() {
    const dialogRef = this.dialog.open(EntryDeleteDialog, { });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.selected.emit(`delete-${this.select()}`);
      }
    });
  }

  itemClasses(ientry: ISoapEntry): string {
    const entry = new SoapEntry(ientry);
    if (entry.id === this.select()) {
      return 'item selected';
    } else {
      return 'item';
    }
  }
}
