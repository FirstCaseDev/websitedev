import { Component, OnInit } from '@angular/core';
import { UsersService } from './users.service';
import User from '../models/user';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../app.component';
import { flatten } from '@angular/compiler';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  constructor(
    private usersService: UsersService,
    private appComponent: AppComponent,
    private router: Router,
    private componentTitle: Title
  ) {}
  isLoggedIn: boolean = false;
  loginClicked: boolean = false;
  small_screen_device = false;

  ngOnInit(): void {
    if (localStorage.screen == 'small') this.small_screen_device = true;
    else this.small_screen_device = false;
    this.componentTitle.setTitle('FirstCase | Login');
    if (localStorage.getItem('token_exp')) {
      var exp = parseInt(localStorage.token_exp);
      var curr_time = new Date().getTime();
      if (curr_time < exp) {
        this.router.navigate(['/cases']); // navigate to other page
        console.log('User already logged in');
        this.isLoggedIn = true;
      } else {
        localStorage.removeItem('token_exp');
        console.log('users page: Previous token expired, login again!');
      }
    } else {
      console.log('User not logged in');
      this.isLoggedIn = false;
    }
  }

  login_username: string = '';
  login_password: string = '';
  loginData: User = {
    name: '',
    username: '',
    password: '',
    email: '',
    organisation: '',
    position: '',
  };
  name: string = '';
  username: string = '';
  password: string = '';
  email: string = '';
  organisation: string = '';
  position: string = '';
  users: User[] = [];
  regData: User = {
    name: '',
    username: '',
    password: '',
    email: '',
    organisation: '',
    position: '',
  };

  reset() {
    this.name = '';
    this.username = '';
    this.password = '';
    this.login_username = '';
    this.login_password = '';
    this.email = '';
    this.organisation = '';
    this.position = '';
  }

  usersList() {
    this.usersService.getUsers().subscribe((data: any) => {
      this.users = data;
    });
  }

  login() {
    this.loginData.username = this.login_username;
    this.loginData.password = this.login_password;
    this.usersService.loginUser(this.loginData).subscribe((data: any) => {
      if (data.success) {
        this.isLoggedIn = true;
        this.loginClicked = true;
        localStorage.setItem('firstcase_user_username', data.username);
        console.log(localStorage.getItem('firstcase_user_username'));
        setTimeout(() => {
          var request_url = localStorage.getItem('request_url');
          if (request_url) {
            this.router.navigate([request_url]);
            localStorage.removeItem('request_url');
          } else this.router.navigate(['/cases']); // navigate to other page
        }, 1500);
        this.usersService.setTokenExp(data.exp);
        this.appComponent.isLoggedIn = true;
        console.log('User logged in');
      } else if (data.msg == 'Fields required') {
      } else {
        this.reset();
        this.loginClicked = true;
      }
    });
  }

  register() {
    this.regData.name = this.name;
    this.regData.username = this.username;
    this.regData.email = this.email;
    this.regData.password = this.password;
    this.regData.organisation = this.organisation;
    this.regData.position = this.position;
    this.usersService.registerUser(this.regData).subscribe((data: any) => {
      console.log(data);
      if (data.success) {
        this.reset();
      } else if (data.msg == 'Fields required') {
      } else {
        this.reset();
      }
    });
  }
}
