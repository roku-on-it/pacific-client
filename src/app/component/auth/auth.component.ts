import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LoginInput } from './form-input/login-input';
import { validateForm } from '../../helper/form/validate-form';
import { MasterPasswordCheck } from './interface/master-password-check';

@UntilDestroy()
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
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

  constructor() {}

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
}
