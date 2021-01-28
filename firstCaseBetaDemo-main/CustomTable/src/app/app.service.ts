import { Injectable } from '@angular/core';
import {UsersComponent} from './users/users.component'


@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private usersComponent: UsersComponent) { }
  
  checkLogin() {
    if (this.usersComponent.isLoggedIn) return true;
    else return false;
  }
}
