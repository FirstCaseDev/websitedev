import { Injectable } from '@angular/core';
import { DmsappService } from '../dmsapp.service';
import User from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private dmsAppService: DmsappService) {}

  getUsers() {
    return this.dmsAppService.get('users');
  }

  registerUser(regData: User) {
    return this.dmsAppService.post('dms/users', regData);
  }

  loginUser(loginData: User) {
    return this.dmsAppService.post('dms/authenticate', loginData);
  }

  setTokenExp(exp: any) {
    localStorage.setItem('token_exp', exp);
  }
}
