import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

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
  styleUrl: './app.scss'
})
export class App {
  title = 'World';
}
