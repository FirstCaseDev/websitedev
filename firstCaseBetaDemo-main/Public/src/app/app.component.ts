import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './app.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  // scrHeight: any;
  // scrWidth: any;

  // @HostListener('window:resize', ['$event'])
  // getScreenSize(event?) {
  //   this.scrWidth = window.innerWidth;
  //   this.scrHeight = window.innerHeight;
  //   console.log('width = ' + this.scrWidth);
  // }
  isMobile = false;
  mobile_menu_open = false;

  constructor(
    public router: Router,
    private metaService: Meta,
    public appService: AppService
  ) {
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (this.isMobile) localStorage.setItem('device_type', 'mobile');
    else localStorage.setItem('device_type', 'other');
    console.log('isMobile = ', this.isMobile);
  }
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    this.metaService.addTags([
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ]);
    if (localStorage.getItem('token_exp')) this.isLoggedIn = true;
    else this.isLoggedIn = false;
  }

  logout() {
    localStorage.removeItem('token_exp');
    localStorage.removeItem('firstcase_user_username');
    localStorage.removeItem('request_url');
    console.log('User logged out');
  }

  show_mobile_menu() {
    this.mobile_menu_open = true;
  }

  close_mobile_menu() {
    this.mobile_menu_open = false;
  }
}
