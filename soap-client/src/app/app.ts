import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button'
import { APP_SETTINGS, appSettings } from './app.settings';
import { UserService } from './users/user-service';

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
  protected readonly title = signal('soap-client');
  settings = inject(APP_SETTINGS);

  constructor(
    public userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {

    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/users']);
    }
  }

  logout() {
    this.userService.setAuthToken('');
    this.userService.setRefreshToken('');
    this.router.navigate(['/login']);
  }
}
