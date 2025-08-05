import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsersList } from "./users/users-list/users-list";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UsersList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('soap-client');
}
