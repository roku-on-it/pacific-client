import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated() {
    const token = localStorage.getItem('token');

    return null != token;
  }
}
