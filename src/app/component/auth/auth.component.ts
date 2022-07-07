import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LoginInput } from './form-input/login-input';
import { validateForm } from '../../helper/form/validate-form';
import { MasterPasswordCheck } from './interface/master-password-check';
import { UserService } from '../../service/user.service';
import { catchError, EMPTY } from 'rxjs';
import { SnackbarService } from '../../service/snackbar.service';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  loading = false;

  loginForm = new FormGroup(
    {
      email: new FormControl(),
      masterPassword: new FormControl(),
    },
    [validateForm(LoginInput)]
  );

  registerForm = new FormGroup(
    {
      email: new FormControl(),
      masterPassword: new FormControl(),
      confirmMasterPassword: new FormControl(),
    },
    [validateForm(LoginInput)]
  );

  masterPasswordChecks: MasterPasswordCheck[] = [
    { constraint: 'be between 12 and 128 characters', satisfied: false },
    { constraint: 'include at least one lowercase letter', satisfied: false },
    { constraint: 'include at least one uppercase letter', satisfied: false },
    { constraint: 'include at least one symbol', satisfied: false },
    { constraint: 'include at least one number', satisfied: false },
  ];

  constructor(
    private userService: UserService,
    private snackbarService: SnackbarService,
    private ngZone: NgZone,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm
      .get('masterPassword')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value: string) => {
        this.masterPasswordChecks[0].satisfied =
          value.length >= 12 && value.length <= 128;
        this.masterPasswordChecks[1].satisfied = /(.*[a-z].*)/.test(value);
        this.masterPasswordChecks[2].satisfied = /(.*[A-Z].*)/.test(value);
        this.masterPasswordChecks[3].satisfied = /(.*\W.*)/.test(value);
        this.masterPasswordChecks[4].satisfied = /\d/.test(value);
      });
  }

  onRegisterSubmit(): void {
    this.loading = true;

    const { masterPasswordConfirm, ...rest } = this.registerForm.value;

    this.userService
      .register(rest)
      .pipe(
        catchError((err) => {
          // Running snackbar spawn and loading toggle inside the ngZone
          // since the user service is outside Angular because it is
          // communicating with IPC which is outside the Angular zone.

          this.ngZone.run(() => {
            if (6 === err.code) {
              err.details = 'User with this email already exists';
            }

            this.snackbarService.raiseError(err);
            this.loading = false;
          });

          return EMPTY;
        }),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.ngZone.run(() => {
          this.snackbarService.raiseSuccess(
            'Welcome to the depths of the Pacific!'
          );
          this.loading = false;
        });
      });
  }

  onLoginSubmit(): void {
    this.loading = true;

    this.userService
      .login(this.loginForm.value)
      .pipe(
        catchError((err) => {
          this.ngZone.run(() => {
            if (16 === err.code) {
              err.details = 'Invalid email or password';
            }

            this.snackbarService.raiseError(err);
            this.loading = false;
          });

          return EMPTY;
        }),
        untilDestroyed(this)
      )
      .subscribe((response) => {
        this.ngZone.run(() => {
          this.loading = false;
          localStorage.setItem('token', response.token);
          this.router.navigateByUrl('/');
        });
      });
  }
}
