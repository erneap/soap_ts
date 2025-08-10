import { Routes } from '@angular/router';
import { Login } from './user/login/login';
import { UserList } from './user/user-list/user-list';
import { UserEntries } from './entries/user-entries/user-entries';
import { Plan } from './plans/plan/plan';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'users', component: UserList },
  { path: 'entries', component: UserEntries },
  { path: 'plans', component: Plan },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
