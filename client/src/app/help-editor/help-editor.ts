import { Component, signal } from '@angular/core';
import { HelpPageUpdateRequest, IPage, Page } from 'soap-models/help';
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
    } else if (pageid !== '') {
      this.list()!.forEach(page => {
        if (page.id === pageid) {
          this.page.set(new Page(page));
        }
      });
    }
  }

  onChanged(update: HelpPageUpdateRequest) {
    if (update.pageid !== '') {
      if (!update.paragraphid && !update.bulletid && !update.graphicid
        && update.field.toLowerCase() === 'delete') {
        this.helpService.deleteHelpPage(update.pageid).subscribe({
          next: result => {
            if (result.status === 200) {
              // remove page from list
              const list = this.list()!;
              let found = -1;
              list.forEach((page, p) => {
                if (page.id === update.pageid) {
                  found = p;
                }
              });
              if (found >= 0) {
                list.splice(found, 1);
              }
              list.sort((a,b) => a.compareTo(b));
              if (list.length > 0) {
                this.page.set(new Page(list[0]));
              }
              this.list.set(list);
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
      } else {
        let type: string | undefined = undefined;
        let subid: number | undefined = undefined;
        if (update.bulletid) {
          type = 'bullet';
          subid = update.bulletid;
        } else if (update.graphicid) {
          type = 'graphic';
          subid = update.graphicid;
        }
        this.helpService.updateHelpPage(update.pageid, update.field, 
          update.value, update.paragraphid, subid, type).subscribe({
          next: result => {
            const ipage = result.body as IPage;
            const list = this.list()!;
            list.forEach((page, p) => {
              if (page.id === update.pageid) {
                list[p] = new Page(ipage);
              }
            });
            this.list.set(list);
            this.page.set(new Page(ipage));
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
  }
}
