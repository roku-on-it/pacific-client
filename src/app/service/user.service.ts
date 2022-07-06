import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';
import { Observable } from 'rxjs';
import { LoginInput } from '../component/auth/form-input/login-input';
import { RegisterResponse } from '../component/auth/interface/register-response';
import { UnaryCallResponse } from '../../../app/grpc-layer';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  register(payload: LoginInput): Observable<RegisterResponse> {
    return new Observable<RegisterResponse>((subscriber) => {
      ipcRenderer.send('register', payload);
      ipcRenderer.on(
        'registerResponse',
        (event, response: UnaryCallResponse<RegisterResponse>) => {
          if (null != response.error) {
            subscriber.error(response.error);
          } else {
            subscriber.next(response.body);
          }
        }
      );
    });
  }
}
