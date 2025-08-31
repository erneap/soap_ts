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
    this.helpService.getHelpPages().subscribe({
      next: (res) => {
        const ipages = res.body as IPage[];
        if (ipages && ipages.length > 0) {
          const pages: Page[] = [];
          ipages.forEach(pg => {
            pages.push(new Page(pg));
          });
          pages.sort((a,b) => a.compareTo(b));
          this.list.set(pages);
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
    if (pageid !== '') {
      this.list()!.forEach(page => {
        if (page.id === pageid) {
          this.page.set(new Page(page));
        }
      })
    }
  }
}
