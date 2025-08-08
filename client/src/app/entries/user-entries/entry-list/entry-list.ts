import { Component, input, OnChanges, OnInit, output, signal, SimpleChanges } from '@angular/core';
import { ISoapEntry, SoapEntry } from 'soap-models/dist/entries';
import { AppStateService } from '../../../services/app-state.service';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-entry-list',
  imports: [
    MatIcon,
    MatTooltipModule
  ],
  templateUrl: './entry-list.html',
  styleUrl: './entry-list.scss'
})
export class EntryList implements OnInit, OnChanges {
  entries = input<{ entries: ISoapEntry[] }>();
  selected = output<string>();
  compStyle = signal('');
  labelMainStyle = signal('');
  buttonStyle = signal('');
  labelStyle = signal('');
  listStyle = signal('');
  entryArray: SoapEntry[] = [];

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
    const labelWidth = lWidth - (80 * ratio);
    this.labelStyle.set(`height: ${40 * ratio}px; width: ${labelWidth}px;`);
    this.listStyle.set(`width: ${lWidth}px;`
      + `min-height: ${lHeight - ((40 * ratio) + 2)}px;`
      + `max-height: ${lHeight - ((40 * ratio) + 2)}px;`);
    this.convertEntries(this.entries()!.entries)
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['entries'];
    const newEntries = change.currentValue;
    this.convertEntries(newEntries.entries);
  }

  convertEntries(entries: ISoapEntry[]) {
    this.entryArray = [];
    entries.forEach(entry => {
      this.entryArray.push(new SoapEntry(entry));
    });
    this.entryArray.sort((a,b) => b.compareTo(a));
  }

  getLabel(entry: SoapEntry): string {
    const months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec' ];
    return `${months[entry.entryDate.getMonth()]} ${entry.entryDate.getDate()}, `
      + `${entry.entryDate.getFullYear()} - ${entry.title}`;
  }

  chooseSoapEntry(id: string) {
    this.selected.emit(id);
  }
}
