import { Injectable } from '@angular/core';
import {UsersService} from './users/users.service'

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private usersService: UsersService) { }
  
  checkLogin() {
    if (this.usersService.getToken()) return true;
    else return false;
  }

}
