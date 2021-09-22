import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppService } from './app.service';
import { ENTER } from '@angular/cdk/keycodes';

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

  ngOnInit(): void {
    this.getActive();
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

  navRoutes = [
    { text: 'Home', path: '', anchor: '' },
    { text: 'ILSA NEW', path: 'ilsa', anchor: '' },
    { text: 'About Us', path: 'about-us', anchor: '#about' },
    { text: 'Blog', path: 'blog', anchor: '#blog' },
    { text: 'Work With Us', path: 'about-us', anchor: '#contact' },
  ];

  // setActive(event: any) {
  //   var elem = event.target;
  //   var goto_route = elem.textContent;
  //   var path = '';
  //   var anchor = '';
  //   var allElems = document.getElementsByClassName('nav-link');
  //   for (let i = 0; i < allElems.length; i++) {
  //     var element = allElems[i];
  //     element.classList.remove('active');
  //   }
  //   elem.classList.add('active');

  //   console.log(`
  //   elem: ${elem}\n
  //   goto_route: ${goto_route}\n
  //   `);
  //   for (let i = 0; i < this.navRoutes.length; i++) {
  //     const element = this.navRoutes[i];
  //     if (element.text == goto_route) {
  //       path = element.path;
  //       anchor = element.anchor;
  //       var url = 'http://localhost:4200/' + path + anchor;
  //       // var url = 'https://firstcase.io/' + path + anchor;
  //       this.router.navigateByUrl(path + anchor);
  //       setTimeout(() => {
  //         window.location.href = url;
  //       }, 100);
  //       break;
  //     }
  //   }
  // }

  getActive() {
    if (localStorage.getItem('active-link')) {
      var nav_links = document.getElementsByClassName('nav-link');
      for (let i = 0; i < nav_links.length; i++) {
        if (nav_links[i].textContent == localStorage.getItem('active-link')) {
          nav_links[i].classList.add('active');
          break;
        }
      }
      localStorage.removeItem('active-link');
    }
  }

  setActive(event: any) {
    var elem = event.target;
    console.log(elem.textContent);
    var nav_links = document.getElementsByClassName('nav-link');
    console.log(nav_links);
    for (let i = 0; i < this.navRoutes.length; i++) {
      if (this.navRoutes[i].text == elem.textContent) {
        localStorage.setItem('active-link', elem.textContent);
        var domain = window.location.href.split('/');
        while (domain.length > 3) domain.pop();
        var url = '';
        for (let i = 0; i < domain.length; i++) url = url + domain[i] + '/';
        window.location.href =
          url + this.navRoutes[i].path + this.navRoutes[i].anchor;
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

  view_chatbot = false;

  toggleChatBot() {
    this.view_chatbot = !this.view_chatbot;
  }

  msg_lists: any[] = [];
  india = false;

  query: string = '';

  sendMessage() {
    if (this.query.split(' ').indexOf('US') > 0) {
      this.msg_lists.push({
        msg: 'single satisfaction double recovery US bankruptcy law',
        id: 'user-msg',
      });
      this.scroll_to_bottom();
      this.query = '';
      setTimeout(() => {
        this.msg_lists.push({
          msg: '[T]he holder of a claim, upon which several parties are personally liable, may prove his claim against the estates of those who become bankrupt and may at the same time pursue the others at law, and, notwithstanding partial payments after the bankruptcy by other [parties] or their estates, he may recover dividends from each estate in bankruptcy upon the full amount of his claim at the time the petition in bankruptcy was filed therein until from all sources he has received full payment of his claim, but no longer.',
          case: '',
          id: 'app-msg',
        });
        this.scroll_to_bottom();
        setTimeout(() => {
          this.msg_lists.push({
            case: 'Board of Com’RS v. Hurley, 169 F. 92 (8th Cir. 1909)',
            id: 'app-msg',
          });
          this.scroll_to_bottom();
        }, 1000);
      }, 2500);
    }

    if (this.query.split(' ').indexOf('Singapore') > 0) {
      this.msg_lists.push({
        msg: 'What is the position on division of assets during divorce under Singapore law?',
        id: 'user-msg',
      });
      this.query = '';
      this.scroll_to_bottom();
      setTimeout(() => {
        this.msg_lists.push({
          msg: 'For example, this court has held that there is no starting point, presumption or norm of an equal division of matrimonial assets, a holding that is wholly consistent with the legislative background which resulted in s 112 and its concomitant broad-brush approach (see, for example,   the decision of this court in Lock Yeng Fun v Chua Hock Chye [2007] 3 SLR(R)',
          id: 'app-msg',
        });
        this.scroll_to_bottom();
        setTimeout(() => {
          this.msg_lists.push({
            case: 'Chan Tin Sun vs Fong Quay Sim',
            id: 'app-msg-2',
          });
          this.scroll_to_bottom();
        }, 1000);
      }, 1000);
    }
  }

  key_press(event: any) {
    if (event.keyCode == ENTER) {
      this.sendMessage();
    }
  }

  scroll_to_bottom() {
    var view = document.getElementById('main-view');
    view?.scrollTo({
      top: view.scrollHeight,
      behavior: 'smooth',
    });
  }
}
