import { Component, OnInit, signal, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { mustMatchValidator, passwordValidator } from '../../services/auth-password.validator';
import { AppStateService } from '../../services/app-state.service';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../user-service';
import { Router } from '@angular/router';
import { TranslationsService } from '../../bibles/translations/translations-service';
import { PlanService } from '../../plans/plan-service';
import { IPlan, ITranslation, Plan, Translation } from 'soap-models/plans';
import { HttpErrorResponse } from '@angular/common/http';
import { MatOption, MatSelect } from '@angular/material/select';
import { IUser, User } from 'soap-models/users';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatError,
    MatButton,
    MatLabel,
    MatSelect,
    MatOption,
    MatButtonToggleGroup,
    MatButtonToggle
],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit {
  cardStyle = signal('');
  errorMsg = signal('');
  translations = signal<Translation[]>([]);
  plans = signal<Plan[]>([]);
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
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [passwordValidator]
    }),
    verify: new FormControl('', {
      nonNullable: true,
      validators: [mustMatchValidator]
    }),
    fontsize: new FormControl('10', {
      nonNullable: true
    })
  });

  constructor(
    private transService: TranslationsService,
    private plansService: PlanService,
    protected viewState: AppStateService,
    private authService: AuthService,
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

    if (this.authService.user()) {
      const user = this.authService.user();
      this.newUserForm.controls.email.setValue(user.email);
      this.newUserForm.controls.first.setValue(user.firstName);
      this.newUserForm.controls.middle.setValue(user.middleName);
      this.newUserForm.controls.last.setValue(user.lastName);
      this.newUserForm.controls.plan.setValue(user.planId!);
      this.newUserForm.controls.translation.setValue(user.translationId!);
    }
  }

  onChange(field: string, control: AbstractControl) {
    const userid = this.authService.user()!.id;
    const value = control.value;
    this.userService.updateUser(userid, field, value).subscribe({
      next: (res) => {
        const iUser = res.body as IUser;
        if (iUser) {
          this.authService.user.set(new User(iUser));
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

  changePassword() {
    if (this.newUserForm.controls.password.valid && this.newUserForm.controls.verify.valid) {
      const userid = this.authService.user()!.id;
      const value = this.newUserForm.controls.password.value;
      this.userService.updateUser(userid, 'password', value).subscribe({
        next: (res) => {
          const iUser = res.body as IUser;
          if (iUser) {
            this.authService.user.set(new User(iUser));
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
}
