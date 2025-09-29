import { Routes } from '@angular/router';
import { Login } from './user/login/login';
import { UserList } from './user/user-list/user-list';
import { UserEntries } from './entries/user-entries/user-entries';
import { PlanComponent } from './plans/plan/plan';
import { CreateUserComponent } from './user/create-user/create-user';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password';
import { ProfileComponent } from './user/profile/profile';
import { MustChangeComponent } from './user/must-change/must-change';
import { BiblesComponent } from './bibles/bibles-component/bibles-component';
import { HelpComponent } from './help/help-component/help-component';
import { HelpEditor } from './help-editor/help-editor';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'createuser', component: CreateUserComponent },
  { path: 'forgot', component: ForgotPasswordComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'mustchange', component: MustChangeComponent },
  { path: 'users', component: UserList },
  { path: 'entries', component: UserEntries },
  { path: 'plans', component: PlanComponent },
  { path: 'bibles', component: BiblesComponent },
  { path: 'help', component: HelpComponent },
  { path: 'helpedit', component: HelpEditor },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
