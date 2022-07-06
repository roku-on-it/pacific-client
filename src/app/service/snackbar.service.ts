import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorSnackbarComponent } from '../shared/component/error-snackbar/error-snackbar.component';
import { ServiceError } from '@grpc/grpc-js';
import { SuccessSnackbarComponent } from '../shared/component/success-snackbar/success-snackbar.component';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) {}

  raiseError(error: ServiceError) {
    this.snackbar.openFromComponent(ErrorSnackbarComponent, {
      data: error,
      panelClass: 'error-snack-style',
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  raiseSuccess(message: string) {
    this.snackbar.openFromComponent(SuccessSnackbarComponent, {
      data: message,
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
