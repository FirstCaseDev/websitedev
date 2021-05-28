import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppService } from './app.service';
import { Location } from '@angular/common';
import { Meta } from '@angular/platform-browser';
declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isMobile = false;
  mobile_menu_open = false;

  constructor(
    public router: Router,
    private metaService: Meta,
    public appService: AppService,
    private location: Location
  ) {
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (this.isMobile) localStorage.setItem('device_type', 'mobile');
    else localStorage.setItem('device_type', 'other');
    //console.log('isMobile = ', this.isMobile);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-DLMYJT00J2', {
          page_path: event.urlAfterRedirects,
        });
      }
    });
  }
  isLoggedIn: boolean = false;

  navRoutes = [
    { text: 'Home', path: 'home', anchor: '#hero' },
    { text: 'About Us', path: 'about-us', anchor: '#about' },
    { text: 'Blog', path: 'blog', anchor: '#blog' },
    { text: 'Work With Us', path: 'about-us', anchor: '#contact' },
  ];

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
    // console.log('User logged out');
  }

  setActive(event: any) {
    var elem = event.target;
    var goto_route = elem.textContent;
    var path = '',
      anchor = '';
    var allElems = document.getElementsByClassName('nav-link');
    for (let i = 0; i < allElems.length; i++) {
      var element = allElems[i];
      element.classList.remove('active');
    }
    elem.classList.add('active');

    for (let i = 0; i < this.navRoutes.length; i++) {
      const element = this.navRoutes[i];
      if (element.text == goto_route) {
        path = element.path;
        anchor = element.anchor;
        this.router.navigateByUrl(path + anchor);
        setTimeout(() => {
          window.location.href = this.router.url;
        }, 100);
        break;
      }
    }
  }

  show_mobile_menu() {
    this.mobile_menu_open = true;
  }

  close_mobile_menu() {
    this.mobile_menu_open = false;
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    let element = document.querySelector('#header') as HTMLElement;
    if (window.pageYOffset > element.clientHeight) {
      element.classList.add('header-scrolled');
    } else {
      element.classList.remove('header-scrolled');
    }
  }

  view_focussed = false;

  onClick(event: any) {
    var focussed = document.getElementById('mobile_nav');
    if (focussed == event.target) {
      this.view_focussed = true;
    } else {
      this.view_focussed = false;
    }
  }
}
