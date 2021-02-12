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
    if (localStorage.getItem('token_exp')) this.isLoggedIn = true;
    else this.isLoggedIn = false;
  }

  logout() {
    localStorage.removeItem('token_exp');
    console.log("User logged out");
  }
}
