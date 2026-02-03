import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { AppStateService } from '../../services/app-state.service';
import { ISoapEntry, SoapEntry, UpdateEntryRequest } from 'soap-models/entries';
import { EntryService } from '../entry-service';
import { AuthService } from '../../services/auth-service';
import { EntryList } from "./entry-list/entry-list";
import { Entry } from "./entry/entry";
import { HttpErrorResponse } from '@angular/common/http';
import { Message } from 'soap-models/common';

@Component({
  selector: 'app-user-entries',
  standalone: true,
  imports: [
    MatCardModule,
    EntryList,
    Entry
],
  templateUrl: './user-entries.html',
  styleUrl: './user-entries.scss'
})
export class UserEntries implements OnInit {
  cardStyle = signal('');
  listStyle = signal('');
  editorStyle = signal('');
  fontsize = signal(10);
  entries = signal<SoapEntry[]>([]);
  entry = signal<SoapEntry>(new SoapEntry());
  
  constructor(
    protected viewState: AppStateService,
    private entryService: EntryService,
    private authService: AuthService
  ) {}

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
    const userid = this.authService.user().id?.toString();
    if (this.authService.user()!.fontsize) {
      this.fontsize.set(this.authService.user().fontsize);
    }
    const endDate = new Date(new Date().getTime() + (24 * 3600000));
    const startDate = new Date(endDate.getTime() - (35 * 24 * 3600000));
    this.authService.errorMsg.set('');
    if (userid) {
      this.entryService.getUserEntries(userid, startDate, endDate).subscribe({
        next: (res) => {
          const elist: SoapEntry[] = []
          const list = res.body as ISoapEntry[];
          if (list.length > 0) {
            list.forEach(iEntry => {
              elist.push(new SoapEntry(iEntry));
            });
          }
          elist.sort((a,b) => b.compareTo(a));
          this.entries.set(elist);
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
  }

  onSelect(id: string) {
    if (id.toLowerCase() === 'new') {
      let newdate = new Date();
      newdate = new Date(Date.UTC(newdate.getFullYear(), newdate.getMonth(), 
        newdate.getDate()));
      let found = false;
      this.entries()!.forEach(entry => {
        if (entry.useEntryByDate(newdate)) {
          newdate = new Date(newdate.getTime() + (24 * 3600000));
        }
      })
      this.entryService.newEntry(this.authService.user()!.id, newdate).subscribe({
        next: (res) => {
          const entry = new SoapEntry(res.body as ISoapEntry);
          this.entries()!.push(entry);
          this.entries()!.sort((a,b) => b.compareTo(a));
          this.entry.set(entry);
        }, error: (err) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this.authService.errorMsg.set(`Unauthorized: ${err.error}`);
            } else {
              //this.authService.errorMsg.set(`${err.status}: ${JSON.stringify(err.error)}`);
              console.log(JSON.stringify(err.error));
            }
          }
        }
      });
    } else if (id === '') {
      this.entry.set(new SoapEntry());
    } else {
      const entryDate = new Date(Date.parse(id));
      this.entries()!.forEach(entry => {
        if (entry.useEntry(id)) {
          this.entry.set(entry);
        }
      });
    }
  }

  onEntryChange(change: UpdateEntryRequest) {
    if (change.field !== 'delete') {
      change.user = this.authService.user()!.id;
      this.authService.errorMsg.set('');
      this.entryService.updateEntry(change.user, change.year, change.id, change.field, change.value).subscribe({
        next: (res) => {
          const entry = new SoapEntry(res.body as ISoapEntry);
          for (let e=0; e < this.entries()!.length; e++) {
            if (this.entries()![e].useEntry(change.id)) {
              this.entries()![e] = entry;
            }
          }
          this.entries()!.sort((a,b) => b.compareTo(a));
          if (change.field.toLowerCase() === 'entrydate' || change.field.toLowerCase() === 'date') {
            this.entry.set(entry);
          }
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
    } else {
      this.entryService.deleteEntry(this.authService.user().id, change.year, 
      change.id).subscribe(res => {
        const msg = res.body as Message;
        if (msg.message.toLowerCase() === 'deletion completed') {
          this.entry.set(new SoapEntry());
          let found = -1;
          const entries = this.entries();
          for (let e=0; e < entries.length && found < 0; e++) {
            if (entries[e].useEntry(change.id)) {
              found = e;
            }
          }
          if (found >= 0) {
            entries.splice(found, 1);
          }
          this.entries.set(entries);
        }
      });
    }
  }
}
