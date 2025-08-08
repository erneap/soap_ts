import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { AppStateService } from '../../services/app-state.service';
import { ISoapEntry, SoapEntry } from 'soap-models/dist/entries';
import { EntryService } from '../entry-service';
import { AuthService } from '../../services/auth-service';
import { EntryList } from "./entry-list/entry-list";

@Component({
  selector: 'app-user-entries',
  imports: [
    MatCardModule,
    EntryList
],
  templateUrl: './user-entries.html',
  styleUrl: './user-entries.scss'
})
export class UserEntries implements OnInit {
  cardStyle = signal('');
  listStyle = signal('');
  editorStyle = signal('');
  entries = signal<SoapEntry[]>([]);
  
  constructor(
    private viewState: AppStateService,
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
    this.listStyle.set(`height: ${lHeight}px; min-width: ${lWidth}px;`
      + `max-width: ${lWidth}px;`);
    this.editorStyle.set(`height: ${lHeight}px; min-width: ${lWidth}px;`
      + `max-width: ${lWidth}px;`);
    const userid = this.authService.user().id?.toString();
    const endDate = new Date(new Date().getTime() + (24 * 3600000));
    const startDate = new Date(endDate.getTime() - (35 * 24 * 3600000));
    if (userid) {
      this.entryService.getUserEntries(userid, startDate, endDate).subscribe(
        res => {
          const elist: SoapEntry[] = []
          const list = res.body as ISoapEntry[];
          if (list.length > 0) {
            list.forEach(iEntry => {
              elist.push(new SoapEntry(iEntry));
            });
          }
          elist.sort((a,b) => a.compareTo(b));
          this.entries.set(elist);
        }
      );
    }
  }
}
