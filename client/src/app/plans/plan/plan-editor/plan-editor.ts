import { Component, OnInit, signal } from '@angular/core';
import { AppStateService } from '../../../services/app-state.service';
import { BooksService } from '../../../books/books-service';
import { BibleBook, IBibleBook } from 'soap-models/dist/plans';

@Component({
  selector: 'app-plan-editor',
  imports: [],
  templateUrl: './plan-editor.html',
  styleUrl: './plan-editor.scss'
})
export class PlanEditor implements OnInit {
  formStyle = signal('');
  private books: BibleBook[] = [];

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
}
