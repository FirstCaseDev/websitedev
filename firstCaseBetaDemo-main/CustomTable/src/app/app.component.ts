import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import {UsersService} from './users/users.service'
import {AppService} from './app.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  constructor(public router: Router, private usersService: UsersService, public appService: AppService){}
  isLoggedIn: boolean = false;
  
  ngOnInit(): void {
    if (this.usersService.getToken()) this.isLoggedIn = true;
    else this.isLoggedIn = false;
  }

  // setSignOut() {
  //   if (this.appService.checkLogin()) this.showSignOut = true;
  //   else this.showSignOut = false;
  // }

  logout() {
    this.usersService.removeToken();
    console.log("User logged out");
  }
}
