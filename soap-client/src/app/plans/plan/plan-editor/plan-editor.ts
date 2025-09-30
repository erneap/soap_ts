import { ChangeDetectionStrategy, Component, input, OnChanges, OnInit, output, signal, SimpleChanges } from '@angular/core';
import { AppStateService } from '../../../services/app-state.service';
import { BooksService } from '../../../bibles/books/books-service';
import { BibleBook, IBibleBook, IPlan, Plan } from 'soap-models/plans';
import { MatExpansionModule } from '@angular/material/expansion';
import { PlanMonthComponent } from './plan-month-component/plan-month-component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';

@Component({
  selector: 'app-plan-editor',
  standalone: true,
  imports: [
    MatExpansionModule, 
    PlanMonthComponent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput
  ],
  templateUrl: './plan-editor.html',
  styleUrl: './plan-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanEditor implements OnInit, OnChanges {
  formStyle = signal('');
  books: BibleBook[] = [];
  plan = input<Plan>();
  change = output<string>();
  editorForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  constructor(
    private appState: AppStateService,
    private bookService: BooksService
  ) {  }

  ngOnInit(): void {
    const height = this.appState.viewHeight - 84;
    const width = this.appState.viewWidth - 60;
    let lWidth = width * .3;
    if (lWidth > 300) { lWidth = 300; }
    let eWidth = width - (lWidth + 45);
    this.formStyle.set(`min-height: ${height}px; max-height: ${height}px;`
      + `width: ${eWidth}px;`);

    this.books = [];
    this.bookService.getBookList().subscribe(res => {
      const booklist = res.body as IBibleBook[];
      booklist.forEach(bk => {
        this.books.push(new BibleBook(bk));
      });
      this.books.sort((a,b) => a.compareTo(b));
    });
  }

  getBook(id: string): string {
    let answer = '';
    this.books.forEach(bk => {
      if (bk.abbrev.toLowerCase() === id.toLowerCase()) {
        answer = bk.title;
      }
    });
    return answer;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['plan'];
    if (change) {
      const newplan = change.currentValue as IPlan;
      this.editorForm.controls.name.setValue(newplan.name);
    }
  }

  onChange(action: string) {
    this.change.emit(action);
  }

  onUpdate(field: string) {
    let update = `${this.plan()!.id}-${field}`;
    let value = `${this.editorForm.controls.name.value}`;
    update += `-${value.replace('-', ' ')}`;
    this.change.emit(update);
  }
}
