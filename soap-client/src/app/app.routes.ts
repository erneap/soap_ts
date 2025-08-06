import { Routes } from '@angular/router';
import { Login } from './users/login/login';
import { UsersList } from './users/users-list/users-list';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'users', component: UsersList }
];
