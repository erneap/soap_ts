import { Component, OnInit, signal } from '@angular/core';
import { 
  MatCard, 
  MatCardContent, 
  MatCardHeader, 
  MatCardTitle 
} from '@angular/material/card';
import { AppStateService } from '../../services/app-state.service';
import { HelpService } from '../help-service';
import { IPage, Page } from 'soap-models/help';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth-service';
import { HelpListComponent } from "./help-list-component/help-list-component";
import { HelpViewComponent } from "./help-view-component/help-view-component";
import { HelpEditorComponent } from '../../help-editor/help-editor-component/help-editor-component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help-component',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    HelpListComponent,
    HelpViewComponent,
    HelpEditorComponent
],
  templateUrl: './help-component.html',
  styleUrl: './help-component.scss'
})
export class HelpComponent implements OnInit {
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

  onChangeEdit(edit: boolean) {
    this.editPage.set(edit);
  }
}
