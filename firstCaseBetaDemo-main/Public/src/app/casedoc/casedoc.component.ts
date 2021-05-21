import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import Case from '../models/case';
import provisions_referred_object from '../models/provisions_referred_object';
import { CasedocService } from './casedoc.service';
import { Title } from '@angular/platform-browser';
import * as copy from 'copy-to-clipboard';
import { stringify } from '@angular/compiler/src/util';
import { GoogleAnalyticsService } from '../google-analytics.service';
import domtoimage from 'dom-to-image';
// import * as FileSaver from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  casedoc_tab_clicked() {
    GoogleAnalyticsService.eventEmitter(
      'Casedoc_page_visit',
      'title',
      'click',
      String(this.case.title),
      0
    );
  }

  caseid: string = '';
  loading: boolean = true;
  judgement_text_paragraphs: any[] = [];
  case: Case = {
    _id: '',
    judgement: '',
    url: '',
    source: '',
    petitioner: '',
    petitioner_counsel: [],
    respondent: '',
    respondent_counsel: [],
    date: '',
    day: '',
    month: '',
    year: '',
    highlight: '',
    query_terms: [],
    doc_author: '',
    bench: '',
    judgement_text: '',
    judgement_html: '',
    title: '',
    case_id: '',
    provisions_referred: [],
    cases_referred: [],
  };
  query: string = '';

  case_date = '';
  case_month = '';
  case_year = '';

  bench_arr: any = [];
  petitioner_arr: any[] = [];
  respondent_arr: any[] = [];
  provisions_referred_arr: provisions_referred_object[] = [];

  case_source_url = '';
  view_tab: any = 1;
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
    // console.log('this.url: ', this.url);
    this.caseid = this.url.split('/')[2];
    // if (this.url.split('#marked').length > 1) {
    //   this.router.navigate(['/casedoc/' + this.caseid]);
    // }
    // console.log('url: ' + this.url);
    // console.log('caseid: ' + this.caseid);
    this.search(this.caseid);
    // localStorage.setItem('request_url', this.router.url);

    // if (localStorage.getItem('token_exp')) {
    //   var exp = parseInt(localStorage.token_exp);
    //   var curr_time = new Date().getTime();
    //   if (curr_time > exp) {
    //     localStorage.removeItem('token_exp');
    //     console.log('cases page: Previous token expired, login again!');
    //     this.router.navigate(['/users']); // navigate to login page
    //   } else {
    //     console.log('Login check: user already logged in');
    //     localStorage.removeItem('request_url');
    //   }
    // } else {
    //   console.log('User not logged in, Login required');
    //   this.router.navigate(['/users']); // navigate to login page
    // }
  }

  search(_id: string) {
    this.casedocService.getCaseDoc(_id).subscribe((data: any) => {
      console.log(data);
      this.case = data.case;
      this.case_date = data.date;
      this.case_month = data.month;
      this.case_year = data.year;

      // console.log('this.case.bench: ', this.case.bench);
      this.bench_arr = this.case.bench;
      this.petitioner_arr = this.case.petitioner_counsel;
      this.respondent_arr = this.case.respondent_counsel;

      this.componentTitle.setTitle(data.case.title);
      this.provisions_referred_arr = this.case.provisions_referred;

      // console.log(this.bench_arr);

      // Uncomment for processing paragraphs from judgement text
      // console.log('data.case.judgement_text: ', data.case.judgement_text);
      this.judgement_text_paragraphs = data.case.judgement_text
        .split('>>>>')
        .map(function (i: any) {
          var para = i.replace(/[^\S+\r\n]{2,}/g, ' ');
          return para;
        });
      this.first_para = this.judgement_text_paragraphs[0].replace(
        /\n{2,}/g,
        ' '
      );
      delete this.judgement_text_paragraphs[0];
      // console.log('this.case.url: ', this.case.url);
      this.case_source_url = this.case.url.split('/')[2];
      this.file = this.sanitizer.bypassSecurityTrustHtml(
        String(this.case.judgement_html)
      );
      this.casedoc_tab_clicked();
      // this.text = this.case.judgement_text.replace(
      //   new RegExp('{^newline^}', 'g'),
      //   '<br/>'
      // );
      this.loading = false;
    });
  }

  casedoc_download_button_google_analytics() {
    GoogleAnalyticsService.eventEmitter(
      'Casedoc_Download_case',
      'button',
      'click',
      String(this.case.url),
      0
    );
  }

  tab1() {
    GoogleAnalyticsService.eventEmitter(
      'Casedoc_Judgement_button',
      'button',
      'click',
      'Judgement',
      0
    );
    this.view_tab = 1;
    this.right_menu_btn_visible = true;
    let element = document.getElementById('show_judgement');
    element!.className = 'tab active';
    let element2 = document.getElementById('show_bench_counsels');
    element2!.className = 'tab';
    let element3 = document.getElementById('show_act_law_citations');
    element3!.className = 'tab';
    let element4 = document.getElementById('show_case_citations');
    element4!.className = 'tab';
  }
  tab2() {
    GoogleAnalyticsService.eventEmitter(
      'Casedoc_Bench&Counsel_button',
      'button',
      'click',
      'Bench & Counsel',
      0
    );
    this.view_tab = 2;
    this.right_menu_btn_visible = false;
    this.toggle_right_menu = false;
    let element = document.getElementById('show_judgement');
    element!.className = 'tab';
    let element2 = document.getElementById('show_bench_counsels');
    element2!.className = 'tab active';
    let element3 = document.getElementById('show_act_law_citations');
    element3!.className = 'tab';
    let element4 = document.getElementById('show_case_citations');
    element4!.className = 'tab';
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
    GoogleAnalyticsService.eventEmitter(
      'Casedoc_Act/Law_Citiations_button',
      'button',
      'click',
      'Act/Law Citiations',
      0
    );
    this.view_tab = 3;
    this.right_menu_btn_visible = false;
    this.toggle_right_menu = false;
    let element = document.getElementById('show_judgement');
    element!.className = 'tab';
    let element2 = document.getElementById('show_bench_counsels');
    element2!.className = 'tab';
    let element3 = document.getElementById('show_act_law_citations');
    element3!.className = 'tab active';
    let element4 = document.getElementById('show_case_citations');
    element4!.className = 'tab';
  }
  tab4() {
    GoogleAnalyticsService.eventEmitter(
      'Casedoc_CaseCitiations_button',
      'button',
      'click',
      'Case Citiations',
      0
    );
    this.view_tab = 4;
    this.right_menu_btn_visible = false;
    this.toggle_right_menu = false;
    let element = document.getElementById('show_judgement');
    element!.className = 'tab';
    let element2 = document.getElementById('show_bench_counsels');
    element2!.className = 'tab';
    let element3 = document.getElementById('show_act_law_citations');
    element3!.className = 'tab';
    let element4 = document.getElementById('show_case_citations');
    element4!.className = 'tab active';
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
    GoogleAnalyticsService.eventEmitter(
      'casedoc_copy_link_to_clipboard',
      'button',
      'click',
      this.page_url + this.router.url,
      this.results_count
    );

    copy(this.page_url + this.router.url);
    // console.log('copied');
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 5000);
  }

  email() {}

  searched: boolean = false;
  results_count = 0;

  find_in_page() {
    GoogleAnalyticsService.eventEmitter(
      'casedoc_search_button',
      'button',
      'click',
      this.query,
      this.results_count
    );
    this.tab1();
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
      // console.log('marked');
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
    if (this.toggle_right_menu) {
      var elements: Element[] = Array.from(
        document.getElementsByClassName('slide')
      );
      elements.forEach((el: Element) => {
        el.className = 'slide-short-width';
      });
    } else {
      var elements: Element[] = Array.from(
        document.getElementsByClassName('slide-short-width')
      );
      elements.forEach((el: Element) => {
        el.className = 'slide';
      });
    }
  }

  downloadAsPDF(){
    console.log("in funct");
//     const elementToPrint = document.getElementById('slides-container')!; //The html element to become a pdf
//     const pdf = new jsPDF('p', 'pt', 'a4');
//     pdf.html(elementToPrint,  {
//       callback: (pdf)=>{
// pdf.output("dataurlnewwindow")
//       }
        
//     });
console.log(document.getElementById('slides-container')!);
// domtoimage.toPng(document.getElementById('slides-container')!)
//     .then(function (blob: any) {
//         var pdf = new jsPDF('l', 'pt', 'a4');
//         pdf.setFontSize(20);
//         var width = pdf.internal.pageSize.getWidth();
//         var height = pdf.internal.pageSize.getHeight();
//         var y = 500;
//         var options = {
//           pagesplit: true
//      };
//         pdf.addImage(blob, 'PNG', 15, 15, width, height);
//         pdf.save(`file.pdf`);
//     });
var data = document.getElementById('slides-container')!;
html2canvas(data).then(canvas => {
// Few necessary setting options

// var imgWidth = 208;
// var pageHeight = 295;
// var imgHeight = canvas.height * imgWidth / canvas.width;
// var heightLeft = imgHeight;
 
// const contentDataURL = canvas.toDataURL('image/png');
// let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
// var position = 0;
// pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
// pdf.save('MYPdf.pdf'); // Generated PDF
window.print()
});
  }

  right_menu_btn_visible = true;
}
