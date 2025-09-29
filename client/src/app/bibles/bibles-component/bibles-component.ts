import { Component, OnInit, signal } from '@angular/core';
import { BibleBook, IBibleBook, ITranslation, Translation } from 'soap-models/plans';
import { BooksService } from '../books/books-service';
import { TranslationsService } from '../translations/translations-service';
import { AuthService } from '../../services/auth-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-bibles-component',
  imports: [],
  templateUrl: './bibles-component.html',
  styleUrl: './bibles-component.scss'
})
export class BiblesComponent implements OnInit {
  books = signal<BibleBook[]>([]);
  translations = signal<Translation[]>([]);

  constructor(
    private bookService: BooksService,
    private transService: TranslationsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.bookService.getBookList().subscribe({
      next: (res) => {
        const books = res.body as IBibleBook[];
        const list: BibleBook[] = [];
        books.forEach(book => {
          list.push(new BibleBook(book));
        });
        list.sort((a,b) => a.compareTo(b));
        this.books.set(list);
      }, error: (err) => {
        if (err instanceof HttpErrorResponse) {
          switch (err.status) {
            case 401:
              this.authService.errorMsg.set(`Unauthorized: ${err.error}`);
              break;
            case 400:
              this.authService.errorMsg.set(`Bad Request: ${err.error}`);
              break;
            case 403:
              this.authService.errorMsg.set(`Forbidden: ${err.error}`);
              break;
            case 500:
              this.authService.errorMsg.set(`Server Error: ${err.error}`);
              break;
            default:
              this.authService.errorMsg.set(`${err.status}: ${err.error}`);
          }
        }
      }
    });
    this.transService.getTranslations().subscribe({
      next: (res) => {
        const translations = res.body as ITranslation[];
        const list: Translation[] = [];
        translations.forEach(trans => {
          list.push(new Translation(trans));
        });
        list.sort((a,b) => a.compareTo(b));
        this.translations.set(list);
      }, error: (err) => {
        if (err instanceof HttpErrorResponse) {
          switch (err.status) {
            case 401:
              this.authService.errorMsg.set(`Unauthorized: ${err.error}`);
              break;
            case 400:
              this.authService.errorMsg.set(`Bad Request: ${err.error}`);
              break;
            case 403:
              this.authService.errorMsg.set(`Forbidden: ${err.error}`);
              break;
            case 500:
              this.authService.errorMsg.set(`Server Error: ${err.error}`);
              break;
            default:
              this.authService.errorMsg.set(`${err.status}: ${err.error}`);
          }
        }
      }
    })
  }
}
