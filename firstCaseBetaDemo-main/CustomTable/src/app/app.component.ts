import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Title } from '@angular/platform-browser';
import {UsersComponent} from './users/users.component'
import {UsersService} from './users/users.service'
import {AppService} from './app.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  constructor(public router: Router, private usersComponent: UsersComponent, private usersService: UsersService, public appService: AppService){}

  isLoggedIn: boolean = this.usersComponent.isLoggedIn;
  showSignOut: boolean = false;

  ngOnInit(): void { }

  // setSignOut() {
  //   if (this.appService.checkLogin()) this.showSignOut = true;
  //   else this.showSignOut = false;
  // }

  logout() {
    this.usersService.removeToken();
    this.usersComponent.isLoggedIn = false;
    console.log("User logged out");
  }
}
