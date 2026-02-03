import { ChangeDetectionStrategy, Component, inject, input, OnChanges, OnInit, output, signal, SimpleChanges } from '@angular/core';
import { BibleBook, IBibleBook, IPlan, IReading, Plan, Reading } from 'soap-models/plans';
import { AuthService } from '../../../services/auth-service';
import { PlanService } from '../../../plans/plan-service';
import { EntryService } from '../../entry-service';
import { AppStateService } from '../../../services/app-state.service';
import { ISoapEntry, SoapEntry } from 'soap-models/entries';
import { User } from 'soap-models/users';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BooksService } from '../../../bibles/books/books-service';
import { MatError, MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckbox } from '@angular/material/checkbox';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { UpdateEntryRequest } from 'soap-models/entries';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { EntryDeleteDialog } from '../entry-delete-dialog/entry-delete-dialog';

export const CUSTOM_DATE_FORMAT = {
  parse: {
    dateInput: 'MM/DD/YYYY',
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateAllyLabel: 'MM/DD/YYYY',
    monthYearAllyLabel: 'MMMM YYYY',
  }
}

@Component({
  selector: 'app-entry',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatError,
    MatCheckbox,
    MatTooltip
],
  templateUrl: './entry.html',
  styleUrl: './entry.scss',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMAT },
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true }},
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Entry implements OnInit, OnChanges {
  private user = signal(new User());
  private plan = signal(new Plan());
  private books: BibleBook[] = [];
  entry = input<SoapEntry>();
  fontsize= input<number>();
  formStyle = signal('');
  readings = signal<IReading[]>([]);
  changed = output<UpdateEntryRequest>();
  readonly dialog = inject(MatDialog);

  editorForm = new FormGroup({
    entrydate: new FormControl(this.entry()?.entryDate, {
      nonNullable: true,
      validators: Validators.required
    }),
    title: new FormControl(this.entry()?.title, {
      nonNullable: true,
      validators: Validators.required
    }),
    scripture: new FormControl(this.entry()?.title, {
      nonNullable: true,
      validators: Validators.required
    }),
    observations: new FormControl(this.entry()?.title, {
      nonNullable: true,
      validators: Validators.required
    }),
    application: new FormControl(this.entry()?.title, {
      nonNullable: true,
      validators: Validators.required
    }),
    prayer: new FormControl(this.entry()?.title, {
      nonNullable: true,
      validators: Validators.required
    }),
    read: new FormControl(this.entry()?.read, {
      nonNullable: true
    })
  });

  constructor(
    private authService: AuthService,
    private planService: PlanService,
    private entryService: EntryService, 
    private bookService: BooksService,
    private appState: AppStateService
  ) {}

  ngOnInit(): void {
    const height = this.appState.viewHeight - 84;
    const width = this.appState.viewWidth - 60;let lWidth = width * .3;
    if (lWidth > 300) { lWidth = 300; }
    let eWidth = width - (lWidth + 45);
    this.formStyle.set(`min-height: ${height}px; max-height: ${height}px;`
      + `width: ${eWidth}px;`);
    this.user.set(this.authService.user());
    const planid = this.user().planId;
    if (planid) {
      this.readings.set([]);
      if (this.entry()) {
        this.planService.getReadingPlan(planid).subscribe(res => {
          this.plan.set(new Plan(res.body as IPlan));
          this.readings.set(this.getPlanReadings(this.entry()?.entryDate));
        });
      }
    }
    this.books = [];
    this.bookService.getBookList().subscribe(res => {
      const booklist = res.body as IBibleBook[];
      booklist.forEach(bk => {
        this.books.push(new BibleBook(bk));
      });
      this.books.sort((a,b) => a.compareTo(b));
    });
  }

  showReading(book: string, chapter: number, start?: number, end?: number) {
    const version = this.authService.user()!.translationId;
    let url = `https://www.blueletterbible.org/${version}/${book}/${chapter}`;
    if (start && end && start > 0 && end >= start)
      url += `/${start}/${end}`;
    window.open(url, 'readings');
  } 

  getPlanReadings(date?: Date): IReading[] {
    const plan = this.plan();
    if (plan && date) {
      switch (plan.type.toLowerCase()) {
        case "bydate":
          const imonth = date.getUTCMonth() + 1;
          const iday = date.getUTCDate();
          const readings: Reading[] = [];
          plan.months.forEach(month => {
            if (month.month === imonth) {
              month.days.forEach(day => {
                if (day.dayOfMonth == iday) {
                  day.readings.forEach(read => {
                    readings.push(new Reading(read));
                  });
                  readings.sort((a,b) => a.compareTo(b));
                }
              });
            }
          });
          return readings;
        case "circular":
          const creadings: Reading[] = [];
          const user = this.authService.user();
          if (user) {
            let start = user.startDate;
            start = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 
              start.getUTCDate()));
            let now = new Date();
            now = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
            let iDays = Math.floor((now.getTime() - start.getTime()) 
              / (24 * 3600000)) % this.plan().months[0].days.length;
            const day = this.plan().months[0].days[iDays];
            day.readings.forEach(r => {
              readings.push(new Reading(r));
            });
            creadings.sort((a, b) => a.compareTo(b));
          }
          return creadings;
      }
    }
    return [];
  }

  readingText(reading: IReading): string {
    let answer = '';
    this.books.forEach(bk => {
      if (bk.abbrev.toLowerCase() === reading.book.toLowerCase() 
        || bk.title.toLowerCase() === reading.book.toLowerCase())
        answer += bk.title;
    });
    answer += ` ${reading.chapter}`;
    if (reading.verseStart && reading.verseEnd && reading.verseStart !== 0) {
      answer += `:${reading.verseStart}-${reading.verseEnd}`
    }
    return answer;
  }

  readingLink(reading: IReading): string {
    let answer = `https://www.blueletterbible.org/${this.user().translationId}`
      + `/${reading.book}/${reading.chapter}`;
    if (reading.verseEnd && reading.verseStart && reading.verseStart !== 0) {
      answer += `/${reading.verseStart}/${reading.verseEnd}`;
    }
    return answer;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['entry'];
    const newentry = change.currentValue as ISoapEntry;
    const entry = new SoapEntry(newentry);
    this.editorForm.controls.entrydate.setValue(new Date(entry.entryDate));
    this.editorForm.controls.title.setValue(entry.title);
    this.editorForm.controls.scripture.setValue(entry.scripture);
    this.editorForm.controls.observations.setValue(entry.observations);
    this.editorForm.controls.application.setValue(entry.application);
    this.editorForm.controls.prayer.setValue(entry.prayer);
    this.editorForm.controls.read.setValue(entry.read);
    this.readings.set(this.getPlanReadings(entry.entryDate));
  }

  onEntryChange(field: string) {
    let value = 'empty';
    switch (field.toLowerCase()) {
      case "entrydate":
        let newdate = this.editorForm.controls.entrydate.value;
        if (newdate) {
          newdate = new Date(newdate);
          newdate = new Date(Date.UTC(newdate.getUTCFullYear(), newdate.getUTCMonth(),
            newdate.getUTCDate()));
          value = new Date(newdate).toISOString();
        }
        break;
      case "title":
        if (this.editorForm.controls.title.value) {
          value = this.editorForm.controls.title.value;
        }
        break;
      case "scripture":
        if (this.editorForm.controls.scripture.value) {
          value = this.editorForm.controls.scripture.value;
        }
        break;
      case "observations":
        if (this.editorForm.controls.observations.value) {
          value = this.editorForm.controls.observations.value;
        }
        break;
      case "application":
        if (this.editorForm.controls.application.value) {
          value = this.editorForm.controls.application.value;
        }
        break;
      case "prayer":
        if (this.editorForm.controls.prayer.value) {
          value = this.editorForm.controls.prayer.value;
        }
        break;
      case "read":
        if (this.editorForm.controls.read.value) {
          value = `${this.editorForm.controls.read.value}`;
        } else {
          value = 'false';
        }
        break;
      case "delete":
        const dialogRef = this.dialog.open(EntryDeleteDialog, { });
        dialogRef.afterClosed().subscribe(result => {
          if (result === 'yes') {
            const change: UpdateEntryRequest = {
              user: '',
              year: (new Date()).getUTCFullYear(),
              id: this.entry()!.id,
              field: field,
              value: 'true'
            };
            this.changed.emit(change);
          }
        });
        break;
    }
    if (value !== 'empty') {
      const change: UpdateEntryRequest = {
        user: '',
        year: this.entry()!.entryDate.getUTCFullYear(),
        id: this.entry()!.id,
        field: field,
        value: value
      };
      this.changed.emit(change);
    }
  }
}
