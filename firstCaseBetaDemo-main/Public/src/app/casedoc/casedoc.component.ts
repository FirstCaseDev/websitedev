import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import Case from '../models/case';
import { CasedocService } from './casedoc.service';
import { Title } from '@angular/platform-browser';
import * as copy from 'copy-to-clipboard';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-casedoc',
  templateUrl: './casedoc.component.html',
  styleUrls: ['./casedoc.component.css'],
})
export class CasedocComponent implements OnInit {
  constructor(
    private router: Router,
    private casedocService: CasedocService,
    private sanitizer: DomSanitizer,
    private componentTitle: Title
  ) {}
  caseid: string = '';
  loading: boolean = false;
  judgement_text_paragraphs: any[] = [];
  case: Case = {
    _id: '',
    judgement: '',
    url: '',
    source: '',
    petitioner: '',
    respondent: '',
    date: '',
    month: '',
    year: '',
    doc_author: '',
    bench: '',
    judgement_text: '',
    judgement_html: '',
    title: '',
  };
  query: string = '';

  case_date = '';
  case_month = '';
  case_year = '';
  bench_arr = [];
  case_source_url = '';
  view_tab = 1;
  file: any = '';
  text: any = '';
  first_para = '';
  page_url = 'https://firstcase.io';
  // page_url = 'http://localhost:4200';
  url = this.router.url;
  // highlighted_URLs: any[] = [];
  marked_url = '';
  isMobile = false;

  ngOnInit(): void {
    if (localStorage.device_type == 'mobile') this.isMobile = true;
    else this.isMobile = false;
    console.log('this.url: ', this.url);
    this.caseid = this.url.split('/')[2];
    // if (this.url.split('#marked').length > 1) {
    //   this.router.navigate(['/casedoc/' + this.caseid]);
    // }
    // console.log('url: ' + this.url);
    // console.log('caseid: ' + this.caseid);
    this.loading = true;
    this.search(this.caseid);
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
  }

  search(_id: string) {
    this.casedocService.getCaseDoc(_id).subscribe((data: any) => {
      console.log('Data:', data);
      this.case = data.case;
      this.case_date = data.date;
      this.case_month = data.month;
      this.case_year = data.year;
      console.log('this.case.bench: ', this.case.bench);
      // this.bench_arr = this.case.bench;
      this.componentTitle.setTitle('FirstCase | ' + data.case.title);

      // console.log(this.bench_arr);

      // Uncomment for processing paragraphs from judgement text
      console.log('data.case.judgement_text: ', data.case.judgement_text);
      this.judgement_text_paragraphs = data.case.judgement_text.split('>>>>');
      this.first_para = this.judgement_text_paragraphs[0];
      delete this.judgement_text_paragraphs[0];
      console.log('this.case.url: ', this.case.url);
      this.case_source_url = this.case.url.split('/')[2];
      this.file = this.sanitizer.bypassSecurityTrustHtml(
        String(this.case.judgement_html)
      );
      // this.text = this.case.judgement_text.replace(
      //   new RegExp('{^newline^}', 'g'),
      //   '<br/>'
      // );

      this.loading = false;
    });
  }

  tab1() {
    this.view_tab = 1;
    let element = document.getElementById('show_judgement');
    element!.className = 'tab active';
    let element2 = document.getElementById('show_counsels');
    element2!.className = 'tab';
    let element3 = document.getElementById('show_case_citations');
    element3!.className = 'tab';
    let element4 = document.getElementById('show_act-law_citations');
    element3!.className = 'tab';
    let element5 = document.getElementById('show_bench');
    element3!.className = 'tab';
  }
  tab2() {
    this.view_tab = 2;
    let element = document.getElementById('show_judgement');
    element!.className = 'tab';
    let element2 = document.getElementById('show_counsels');
    element2!.className = 'tab active';
    let element3 = document.getElementById('show_case_citations');
    element3!.className = 'tab';
    let element4 = document.getElementById('show_act-law_citations');
    element3!.className = 'tab';
    let element5 = document.getElementById('show_bench');
    element3!.className = 'tab';
  }
  // tab3() {
  //   this.view_tab = 3;
  //   let element = document.getElementById('show_judgement');
  //   element!.className = 'tab';
  //   let element2 = document.getElementById('show_counsels');
  //   element2!.className = 'tab';
  //   let element3 = document.getElementById('show_case_citations');
  //   element3!.className = 'tab active';
  //   let element4 = document.getElementById('show_act-law_citations');
  //   element4!.className = 'tab';
  //   let element5 = document.getElementById('show_bench');
  //   element5!.className = 'tab';
  // }
  tab3() {
    this.view_tab = 3;
    let element = document.getElementById('show_judgement');
    element!.className = 'tab';
    let element2 = document.getElementById('show_counsels');
    element2!.className = 'tab';
    let element3 = document.getElementById('show_case_citations');
    element3!.className = 'tab';
    let element4 = document.getElementById('show_act-law_citations');
    element4!.className = 'tab active';
    let element5 = document.getElementById('show_bench');
    element5!.className = 'tab';
  }
  tab4() {
    this.view_tab = 4;
    let element = document.getElementById('show_judgement');
    element!.className = 'tab';
    let element2 = document.getElementById('show_counsels');
    element2!.className = 'tab';
    let element3 = document.getElementById('show_case_citations');
    element3!.className = 'tab';
    let element4 = document.getElementById('show_act-law_citations');
    element4!.className = 'tab';
    let element5 = document.getElementById('show_bench');
    element5!.className = 'tab active';
  }

  // sendToTop() {
  //   document.getElementById('judgement-page')?.scrollIntoView();
  // }

  shareBtn() {
    if (document.getElementById('shareBar') != null) {
      let element = document.getElementById('shareBar');
      element!.id = 'shareBar-is-shown';
    } else {
      let element = document.getElementById('shareBar-is-shown');
      element!.id = 'shareBar';
    }
  }

  copied = false;

  copy_link() {
    copy(this.page_url + this.router.url);
    console.log('copied');
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 5000);
  }

  email() {}

  searched: boolean = false;
  results_count = 0;

  find_in_page() {
    if (this.query == '' || this.query == null) {
      this.searched = false;
      alert('Please enter a keyword');
    } else {
      this.searched = true;
      for (var i = 0; i < this.judgement_text_paragraphs.length; i++) {
        if (
          this.judgement_text_paragraphs[i] === undefined ||
          this.judgement_text_paragraphs[i] === null
        ) {
          continue;
        } else {
          this.results_count =
            this.results_count +
            (
              this.judgement_text_paragraphs[i].match(
                new RegExp(this.query, 'g')
              ) || []
            ).length;
        }
      }
    }
    setTimeout(() => {
      this.add_id();
    }, 1000);
  }

  reset() {
    this.query = '';
    this.searched = false;
    this.marked_url_idx = 0;
    // this.highlighted_URLs = [];
    this.results_count = 0;
  }

  marked_url_idx = 0;
  no_of_marked_elems = 0;

  add_id() {
    var elem = document.getElementsByClassName('highlighted');
    var count = 0;
    for (var i = 0; i < elem.length; i++) {
      elem[i].setAttribute('id', 'marked' + String(i));
      count = count + 1;
      console.log('marked');
      // this.highlighted_URLs[i] = this.url + '#marked' + String(i);
    }
    this.marked_url_idx = 0;
    // this.marked_url = this.highlighted_URLs[this.marked_url_idx];
    this.no_of_marked_elems = count;
  }

  goto_previous() {
    if (this.marked_url_idx != 0) this.marked_url_idx = this.marked_url_idx - 1;
    if (this.marked_url_idx == 0) {
      document.getElementById('judgment-page')?.scrollIntoView();
      setTimeout(() => {
        alert('Reached top of the document!');
      }, 1000);
    } else {
      document
        .getElementById('marked' + String(this.marked_url_idx))
        ?.scrollIntoView();
    }
    document.getElementById('search-bar')?.scrollIntoView();
  }
  goto_next() {
    if (this.marked_url_idx != this.no_of_marked_elems - 1) {
      this.marked_url_idx = this.marked_url_idx + 1;
    }
    if (this.marked_url_idx == this.no_of_marked_elems - 1) {
      document.getElementById('page-end')?.scrollIntoView();
      setTimeout(() => {
        alert('Reached end of the document!');
      }, 1000);
    } else {
      document
        .getElementById('marked' + String(this.marked_url_idx))
        ?.scrollIntoView();
    }
    document.getElementById('search-bar')?.scrollIntoView();
  }

  toggle_right_menu = false;
  right_menu_btn() {
    this.toggle_right_menu = !this.toggle_right_menu;
  }
}
