import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './app.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  scrHeight: any;
  scrWidth: any;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.scrWidth = window.innerWidth;
    this.scrHeight = window.innerHeight;
    console.log('width = ' + this.scrWidth);
  }
  small_screen_device = false;
  mobile_menu_open = false;

  constructor(
    public router: Router,
    private metaService: Meta,
    public appService: AppService
  ) {
    this.getScreenSize();
    if (this.scrWidth < 720) {
      this.small_screen_device = true;
      localStorage.setItem('screen', 'small');
    } else {
      this.small_screen_device = false;
      localStorage.setItem('screen', 'large');
    }
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
