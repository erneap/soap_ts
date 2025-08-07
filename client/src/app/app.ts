import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { APP_SETTINGS, appSettings } from './app.settings';
import { AuthService } from './services/auth-service';

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
  providers: [
    { provide: APP_SETTINGS, useValue: appSettings }
  ]
})
export class App implements OnInit {
  protected readonly title = signal('client');
  settings = inject(APP_SETTINGS);

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/entries']);
    }
  }

  logout() {
    this.authService.accessToken.set('');
    this.authService.refreshToken.set('');
    this.router.navigate(['/login']);
  }
}
