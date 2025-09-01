import { Component, signal } from '@angular/core';
import { IPage, Page } from 'soap-models/dist/help';
import { AppStateService } from '../services/app-state.service';
import { HelpService } from '../help/help-service';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { HelpEditorList } from './help-editor-list/help-editor-list';
import { HelpEditorComponent } from './help-editor-component/help-editor-component';

@Component({
  selector: 'app-help-editor',
  imports: [
    MatCardModule,
    HelpEditorList,
    HelpEditorComponent
  ],
  templateUrl: './help-editor.html',
  styleUrl: './help-editor.scss'
})
export class HelpEditor {
  cardStyle = signal('');
  list = signal<Page[]>([]);
  page = signal<Page>(new Page());
  editPage = signal<boolean>(false);

  constructor(
    private viewState: AppStateService,
    private helpService: HelpService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const width = this.viewState.viewWidth - 60;
    const height = this.viewState.viewHeight - 60;
    this.cardStyle.set(`height: ${height}px;width: ${width}px;`); 
    let level = 0;
    if (this.authService.isAdmin()) {
      level = 4;
    }
    this.helpService.getHelpPages(level).subscribe({
      next: (res) => {
        const ipages = res.body as IPage[];
        if (ipages && ipages.length > 0) {
          const pages: Page[] = [];
          ipages.forEach(pg => {
            pages.push(new Page(pg));
          });
          pages.sort((a,b) => a.compareTo(b));
          this.list.set(pages);
          if (pages.length > 0) {
            this.page.set(pages[0]);
          }
        }        
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
  }
    
  onSelect(pageid: string) {
    console.log(pageid);
    if (pageid === 'new') {
      this.helpService.addHelpPage().subscribe({
        next: result => {
          if (result) {
            const ipage = result.body as IPage;
            this.list()!.push(new Page(ipage));
            this.page.set(new Page(ipage));
          }
        },
        error: err => {
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
    } else if (pageid.toLowerCase().startsWith('delete')) {
      const parts = pageid.split('|');
      if (parts.length > 1) {
        this.helpService.deleteHelpPage(parts[1]).subscribe({
          next: result => {
            if (result) {
              if (result.status === 200) {
                this.helpService.getHelpPages(4).subscribe({
                  next: result => {
                    if (result) {
                      const ipages = result.body as IPage[];
                      if (ipages && ipages.length > 0) {
                        const pages: Page[] = [];
                        ipages.forEach(pg => {
                          pages.push(new Page(pg));
                        });
                        pages.sort((a,b) => a.compareTo(b));
                        this.list.set(pages);
                      } 
                      this.page.set(this.list()![0]);     
                    }
                  },
                  error: err => {
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
              }
            }
          },
          error: err => {
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
    } else if (pageid !== '') {
      this.list()!.forEach(page => {
        if (page.id === pageid) {
          this.page.set(new Page(page));
        }
      });
    }
  }

  onChanged(ipage: IPage) {
    const page = new Page(ipage);
    if (this.list()) {
      const list = this.list()!;
      list.forEach((pg, p) => {
        if (pg.id === page.id) {
          list[p] = page;
        }
      });
      this.list.set(list);
    }
    this.page.set(page);
  }
}
