import { Injectable } from '@angular/core';
import {UsersService} from './users/users.service'

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private usersService: UsersService) { }
  
  checkLogin() {
    if (localStorage.getItem('token_exp')) return true;
    else return false;
  }

}
