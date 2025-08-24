import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth-service';
import { environment } from '../environments/environment';
import { User } from 'soap-models/dist/users';

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
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
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
}
