import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Case from '../models/case';
import { CasedocService } from './casedoc.service';

@Component({
  selector: 'app-casedoc',
  templateUrl: './casedoc.component.html',
  styleUrls: ['./casedoc.component.css'],
})
export class CasedocComponent implements OnInit {
  constructor(private router: Router, private casedocService: CasedocService) {}
  url: string = '';
  caseid: string = '';
  loading: boolean = false;
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
    title: '',
  };
  bench_arr: string[] = [];
  case_source_url = '';
  view_tab = 1;

  ngOnInit(): void {
    this.url = this.router.url;
    this.caseid = this.url.split('/')[2];
    // console.log('url: ' + this.url);
    // console.log('caseid: ' + this.caseid);
    this.loading = true;
    this.search(this.caseid);
    localStorage.setItem('casedoc_url', this.url);

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
      // console.log(this.bench_arr);
      this.case_source_url = this.case.url.split('/')[2];
      this.loading = false;
    });
  }

  tab1() {
    this.view_tab = 1;
  }
  tab2() {
    this.view_tab = 2;
  }
  tab3() {
    this.view_tab = 3;
  }
}
