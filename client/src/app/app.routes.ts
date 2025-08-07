import { Routes } from '@angular/router';
import { Login } from './user/login/login';
import { UserList } from './user/user-list/user-list';
import { UserEntries } from './entries/user-entries/user-entries';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'users', component: UserList },
  { path: 'entries', component: UserEntries }
];
