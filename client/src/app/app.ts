import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth-service';
import { environment } from '../environments/environment';
import { User } from 'soap-models/users';
import { AppStateService } from './services/app-state.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ViewState } from 'soap-models/state';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatToolbar,
    MatToolbarRow,
    MatIcon,
    MatButton
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: []
})
export class App implements OnInit {
  protected readonly title = environment.title;
  protected readonly version = environment.version;
  

  constructor(
    public authService: AuthService,
    protected appState: AppStateService,
    private responsive: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.appState.viewState = ViewState.Desktop;
    this.responsive.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet
    ]).subscribe(result => {
      const breakpoints = result.breakpoints;
      if (breakpoints[Breakpoints.HandsetPortrait]
        || breakpoints[Breakpoints.HandsetLandscape]
      ) {
        this.appState.viewState = ViewState.Mobile;
      } else if (breakpoints[Breakpoints.TabletPortrait]
        || breakpoints[Breakpoints.TabletLandscape]
      ) {
        this.appState.viewState = ViewState.Tablet;
      }
    });
  }

  ngOnInit(): void {
    if (window.location.pathname !== '/help') {
      if (!this.authService.isLoggedIn()) {
        this.router.navigate(['/login']);
      }
    }
  }

  logout() {
    this.authService.accessToken.set('');
    this.authService.refreshToken.set('');
    this.authService.user.set(new User())
    this.router.navigate(['/login']);
  }

  onMenuChoice(page: string) {
    if (page !== '') {
      page = `/${page}`;
      this.router.navigate([page]);
    }
  }

  onHelpChoice() {
    const url = '/help';
    window.open(url, 'helpwin');
  }
}
