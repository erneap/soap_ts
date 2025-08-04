import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { APP_SETTINGS, appSettings } from './general/app.settings';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatToolbar, 
    MatIcon, 
    MatToolbarRow,
    MatButton
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss', 
  providers: [
    { provide: APP_SETTINGS, useValue: appSettings }
  ]
})
export class App {
  title = 'World';
  settings = inject(APP_SETTINGS);
}
