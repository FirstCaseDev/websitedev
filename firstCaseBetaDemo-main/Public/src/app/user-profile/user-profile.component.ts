import { Component, OnInit } from '@angular/core';
import User from '../models/user';
import { UserProfileService } from './user-profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  constructor(
    private userProfileService: UserProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    localStorage.setItem('request_url', this.router.url);

    if (localStorage.getItem('token_exp')) {
      var exp = parseInt(localStorage.token_exp);
      var curr_time = new Date().getTime();
      if (curr_time > exp) {
        localStorage.removeItem('token_exp');
        console.log('cases page: Previous token expired, login again!');
        this.router.navigate(['/users']); // navigate to login page
      } else {
        console.log('Login check: user already logged in');
        localStorage.removeItem('request_url');
      }
    } else {
      console.log('User not logged in, Login required');
      this.router.navigate(['/users']); // navigate to login page
    }
    this.getUserData();
  }
  user_username = localStorage.getItem('firstcase_user_username');
  name: string = '';
  user: User = {
    name: '',
    username: '',
    password: '',
    email: '',
    organisation: '',
    position: '',
  };

  getUserData() {
    if (this.user_username != null) {
      this.userProfileService
        .getCurrentUser(this.user_username)
        .subscribe((data: any) => {
          this.user = data;
        });
    }
  }
}
