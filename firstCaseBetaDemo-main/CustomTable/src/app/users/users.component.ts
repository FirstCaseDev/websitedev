import { Component, OnInit } from '@angular/core';
import { UsersService } from './users.service';
import User from '../models/user';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  constructor(
    private usersService: UsersService,
    private appComponent: AppComponent,
    private router: Router
  ) {}
  isLoggedIn: boolean = false;

  ngOnInit(): void {
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
        this.reset();
        var casedoc_url = localStorage.getItem('casedoc_url');
        if (casedoc_url) {
          this.router.navigate([casedoc_url]);
        } else this.router.navigate(['/cases']); // navigate to other page
        this.usersService.setTokenExp(data.exp);
        this.isLoggedIn = true;
        this.appComponent.isLoggedIn = true;
        console.log('User logged in');
      } else if (data.msg == 'Fields required') {
      } else {
        this.reset();
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
