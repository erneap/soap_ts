import { ChangeDetectionStrategy, Component, input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { AppStateService } from '../../../services/app-state.service';
import { BooksService } from '../../../books/books-service';
import { BibleBook, IBibleBook, IPlan, Plan } from 'soap-models/dist/plans';
import { MatExpansionModule } from '@angular/material/expansion';
import { PlanMonthComponent } from './plan-month-component/plan-month-component';

@Component({
  selector: 'app-plan-editor',
  imports: [MatExpansionModule, PlanMonthComponent],
  templateUrl: './plan-editor.html',
  styleUrl: './plan-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanEditor implements OnInit, OnChanges {
  formStyle = signal('');
  books: BibleBook[] = [];
  plan = input<IPlan>();

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
    const newplan = change.currentValue as IPlan;
  }
}
