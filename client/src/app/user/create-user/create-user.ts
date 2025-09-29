import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslationsService } from '../../bibles/translations/translations-service';
import { IPlan, ITranslation, Plan, Translation } from 'soap-models/plans';
import { PlanService } from '../../plans/plan-service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { AppStateService } from '../../services/app-state.service';
import { MatCard, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { UserService } from '../user-service';
import { NewUserResponse } from 'soap-models/users';

@Component({
  selector: 'app-create-user',
  imports: [
    MatCard,
    ReactiveFormsModule,
    MatCardHeader,
    MatCardTitle,
    MatFormField,
    MatInput,
    MatSelect,
    MatOption,
    MatError,
    MatButton,
    MatLabel
],
  templateUrl: './create-user.html',
  styleUrl: './create-user.scss'
})
export class CreateUserComponent implements OnInit {
  newUserForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email ]
    }),
    first: new FormControl('', {
      nonNullable: true,
      validators: [ Validators.required ]
    }),
    middle: new FormControl(''),
    last: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    plan: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    translation: new FormControl('NKJV', {
      nonNullable: true,
      validators: [ Validators.required ]
    }),
    start: new FormControl(new Date(), {
      nonNullable: true
    })
  });
  translations = signal<Translation[]>([]);
  plans = signal<Plan[]>([]);
  cardStyle = signal('');
  errorMsg = signal('');

  constructor(
    private transService: TranslationsService,
    private plansService: PlanService,
    private authService: AuthService,
    protected viewState: AppStateService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const width = this.viewState.viewWidth - 60;
    const height = this.viewState.viewHeight - 60;
    this.cardStyle.set(`height: ${height}px;width: ${width}px;`);
    this.transService.getTranslations().subscribe({
      next: (res) => {
        const translist: ITranslation[] = res.body as ITranslation[];
        const tlist: Translation[] = [];
        translist.forEach(t => {
          tlist.push(new Translation(t));
        });
        tlist.sort((a,b) => a.compareTo(b));
        this.translations.set(tlist);
      }, error: (err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.authService.errorMsg.set(`Unauthorized: ${err.error}`);
          } else {
            this.authService.errorMsg.set(`${err.status}: ${err.error}`);
          }
        }
      }
    });

    this.plansService.getPlans().subscribe({
      next: (res) => {
        const plist: IPlan[] = res.body as IPlan[];
        const planlist: Plan[] = [];
        plist.forEach(p => {
          planlist.push(new Plan(p));
        });
        planlist.sort((a,b) => a.compareTo(b));
        this.plans.set(planlist);
      }, error: (err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.authService.errorMsg.set(`Unauthorized: ${err.error}`);
          } else {
            this.authService.errorMsg.set(`${err.status}: ${err.error}`);
          }
        }
      }
    });
  }

  createUser() {
    if (this.newUserForm.valid) {
      this.userService.createUser(
        this.newUserForm.controls.email.value,
        this.newUserForm.controls.first.value,
        this.newUserForm.controls.middle.value,
        this.newUserForm.controls.last.value,
        this.newUserForm.controls.plan.value,
        this.newUserForm.controls.translation.value
      ).subscribe({
      next: (res) => {
        const response = res.body as NewUserResponse;
        if (response.user) {
          this.router.navigate(['/login']);
        }
      }, error: (err) => {
        if (err instanceof HttpErrorResponse) {
          switch (err.status) {
            case 401:
              this.errorMsg.set(`Unauthorized: ${err.error}`);
              break;
            case 400:
              this.errorMsg.set(`Bad Request: ${err.error}`);
              break;
            case 403:
              this.errorMsg.set(`Forbidden: ${err.error}`);
              break;
            case 500:
              this.errorMsg.set(`Server Error: ${err.error}`);
              break;
            default:
              this.errorMsg.set(`${err.status}: ${err.error}`);
          }
        }
      }
    });
    }
  }

  onCancel() {
    this.router.navigate(['/login']);
  }
}
