import { Injectable } from '@angular/core';
import { WebService } from '../web.service';
import User from '../models/user';


@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private webService: WebService, private user: User) {}

  getUsers() {
    return this.webService.get('users');
  }

  registerUser(regData: User) {
    return this.webService.post('users', regData);
  }

  loginUser(loginData: User) {
    return this.webService.post('authenticate', loginData);
  }

  setTokenExp(exp: any) {
    localStorage.setItem('token_exp', exp);
  }

}
