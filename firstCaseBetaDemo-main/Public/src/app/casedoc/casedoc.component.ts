import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import Case from '../models/case';
import { CasedocService } from './casedoc.service';
import { Title } from '@angular/platform-browser';

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
  judgement_text_paragraphs = [];
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
  bench_arr: string[] = [];
  case_source_url = '';
  view_tab = 1;
  file: any = '';
  text: any = '';
  first_para = '';

  ngOnInit(): void {
    this.caseid = this.router.url.split('/')[2];
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
      this.bench_arr = this.case.bench.split(',');
      this.componentTitle.setTitle('FirstCase | ' + data.case.title);

      // console.log(this.bench_arr);

      // Uncomment for processing paragraphs from judgement text
      // this.judgement_text_paragraphs = data.case.judgement_text_paragraphs;
      // this.first_para = this.judgement_text_paragraphs[0];
      // delete this.judgement_text_paragraphs[0];
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
  tab3() {
    this.view_tab = 3;
    let element = document.getElementById('show_judgement');
    element!.className = 'tab';
    let element2 = document.getElementById('show_counsels');
    element2!.className = 'tab';
    let element3 = document.getElementById('show_case_citations');
    element3!.className = 'tab active';
    let element4 = document.getElementById('show_act-law_citations');
    element4!.className = 'tab';
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
    element4!.className = 'tab active';
    let element5 = document.getElementById('show_bench');
    element5!.className = 'tab';
  }
  tab5() {
    this.view_tab = 5;
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
}
