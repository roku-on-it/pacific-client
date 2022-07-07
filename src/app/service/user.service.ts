import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';
import { Observable } from 'rxjs';
import { LoginInput } from '../component/auth/form-input/login-input';
import { RegisterResponse } from '../component/auth/interface/register-response';
import { LoginResponse } from '../component/auth/interface/login-response';
import { UnaryCallResponse } from '../../../app/grpc-layer/interface/unary-call-response';

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
          if (null == response.body) {
            subscriber.error(response.error);
          } else {
            subscriber.next(response.body);
          }
        }
      );
    });
  }

  login(payload: LoginInput): Observable<LoginResponse> {
    return new Observable<LoginResponse>((subscriber) => {
      ipcRenderer.send('login', payload);
      ipcRenderer.on(
        'loginResponse',
        (event, response: UnaryCallResponse<LoginResponse>) => {
          if (null == response.body) {
            subscriber.error(response.error);
          } else {
            subscriber.next(response.body);
          }
        }
      );
    });
  }
}
