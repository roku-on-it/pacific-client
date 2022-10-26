import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { validateForm } from '../../../../../../helper/form/validate-form';
import { CreatePassword } from '../../form-input/create-password';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ipcRenderer } from 'electron';

@UntilDestroy()
@Component({
  selector: 'app-create-password-dialog',
  templateUrl: './create-password-dialog.component.html',
  styleUrls: ['./create-password-dialog.component.scss'],
})
export class CreatePasswordDialogComponent implements OnInit, OnDestroy {
  noImageUrl =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';

  passwordsToSave: CreatePassword[] = [];

  createPasswordForm = new FormGroup(
    {
      username: new FormControl(),
      password: new FormControl(),
      uri: new FormControl(),
      imageSrc: new FormControl(),
      description: new FormControl(),
    },
    [validateForm(CreatePassword)]
  );

  constructor() {}

  ngOnInit(): void {
    ipcRenderer.send('password-create-start');

    this.createPasswordForm.markAllAsTouched();

    this.createPasswordForm.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((value) => {
        for (const [controlName, formValue] of Object.entries(value)) {
          if ('' === formValue) {
            this.createPasswordForm.controls[controlName].reset();
          }
        }
      });
  }

  addPassword() {
    this.passwordsToSave.push(this.createPasswordForm.value);

    ipcRenderer.send('password-create-chunk', this.createPasswordForm.value);

    this.createPasswordForm.reset();
  }

  savePasswords() {
    ipcRenderer.send('password-create-end');
  }

  ngOnDestroy() {
    // Interrupting the stream connection, otherwise server notices the 'end' event
    // and save previous sent chunks to database
    ipcRenderer.send('password-create-chunk', {});
  }
}
