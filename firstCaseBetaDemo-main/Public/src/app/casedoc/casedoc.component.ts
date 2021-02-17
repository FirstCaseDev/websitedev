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
  bench_arr: string[] = [];
  case_source_url = '';
  view_tab = 1;
  file: any = '';
  text: any = '';
  first_para = '';
  // page_url = 'https://firstcase.io';
  page_url = 'http://localhost:4200';
  url = this.router.url;
  highlighted_URLs: any[] = [];
  marked_url = '';

  ngOnInit(): void {
    this.caseid = this.url.split('/')[2].split('#marked')[0];
    if (this.url.split('#marked').length > 1) {
      this.router.navigate(['/casedoc/' + this.caseid]);
    }
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
        localStorage.removeItem('casedoc_url');
      }
    } else {
      console.log('User not logged in, Login required');
      this.router.navigate(['/users']); // navigate to login page
    }
  }

  search(_id: string) {
    this.casedocService.getCaseDoc(_id).subscribe((data: any) => {
      // console.log(data);
      this.case = data.case;
      this.case_date = data.date;
      this.case_month = data.month;
      this.case_year = data.year;
      this.bench_arr = this.case.bench.split(',');
      this.componentTitle.setTitle('FirstCase | ' + data.case.title);

      // console.log(this.bench_arr);

      // Uncomment for processing paragraphs from judgement text
      this.judgement_text_paragraphs = data.case.judgement_text.split('>>>>');
      this.first_para = this.judgement_text_paragraphs[0];
      delete this.judgement_text_paragraphs[0];
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

  copy_btn_text = 'Copy Link';

  copy_link() {
    copy(this.page_url + this.router.url);
    console.log('copied');
    this.copy_btn_text = 'Copied!';
    setTimeout(() => {
      this.copy_btn_text = 'Copy Link';
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
      console.log(this.results_count);
    }
    this.add_id();
  }

  reset() {
    this.query = '';
    this.searched = false;
    this.marked_url_idx = 0;
    this.highlighted_URLs = [];
    this.results_count = 0;
  }

  marked_url_idx = 0;

  add_id() {
    var elem = document.getElementsByClassName('highlighted');
    for (var i = 0; i < elem.length; i++) {
      elem[i].setAttribute('id', 'marked' + String(i));
      this.highlighted_URLs[i] = this.url + '#marked' + String(i);
    }
    this.marked_url_idx = 0;
    this.marked_url = this.highlighted_URLs[this.marked_url_idx];
  }

  goto_previous() {
    if (this.marked_url_idx != 0) this.marked_url_idx = this.marked_url_idx - 1;
    this.marked_url = this.highlighted_URLs[this.marked_url_idx];
  }
  goto_next() {
    if (this.marked_url_idx != this.highlighted_URLs.length - 1)
      this.marked_url_idx = this.marked_url_idx + 1;
    this.marked_url = this.highlighted_URLs[this.marked_url_idx];
  }
}
