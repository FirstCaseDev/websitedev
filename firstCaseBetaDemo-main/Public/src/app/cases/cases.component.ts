import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import Case from '../models/case';
import { CaseService } from './case.service';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as Highcharts from 'highcharts';
import HC_heatmap from 'highcharts/modules/heatmap';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { GoogleAnalyticsService } from '../google-analytics.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { SwiperOptions } from 'swiper';

// import { title } from 'process';
//import { Console } from 'console';

// const Wordcloud = require('highcharts/modules/wordcloud');
// Wordcloud(Highcharts);
HC_heatmap(Highcharts);

@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: [
    './cases.component.css',
    '../../assets/css/bootstrap/bootstrap.css',
  ],
})
export class CasesComponent implements OnInit {
  constructor(
    private caseService: CaseService,
    private fb: FormBuilder,
    private router: Router,
    private componentTitle: Title
  ) {}

  show_graphs_warning = false;

  @HostListener('window:resize') updateOrientationState() {
    if (window.innerWidth < 991) {
      if (window.innerHeight > window.innerWidth) {
        this.show_graphs_warning = true;
      } else {
        this.show_graphs_warning = false;
      }
    } else {
      this.show_graphs_warning = false;
    }
  }

  config: SwiperOptions = {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    observer: false, // Set to to true to enable automatic update calls.
    spaceBetween: 100, // Space in pixels between the Swiper items (Default: 0).
    slidesPerView: 1, // Number of the items per view or 'auto' (Default: 1).
    direction: 'horizontal', // Direction of the Swiper (Default: 'horizontal').
    threshold: 10, // Distance needed for the swipe action (Default: 0).
    centeredSlides: false,
  };

  chip_visible = true;
  chip_selectable = true;
  chip_removable = true;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  tags_list: string[] = [];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.toString();
    if ((value || '').trim()) {
      if (!this.tags_list.includes(value.trim())) {
        this.tags_list.push(value);

        setTimeout(() => {
          var array = document.getElementsByClassName('search-chip');
          var last_tag = array.item(array.length - 1);
          switch (this.tagType.id) {
            case 'judgeName':
              last_tag?.classList.add('judgeName');
              this.bench = this.bench.concat(value, ',');
              // console.log(this.bench);
              // console.log(last_tag);
              break;

            case 'petitionerName':
              last_tag?.classList.add('petitionerName');
              this.petitioner = this.petitioner.concat(value, ',');
              // console.log(this.petitioner);
              // console.log(last_tag);
              break;

            case 'petitionerCounsel':
              last_tag?.classList.add('petitionerCounsel');
              // console.log(last_tag);
              break;

            case 'respondentName':
              last_tag?.classList.add('respondentName');
              this.respondent = this.respondent.concat(value, ',');
              // console.log(this.respondent);
              // console.log(last_tag);
              break;

            case 'respondentCounsel':
              last_tag?.classList.add('respondentCounsel');
              // console.log(last_tag);
              break;

            default:
              break;
          }
        }, 500);
      }
    }
    if (input) {
      input.value = '';
    }
  }

  remove(tag: string): void {
    const index = this.tags_list.indexOf(tag);
    if (index >= 0) {
      this.tags_list.splice(index, 1);
    }
  }

  judgement_options: any = [
    { item_id: 1, item_text: 'allowed', item_name: 'Allowed' },
    { item_id: 2, item_text: 'dismissed', item_name: 'Dismissed' },
    { item_id: 3, item_text: 'tied / unclear', item_name: 'Tied or unclear' },
    { item_id: 4, item_text: 'partly allowed', item_name: 'Partly Allowed' },
    {
      item_id: 5,
      item_text: 'partly dismissed',
      item_name: 'Partly Dismissed',
    },
  ];
  selectedJudgements: any = [];
  dropdownSettings: any = {};

  tags_colors = ['#a4c2f4ff', '#b6d7a8ff', '#f9cb9cff', '#ffe599ff'];

  isMobile = false;
  Highcharts = Highcharts;

  pvbChartOptions: Highcharts.Options = {};
  casesWordCloudOptions: Highcharts.Options = {
    accessibility: {
      screenReaderSection: {
        beforeChartFormat:
          '<h5>{chartTitle}</h5>' +
          '<div>{chartSubtitle}</div>' +
          '<div>{chartLongdesc}</div>' +
          '<div>{viewTableButton}</div>',
      },
    },
    series: [
      {
        type: 'wordcloud',
        data: [
          { name: 'ABCD', weight: 20 },
          { name: 'PQRS', weight: 10 },
          { name: 'XYZ', weight: 10 },
          { name: 'LMN', weight: 3 },
        ],
        name: 'Occurrences',
        colors: ['#000000'],
        rotation: {
          from: 0,
          to: 0,
          orientations: 1,
        },
      },
    ],
    title: {
      text: '',
    },
  };
  rvbChartOptions: Highcharts.Options = {};
  pvb_Bench: any = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  rvb_Bench: any = [];
  pvb_Counsel: any = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  rvb_Counsel: any = [];
  pvb_data: any = [];
  rvb_data: any = [];
  myForm: any;
  courtForm: any;
  selectedCountry: any;
  disabled = false;
  ShowFilter = false;
  limitSelection = false;
  searched: boolean = false;
  view_search: boolean = false;
  view_analytics: boolean = false;
  grid_view: boolean = true;
  view_analytics_mobile: boolean = false;
  view_citations: boolean = false;
  view_tags: boolean = false;
  view_tags_mobile: boolean = false;
  selectedCourts: any = [];
  rows: Case[] = [];
  cited_cases: any = [];
  autocomplete_suggestions: any =[];
  cited_cases_url_unsorted: any = [];
  cited_cases_url: any = [];
  query: string = '"medical negligence"';
  results_count: number = 0;
  results_time: number = 0;
  arrayOne: Array<number> = [];
  page: number = 1;
  limit: number = 10;
  judge: string = '';
  court: string = '';
  tagTypeValue: string = '';
  curr_sort: string = 'relevance';
  year: number = 2020;
  judgement: Array<string> = [
    'allowed',
    'dismissed',
    'tied / unclear',
    'partly allowed',
    'partly dismissed',
  ];
  courts: any = [];
  bench: string = '';
  petitioner: string = '';
  respondent: string = '';
  petitioner_counsel: string = '';
  respondent_counsel: string = '';
  courtlevel: any;
  tagType: any;
  sortBy: any;
  chartsView: any;
  defaultcourt: any;
  loading: boolean = false;
  CitedActNames: any = [];
  CitedActCorrectedData: any = [];
  CitedActCorrectedDataNames: any = [];
  CitedProvisions: any = [];
  charts_unloaded: boolean = true;
  citations_unloaded: boolean = true;

  pvb_init() {
    this.pvbChartOptions = {
      chart: {
        // height: 500,
        type: 'heatmap',
        marginTop: 40,
        marginBottom: 160,
        plotBorderWidth: 0,
      },
      title: {
        text: 'Petitioner Counsel against Benches',
        style: {
          color: '#666666',
          fontWeight: 'bold',
          fontSize: '12px',
        },
      },
      colorAxis: {
        maxColor: '#FFA1B5',
        minColor: '#FFFFFF',
      },
      xAxis: {
        title: {
          text: 'Bench',
        },
        categories: this.pvb_Bench,
      },
      yAxis: {
        title: {
          text: 'Petitoner Counsel',
        },
        categories: this.pvb_Counsel,
      },
      legend: {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        y: 25,
        symbolHeight: 200,
      },
      tooltip: {
        formatter: function () {
          return (
            '<b>' +
            this.series.yAxis.categories[this.point.y!] +
            '</b> represented <br><b>' +
            this.point.value +
            '</b> appellants in front of <br><b>' +
            this.series.xAxis.categories[this.point.x] +
            '</b>'
          );
        },
        enabled: true,
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: 'Petitioner Counsel against Benches',
          type: 'heatmap',
          borderColor: '#FFFFFF',
          borderWidth: 4,
          data: this.pvb_data,
          //   dataLabels: {
          //     enabled: true,
          //     color: '#000000'
          // }
        },
      ],
    };
  }

  rvb_init() {
    this.rvbChartOptions = {
      chart: {
        // height: 500,
        // width: 614,
        type: 'heatmap',
        marginTop: 40,
        marginBottom: 160,
        plotBorderWidth: 0,
      },
      title: {
        text: 'Respondent Counsel against Benches',
        style: {
          color: '#666666',
          fontWeight: 'bold',
          fontSize: '12px',
        },
      },
      colorAxis: {
        maxColor: '#86C7F3',
        minColor: '#FFFFFF',
      },
      xAxis: {
        title: {
          text: 'Bench',
        },
        categories: this.rvb_Bench,
      },
      yAxis: {
        title: {
          text: 'Respondent Counsel',
        },
        categories: this.rvb_Counsel,
      },
      legend: {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        y: 25,
        symbolHeight: 200,
      },
      tooltip: {
        formatter: function () {
          return (
            '<b>' +
            this.series.yAxis.categories[this.point.y!] +
            '</b> represented <br><b>' +
            this.point.value +
            '</b> respondents in front of <br><b>' +
            this.series.xAxis.categories[this.point.x] +
            '</b>'
          );
        },
        enabled: true,
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: 'Respondent Counsel against Benches',
          type: 'heatmap',
          borderColor: '#FFFFFF',
          borderWidth: 4,
          data: this.rvb_data,
          //   dataLabels: {
          //     enabled: true,
          //     color: '#000000'
          // }
        },
      ],
    };
  }

  public doughnutChartOptions: ChartOptions = {
    title: {
      text: 'Judgement distribution',
      display: true,
    },
    responsive: true,
  };
  public petitionerChartOptions: ChartOptions = {
    title: {
      text: 'Petitioner Counsel Stats',
      display: true,
    },
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Number of cases',
          },
          ticks: {
            fontSize: 10,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            fontSize: 10,
            callback: function (value: any) {
              if (value.length > 20) {
                return value.substr(0, 20) + '...'; //truncate
              } else {
                return value;
              }
            },
          },
        },
      ],
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public petitionerChartLabels: Label[] = [
    '2006',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012',
  ];
  public petitionerChartType: ChartType = 'horizontalBar';
  public petitionerChartLegend = true;
  public petitionerChartLimit = 10;
  public petitionerChartData: ChartDataSets[] = [
    { data: [], label: '', stack: 'a' },
    { data: [], label: '', stack: 'a' },
    { data: [], label: '', stack: 'a' },
    { data: [], label: '', stack: 'a' },
    { data: [], label: '', stack: 'a' },
  ];
  public respondentChartOptions: ChartOptions = {
    title: {
      text: 'Respondent Counsel Stats',
      display: true,
    },
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Number of cases',
          },
          ticks: {
            fontSize: 10,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            fontSize: 10,
            callback: function (value: any) {
              if (value.length > 20) {
                return value.substr(0, 20) + '...'; //truncate
              } else {
                return value;
              }
            },
          },
        },
      ],
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };

  public respondentChartLabels: Label[] = [
    '2005',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012',
  ];
  public respondentChartType: ChartType = 'horizontalBar';
  public respondentChartLegend = true;
  public respondentChartLimit = 10;
  public respondentChartData: ChartDataSets[] = [
    { data: [], label: '', stack: 'a' },
    { data: [], label: '', stack: 'a' },
    { data: [], label: '', stack: 'a' },
    { data: [], label: '', stack: 'a' },
    { data: [], label: '', stack: 'a' },
  ];
  court_list: any = [];
  court_items: any = [];
  court_id_names: any = [];
  populate_courts() {
    for (var i = 0; i < this.court_list.length; i++) {
      this.court_items.push({
        item_id: i,
        item_text: this.court_list[i],
        item_name: this.court_list[i],
      });
      this.court_id_names.push({
        id: this.court_list[i],
        name: this.court_list[i],
      });
    }
    this.court_options = this.court_items;
    this.courtdata = this.court_id_names;
    this.courts = this.court_list;
  }
  court_options: any = [];

  courtdata: any = [];

  tagCategory: any = [
    { id: 'judgeName', name: 'Judge Name', subtitle: 'Judge' },
    { id: 'petitionerName', name: 'Petitioner Name', subtitle: 'Petitioner' },
    {
      id: 'petitionerCounsel',
      name: 'Petitioner Counsel',
      subtitle: 'Petitioner Counsel',
    },
    { id: 'respondentName', name: 'Respondent Name', subtitle: 'Respondent' },
    {
      id: 'respondentCounsel',
      name: 'Respondent Counsel',
      subtitle: 'Respondent Counsel',
    },
  ];

  charts_views: any = [{ view: 'Grid' }, { view: 'List' }];
  sort_options: any = [
    { id: 'relevance', name: 'Most Relevant' },
    { id: 'year', name: 'Most Recent' },
  ];

  country_options: any = [
    {
      id: 'india',
      name: 'India',
      src: '../../assets/img/ind_flg.svg',
    },
    {
      id: 'singapore',
      name: 'Singapore',
      src: '../../assets/img/sg_flg.svg',
    },
  ];

  linechartOptions: ChartOptions = {
    title: {
      text: 'Judgement trend over years',
      display: true,
    },
    responsive: true,
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Year',
          },
          ticks: {
            fontSize: 10,
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Number of cases',
          },
          // stacked: true
          ticks: {
            fontSize: 10,
          },
        },
      ],
    },
  };
  chartData: any = [
    { data: [], label: '', stack: 'a' },
    { data: [], label: '', stack: 'a' },
    { data: [], label: '', stack: 'a' },
    { data: [], label: '', stack: 'a' },
    { data: [], label: '', stack: 'a' },
  ];
  chartLabels: any = [1990, 2000, 2010, 2020];

  public doughnutChartData = [[350, 450, 100]];
  public doughnutChartLabels = ['allowed', 'dismissed', 'tied / unclear'];
  public doughnutChartType: ChartType = 'doughnut';
  Datalabels: any = [];
  petitionerDatalabels: any = [];
  respondentDatalabels: any = [];

  ngOnInit() {
    this.court_list = [
      'Supreme Court of India',
      'Allahabad High Court',
      'Andhra High Court',
      'Andhra Pradesh High Court - Amravati',
      'Bombay High Court',
      'Calcutta High Court',
      'Chattisgarh High Court',
      'Delhi High Court',
      'Gauhati High Court',
      'Gujarat High Court',
      'Himachal Pradesh High Court',
      'Jammu & Kashmir High Court',
      'Jharkhand High Court',
      'Karnataka High Court',
      'Madhya Pradesh High Court',
      'Madras High Court',
      'Manipur High Court',
      'Orissa High Court',
      'Patna High Court',
      'Punjab-Haryana High Court',
      'Rajasthan High Court',
      'Sikkim High Court',
      'Telangana High Court',
      'Tripura High Court',
      'Appellate Tribunal For Electricity',
      'Authority Tribunal',
      'Central Administrative Tribunal - Ahmedabad',
      'Central Administrative Tribunal - Allahabad',
      'Central Administrative Tribunal - Bangalore',
      'Central Administrative Tribunal - Chandigarh',
      'Central Administrative Tribunal - Cuttack',
      'Central Administrative Tribunal - Delhi',
      'Central Administrative Tribunal - Ernakulam',
      'Central Administrative Tribunal - Gauhati',
      'Central Administrative Tribunal - Gwalior',
      'Central Administrative Tribunal - Hyderabad',
      'Central Administrative Tribunal - Jabalpur',
      'Central Administrative Tribunal - Jaipur',
      'Central Administrative Tribunal - Jodhpur',
      'Central Administrative Tribunal - Kolkata',
      'Central Administrative Tribunal - Lucknow',
      'Central Administrative Tribunal - Madras',
      'Central Administrative Tribunal - Mumbai',
      'Central Administrative Tribunal - Patna',
      'Central Administrative Tribunal - Ranchi',
      'Central Electricity Regulatory Commission',
      'Company Law Board',
      'Customs, Excise and Gold Tribunal - Ahmedabad',
      'Customs, Excise and Gold Tribunal - Bangalore',
      'Customs, Excise and Gold Tribunal - Bhubneswar',
      'Customs, Excise and Gold Tribunal - Calcutta',
      'Customs, Excise and Gold Tribunal - Delhi',
      'Customs, Excise and Gold Tribunal - Hyderabad',
      'Customs, Excise and Gold Tribunal - Mumbai',
      'Customs, Excise and Gold Tribunal - Ranchi',
      'Customs, Excise and Gold Tribunal - Tamil Nadu',
      'National Company Law Appellate Tribunal',
      'National Consumer Disputes Redressal',
      'State Consumer Disputes Redressal Commission',
    ];
    this.populate_courts();
    this.selectedCountry = this.country_options[0];
    this.updateOrientationState();
    if (localStorage.device_type == 'mobile') this.isMobile = true;
    else this.isMobile = false;
    // if (!localStorage.getItem('token_exp')) this.router.navigate(['/users'])
    this.componentTitle.setTitle('FirstCase | Search');
    this.pvb_init();
    this.rvb_init();
    this.selectedCourts = this.court_options;
    this.courtlevel = this.courtdata[0];
    this.court = this.courtdata[0].name;
    this.courtForm = this.fb.group({
      city: [this.selectedCourts],
    });
    this.tagType = this.tagCategory[0];
    this.chartsView = this.charts_views[0];
    this.sortBy = this.sort_options[0];

    this.selectedJudgements = this.judgement_options;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: this.ShowFilter,
    };

    this.selectedJudgements = this.judgement_options;

    // this.dropdownSettings = {
    //   singleSelection: false,
    //   idField: 'item_id',
    //   textField: 'item_text',
    //   selectAllText: 'Select All',
    //   unSelectAllText: 'UnSelect All',
    //   itemsShowLimit: 5,
    //   allowSearchFilter: this.ShowFilter,
    // };

    this.date_floor = {
      year: 1900,
      month: 1,
      day: 1,
    };

    this.date_ceil = {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      day: new Date().getDay(),
    };

    this.myForm = this.fb.group({
      city: [this.selectedJudgements],
    });

    // if (localStorage.getItem('token_exp')) {
    //   var exp = parseInt(localStorage.token_exp);
    //   var curr_time = new Date().getTime();
    //   if (curr_time > exp) {
    //     localStorage.removeItem('token_exp');
    //     console.log('cases page: Previous token expired, login again!');
    //     this.router.navigate(['/users']); // navigate to login page
    //   }
    // } else {
    //   console.log('User not logged in, Login required');
    //   this.router.navigate(['/users']); // navigate to login page
    // }
  }

  onItemSelect(item: any) {
    // console.log(item);
    // console.log(this.selectedJudgements);
  }
  OnItemDeSelect(item: any) {
    // console.log(item);
    // console.log(this.selectedJudgements);
  }
  onSelectAll(items: any) {
    // console.log(items);
  }
  onDeSelectAll(items: any) {
    // console.log(items);
  }

  toggleShowFilter() {
    this.ShowFilter = !this.ShowFilter;
    this.dropdownSettings = Object.assign({}, this.dropdownSettings, {
      allowSearchFilter: this.ShowFilter,
    });
  }

  handleLimitSelection() {
    if (this.limitSelection) {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, {
        limitSelection: 2,
      });
    } else {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, {
        limitSelection: null,
      });
    }
  }

  selected() {
    this.court = this.courtlevel.name;
    this.curr_sort = this.sortBy.id;
    switch (this.selectedCountry.id) {
      case 'india':
        this.select_in();
        break;

      case 'singapore':
        this.select_sg();
        break;

      default:
        break;
    }
  }

  selected_tag() {
    this.tagTypeValue = this.tagType.name;
  }

  search_by_object_id() {
    this.caseService.getSpecificCase(this.query).subscribe((data: any) => {
      this.rows = data.case_list;
    });
    this.rows = [];
  }
  
  first_search() {
    GoogleAnalyticsService.eventEmitter(
      'Search_button',
      'button',
      'click',
      this.query,
      this.results_count
    );
    this.page = 1;
    this.loading = true;
    // console.log(this.loading);
    this.search();
  }

  search_on_enter_press(event: any) {
    if (event.which == 13) {
      this.first_search();
    }
  }

  toggle_analytics_mobile() {
    this.view_analytics_mobile = !this.view_analytics_mobile;
  }

  show_analytics() {
    if (this.charts_unloaded) {
      this.loading = true;
      GoogleAnalyticsService.eventEmitter(
        'Analytics_tab',
        'button',
        'click',
        'Analytics Tab',
        this.results_count
      );

      if (this.charts_unloaded) {
        this.getLineCharts();
        this.getPetitionerChart();
        this.getPieCharts();
        this.getPtn_v_BenchChart();
        this.getRespondentChart();
        this.getRsp_v_BenchChart();
        this.charts_unloaded = false;
      }
    }
    this.view_search = false;
    this.view_citations = false;
    this.view_analytics = true;
    // console.log(this.searched);
    let element = document.getElementById('analytics_tab');
    element!.className = 'tab active';
    let element2 = document.getElementById('search_tab');
    element2!.className = 'tab';
    let element3 = document.getElementById('citation_tab');
    element3!.className = 'tab';
    this.loading = false;
    // console.log('show_analytics end - loading: ', this.loading);

    // console.log('view_search ' + this.view_search);
  }

  toggle_charts_view() {
    this.grid_view = !this.grid_view;
    if (this.grid_view) this.chartsView = this.charts_views[0];
    else this.chartsView = this.charts_views[1];
  }

  show_citations() {
    if (this.citations_unloaded) {
      this.loading = true;
      GoogleAnalyticsService.eventEmitter(
        'citations_tab',
        'button',
        'click',
        'Citations Tab',
        this.results_count
      );
      // console.log('show_citations start - loading: ', this.loading);
      if (this.citations_unloaded) {
        this.getCitedActs();
        this.getCitedCases();
        this.getCitedLaws();
        this.citations_unloaded = false;
      }
    }

    this.view_search = false;
    this.view_analytics = false;
    this.view_citations = true;
    let element = document.getElementById('citation_tab');
    element!.className = 'tab active';
    let element2 = document.getElementById('search_tab');
    element2!.className = 'tab';
    let element3 = document.getElementById('analytics_tab');
    element3!.className = 'tab ';

    // console.log('view_search ' + this.view_search);
  }

  show_search() {
    this.view_search = true;
    this.view_analytics = false;
    this.view_citations = false;
    GoogleAnalyticsService.eventEmitter(
      'search_tab',
      'button',
      'click',
      'Search Tab',
      this.results_count
    );
    let element = document.getElementById('search_tab');
    element!.className = 'tab active';
    let element2 = document.getElementById('analytics_tab');
    element2!.className = 'tab';
    let element3 = document.getElementById('citation_tab');
    element3!.className = 'tab';
    // console.log('view_search ' + this.view_search);
    this.loading = false;
  }

  toggle_filters() {
    this.view_tags = !this.view_tags;
    this.view_tags_mobile = !this.view_tags_mobile;
  }

  reset_filters() {
    // this.selectedJudgements = [];
    this.bench = '';
    this.tags_list = [];
    this.tagType = this.tagCategory[0];
    this.no_of_tags = 0;
    // this.court = '';
    this.sortBy = this.sort_options[0];
    this.petitioner = '';
    this.respondent = '';
    this.petitioner_counsel = '';
    this.respondent_counsel = '';
  }

  reset_on_search_change() {
    // this.view_tags = false;
    // this.tags_list = [];
    // this.tagType = this.tagCategory[0];
    this.CitedActNames = [];
    this.CitedProvisions = [];
    // this.searched = false;
    // this.no_of_tags = 0;
    // this.view_search = false;
    // this.sortBy = this.sort_options[0];
    // this.query = '';
    // this.add_tag = '';
    // this.bench = '';
    // this.petitioner = '';
    // this.respondent = '';
    this.rows.length = 0;
    this.cited_cases.length = 0;
    this.results_count = 0;
    this.chartData = [
      { data: [], label: '', stack: 'a' },
      { data: [], label: '', stack: 'a' },
      { data: [], label: '', stack: 'a' },
      { data: [], label: '', stack: 'a' },
      { data: [], label: '', stack: 'a' },
    ];
    this.pvb_Bench = [];
    this.pvb_Counsel = [];
    this.pvb_data = [];
    this.rvb_Bench = [];
    this.rvb_Counsel = [];
    this.rvb_data = [];
    this.chartLabels = [1990, 2000, 2010, 2020];
    this.doughnutChartData = [[350, 450, 100]];
    this.doughnutChartLabels = ['Allowed', 'Dismissed', 'Tied or Unclear'];
    // this.selectedJudgements = this.judgement_options;
  }

  search() {
    this.reset_on_search_change();
    this.searched = true;
    this.view_search = true;
    this.charts_unloaded = true;
    this.citations_unloaded = true;
    if (this.query.length == 0) {
      this.query = [this.bench, this.petitioner, this.respondent].join(' ');
      if (this.query.length == 2) {
        this.query = '';
        return;
      }
    }
    this.loading = true;
    // console.log('search start - loading: ', this.loading);
    this.judgement = [];
    this.selectedJudgements.map((item: any) => {
      this.judgement.push(item.item_text);
    });
    this.courts = [];
    this.selectedCourts.map((item: any) => {
      this.courts.push(item.item_text);
    });

    this.caseService
      .getSearchedCases(
        this.query,
        this.courts,
        this.judgement,
        this.bench,
        this.petitioner,
        this.respondent,
        this.page,
        this.limit,
        this.curr_sort,
        this.date_floor.year,
        this.date_ceil.year
      )
      .subscribe((data: any) => {
        // console.log(data.case_list);
        if (data.success) {
          this.rows = data.case_list;
          this.results_time = data.result_time;
          this.results_count = data.result_count;
        } else {
          alert(data.msg);
          this.reset();
          this.reset_filters();
        }
        this.loading = false;
        // console.log('search end - loading: ', this.loading);
      });

    if (Boolean(this.view_search) == false) this.show_search();
    this.createArray(this.results_count);
    this.show_search();
  }

  getLineCharts() {
    this.caseService
      .getLineCharts(
        this.query,
        this.courts,
        this.judgement,
        this.bench,
        this.petitioner,
        this.respondent,
        this.date_floor.year,
        this.date_ceil.year
      )
      .subscribe((data: any) => {
        // data = data[0];
        // console.log(data);
        this.chartLabels.length = 0;
        this.Datalabels.length = 0;
        try {
          data.map((item: any) => {
            if (!this.chartLabels.includes(item.x)) {
              this.chartLabels.push(item.x);
            }
            if (!this.Datalabels.includes(item.color)) {
              this.Datalabels.push(item.color);
            }
            this.Datalabels.sort();
          });
          this.chartData = [
            { data: [], label: '', stack: 'a' },
            { data: [], label: '', stack: 'a' },
            { data: [], label: '', stack: 'a' },
            { data: [], label: '', stack: 'a' },
            { data: [], label: '', stack: 'a' },
          ];
          for (var i = 0; i < this.Datalabels.length; i++) {
            var arr = [];
            for (var j = 0; j < this.chartLabels.length; j++) {
              var found = false;
              for (var k = 0; k < data.length; k++) {
                if (
                  data[k].color === this.Datalabels[i] &&
                  data[k].x === this.chartLabels[j]
                ) {
                  arr.push(data[k].y);
                  found = true;
                }
              }
              if (found === false) arr.push(0);
            }
            this.chartData[i].data = arr;
            this.chartData[i].label = this.Datalabels[i];
            this.chartData[i].stack = 'a';
          }
        } catch (error) {
          // console.log(error);
        }
      });
  }

  getPieCharts() {
    this.caseService
      .getPieCharts(
        this.query,
        this.courts,
        this.judgement,
        this.bench,
        this.petitioner,
        this.respondent,
        this.date_floor.year,
        this.date_ceil.year
      )
      .subscribe((data: any) => {
        var arr: any = [];
        try {
          this.doughnutChartData.length = 0;
          this.doughnutChartLabels.length = 0;
          data.map((item: any) => {
            if (!this.doughnutChartLabels.includes(item.label)) {
              this.doughnutChartLabels.push(item.label);
            }
            this.doughnutChartLabels.sort();
            arr.push(item.value);
          });
        } catch (error) {
          // console.log(error);
        }

        this.doughnutChartData = arr;
        this.loading = false;
      });
  }

  getPetitionerChart() {
    this.caseService
      .getPetitionerChart(
        this.query,
        this.courts,
        this.judgement,
        this.bench,
        this.petitioner,
        this.respondent,
        this.date_floor.year,
        this.date_ceil.year
      )
      .subscribe((data: any) => {
        this.petitionerChartLabels.length = 0;
        this.petitionerDatalabels.length = 0;
        try {
          data.map((item: any) => {
            if (item.group.length <= 5) data.pop(item);
          });
          data.map((item: any) => {
            if (!this.petitionerChartLabels.includes(item.group)) {
              this.petitionerChartLabels.push(item.group);
            }
            if (!this.petitionerDatalabels.includes(item.dynamicColumns)) {
              this.petitionerDatalabels.push(item.dynamicColumns);
            }
            this.petitionerDatalabels.sort();
          });
          this.petitionerChartData = [
            { data: [], label: '', stack: 'a' },
            { data: [], label: '', stack: 'a' },
            { data: [], label: '', stack: 'a' },
            { data: [], label: '', stack: 'a' },
            { data: [], label: '', stack: 'a' },
          ];
          for (var i = 0; i < this.petitionerDatalabels.length; i++) {
            var arr = [];
            for (var j = 0; j < this.petitionerChartLabels.length; j++) {
              var found = false;
              for (var k = 0; k < data.length; k++) {
                if (
                  data[k].dynamicColumns === this.petitionerDatalabels[i] &&
                  data[k].group === this.petitionerChartLabels[j]
                ) {
                  arr.push(data[k].value);
                  found = true;
                }
              }
              if (found === false) arr.push(0);
            }
            this.petitionerChartData[i].data = arr;
            this.petitionerChartData[i].label = this.petitionerDatalabels[i];
            this.petitionerChartData[i].stack = 'a';
          }

          var sums = [];
          for (var i = 0; i < this.petitionerChartLabels.length; i++) {
            var sum: any = 0;
            for (var j = 0; j < this.petitionerDatalabels.length; j++) {
              sum = sum + this.petitionerChartData[j].data![i];
            }
            sums[i] = sum;
          }
          // console.log(this.petitionerChartData);
          // console.log(sums);
          var n = this.petitionerChartLabels.length;
          for (var i = n; i >= 0; i--) {
            for (var j = n; j > n - i; j--) {
              if (sums[j] > sums[j - 1]) {
                for (var k = 0; k < this.petitionerDatalabels.length; k++) {
                  var temp = this.petitionerChartData[k].data![j];
                  this.petitionerChartData[k].data![j] =
                    this.petitionerChartData[k].data![j - 1];
                  this.petitionerChartData[k].data![j - 1] = temp;
                }
                var temp2 = this.petitionerChartLabels[j];
                this.petitionerChartLabels[j] =
                  this.petitionerChartLabels[j - 1];
                this.petitionerChartLabels[j - 1] = temp2;
                var temp3;
                temp3 = sums[j];
                sums[j] = sums[j - 1];
                sums[j - 1] = temp3;
              }
            }
          }
          for (var i = 0; i < this.petitionerChartData.length; i++) {
            this.petitionerChartData[i].data = this.petitionerChartData[
              i
            ]?.data?.slice(0, this.petitionerChartLimit);
          }
          this.petitionerChartLabels = this.petitionerChartLabels.slice(
            0,
            this.petitionerChartLimit
          );
          // console.log(this.petitionerChartData);
          // console.log(this.petitionerChartLabels);
        } catch (error) {
          // console.log(error);
        }
      });
  }

  getRespondentChart() {
    this.caseService
      .getRespondentChart(
        this.query,
        this.courts,
        this.judgement,
        this.bench,
        this.petitioner,
        this.respondent,
        this.date_floor.year,
        this.date_ceil.year
      )
      .subscribe((data: any) => {
        this.respondentChartLabels.length = 0;
        this.respondentDatalabels.length = 0;
        try {
          data.map((item: any) => {
            if (item.group.length <= 5) data.pop(item);
          });
          data.map((item: any) => {
            if (!this.respondentChartLabels.includes(item.group)) {
              this.respondentChartLabels.push(item.group);
            }
            if (!this.respondentDatalabels.includes(item.dynamicColumns)) {
              this.respondentDatalabels.push(item.dynamicColumns);
            }
            this.respondentDatalabels.sort();
          });
          // this.respondentChartLabels = [...new Set(this.respondentChartLabels)];
          this.respondentChartData = [
            { data: [], label: '', stack: 'a' },
            { data: [], label: '', stack: 'a' },
            { data: [], label: '', stack: 'a' },
            { data: [], label: '', stack: 'a' },
            { data: [], label: '', stack: 'a' },
          ];
          for (var i = 0; i < this.respondentDatalabels.length; i++) {
            var arr = [];
            for (var j = 0; j < this.respondentChartLabels.length; j++) {
              var found = false;
              for (var k = 0; k < data.length; k++) {
                if (
                  data[k].dynamicColumns === this.respondentDatalabels[i] &&
                  data[k].group === this.respondentChartLabels[j]
                ) {
                  arr.push(data[k].value);
                  found = true;
                }
              }
              if (found === false) arr.push(0);
            }
            this.respondentChartData[i].data = arr;
            this.respondentChartData[i].label = this.respondentDatalabels[i];
            this.respondentChartData[i].stack = 'a';
          }

          var sums = [];
          for (var i = 0; i < this.respondentChartLabels.length; i++) {
            var sum: any = 0;
            for (var j = 0; j < this.respondentDatalabels.length; j++) {
              sum = sum + this.respondentChartData[j].data![i];
            }
            sums[i] = sum;
          }
          // console.log(sums);
          var n = this.respondentChartLabels.length;
          for (var i = n; i >= 0; i--) {
            for (var j = n; j > n - i; j--) {
              if (sums[j] > sums[j - 1]) {
                for (var k = 0; k < this.respondentDatalabels.length; k++) {
                  var temp = this.respondentChartData[k].data![j];
                  this.respondentChartData[k].data![j] =
                    this.respondentChartData[k].data![j - 1];
                  this.respondentChartData[k].data![j - 1] = temp;
                }
                var temp2 = this.respondentChartLabels[j];
                this.respondentChartLabels[j] =
                  this.respondentChartLabels[j - 1];
                this.respondentChartLabels[j - 1] = temp2;
                var temp3;
                temp3 = sums[j];
                sums[j] = sums[j - 1];
                sums[j - 1] = temp3;
              }
            }
          }
          for (var i = 0; i < this.respondentChartData.length; i++) {
            this.respondentChartData[i].data = this.respondentChartData[
              i
            ]?.data?.slice(0, this.respondentChartLimit);
          }
          this.respondentChartLabels = this.respondentChartLabels.slice(
            0,
            this.respondentChartLimit
          );
        } catch (error) {
          // console.log(error);
        }
      });
  }

  getPtn_v_BenchChart() {
    this.caseService
      .getPtn_v_BenchChart(
        this.query,
        this.courts,
        this.judgement,
        this.bench,
        this.petitioner,
        this.respondent,
        this.date_floor.year,
        this.date_ceil.year
      )
      .subscribe((data: any) => {
        try {
          this.pvb_Bench = [];
          this.pvb_Counsel = [];
          data.map((item: any) => {
            if (!this.pvb_Bench.includes(item.x)) {
              this.pvb_Bench.push(item.x);
            }
            if (!this.pvb_Counsel.includes(item.y)) {
              this.pvb_Counsel.push(item.y);
            }
          });
          this.pvb_Bench = this.pvb_Bench.slice(0, this.petitionerChartLimit);
          this.pvb_Counsel = this.petitionerChartLabels;
          // this.pvb_Counsel = this.pvb_Counsel.slice(0, 7);
          this.pvb_data = [];
          // this.pvb_data.length=0;
          for (let i = 0; i < this.pvb_Bench.length; i++) {
            for (let j = 0; j < this.pvb_Counsel.length; j++) {
              var temp = 0;
              for (var k = 0; k < data.length; k++) {
                if (
                  data[k].x === this.pvb_Bench[i] &&
                  data[k].y === this.pvb_Counsel[j]
                ) {
                  temp = data[k].color;
                  break;
                }
              }
              this.pvb_data.push({
                x: i,
                y: j,
                value: temp,
                id: 'p' + i + ':' + j,
              });
            }
          }
          // console.log(this.pvb_data);
          this.pvb_init();
        } catch (error) {
          // console.log(error);
        }
      });
  }

  getRsp_v_BenchChart() {
    this.caseService
      .getRsp_v_BenchChart(
        this.query,
        this.courts,
        this.judgement,
        this.bench,
        this.petitioner,
        this.respondent,
        this.date_floor.year,
        this.date_ceil.year
      )
      .subscribe((data: any) => {
        try {
          // console.log(data);
          this.rvb_Bench = [];
          this.rvb_Counsel = [];
          data.map((item: any) => {
            if (!this.rvb_Bench.includes(item.x)) {
              this.rvb_Bench.push(item.x);
            }
            if (!this.rvb_Counsel.includes(item.y)) {
              this.rvb_Counsel.push(item.y);
            }
          });
          this.rvb_Bench = this.rvb_Bench.slice(0, this.respondentChartLimit);
          this.rvb_Counsel = this.respondentChartLabels;
          // this.rvb_Counsel = this.rvb_Counsel.slice(0, 7);
          this.rvb_data = [];
          // this.pvb_data.length=0;
          for (let i = 0; i < this.rvb_Bench.length; i++) {
            for (let j = 0; j < this.rvb_Counsel.length; j++) {
              var temp = 0;
              for (var k = 0; k < data.length; k++) {
                if (
                  data[k].x === this.rvb_Bench[i] &&
                  data[k].y === this.rvb_Counsel[j]
                ) {
                  temp = data[k].color;
                  break;
                }
              }
              this.rvb_data.push({
                x: i,
                y: j,
                value: temp,
                id: 'p' + i + ':' + j,
              });
            }
          }
          // console.log(this.rvb_data);
          this.rvb_init();
          this.loading = false;
          // console.log('getRsp_v_BenchChart end - loading: ', this.loading);
        } catch (error) {
          // console.log(error);
        }
      });
  }

  getCitedCases() {
    this.caseService
      .getCitedCases(
        this.query,
        this.courts,
        this.judgement,
        this.bench,
        this.petitioner,
        this.respondent,
        this.date_floor.year,
        this.date_ceil.year
      )
      .subscribe((data: any) => {
        try {
          this.cited_cases = data;
          // console.log(this.cited_cases);
          this.loading = false;
          this.getCitedCaseURLs();
        } catch (error) {
          // console.log(error);
        }
      });
  }

  getCitedCaseURLs() {
    setTimeout(() => {
      try {
        for (var i = 0; i < 10; i++) {
          this.caseService
            .getCaseURL(this.cited_cases[i].group, i)
            .subscribe((data: any) => {
              this.cited_cases_url[data.index] = data.url;
            });
        }
        // console.log('sorted array:', this.cited_cases_url);
      } catch (error) {
        console.log(error);
      }
      // console.log('unsorted json', this.cited_cases_url_unsorted);
    }, 500);
  }

  getCitedActs() {
    this.caseService
      .getCitedActs(
        this.query,
        this.courts,
        this.judgement,
        this.bench,
        this.petitioner,
        this.respondent,
        this.date_floor.year,
        this.date_ceil.year
      )
      .subscribe((data: any) => {
        try {
          this.CitedProvisions = data;
          console.log(this.CitedProvisions.length);
          // this.CitedActCorrectedDataNames = [];
          // data.map((item: any) => {
          //   if (!this.CitedActCorrectedDataNames.includes(item.group))
          //     this.CitedActCorrectedDataNames.push(item.group);
          // });
          // this.CitedActCorrectedData = data;
        } catch (error) {}
      });
  }

  getCitedLaws() {
    this.caseService
      .getCitedLaws(
        this.query,
        this.court,
        this.judgement,
        this.bench,
        this.petitioner,
        this.respondent,
        this.date_floor.year,
        this.date_ceil.year
      )
      .subscribe((data: any) => {
        try {
          this.CitedActNames = [];
          this.CitedProvisions = [];
          data.map((item: any) => {
            if (!this.CitedActNames.includes(item.y))
              this.CitedActNames.push(item.y);
          });
          var sums: any = [];
          var sections: any = [];
          var section_occurrences: any = [];
          this.CitedActNames = this.CitedActCorrectedDataNames;
          for (var i = 0; i < this.CitedActNames.length; i++) {
            sums[i] = 0;
            sections[i] = [];
            section_occurrences[i] = [];
            for (var j = 0; j < data.length; j++) {
              if (data[j].y === this.CitedActNames[i]) {
                sections[i].push(data[j].color);
                section_occurrences[i].push(data[j].x);
              }
            }
            while (this.CitedActCorrectedData.length == 0) {}
            var temp = this.CitedActCorrectedData.find(
              (el: any) => el.group === this.CitedActNames[i]
            );
            sums[i] = temp?.value;
            for (var k = sections[i].length; k > 0; k--) {
              for (
                var l = sections[i].length;
                l > sections[i].length - k;
                l--
              ) {
                if (section_occurrences[i][l] > section_occurrences[i][l - 1]) {
                  var temp4 = section_occurrences[i][l];
                  section_occurrences[i][l] = section_occurrences[i][l - 1];
                  section_occurrences[i][l - 1] = temp4;
                  var temp5 = sections[i][l];
                  sections[i][l] = sections[i][l - 1];
                  sections[i][l - 1] = temp5;
                }
              }
            }
            sections[i] = sections[i].slice(0, 5);
            section_occurrences[i] = section_occurrences[i].slice(0, 5);
          }
          for (var z = 0; z < this.CitedActNames.length; z++) {
            this.CitedProvisions.push({
              act_name: this.CitedActNames[z],
              act_sums: sums[z],
              sections: sections[z],
              section_sums: section_occurrences[z],
            });
          }
        } catch (error) {}
        this.loading = false;
      });
  }

  reset() {
    this.view_tags = false;
    this.tags_list = [];
    this.tagType = this.tagCategory[0];
    this.CitedActNames = [];
    this.CitedProvisions = [];
    this.searched = false;
    this.no_of_tags = 0;
    this.view_search = false;
    this.sortBy = this.sort_options[0];
    this.query = '';
    this.add_tag = '';
    this.bench = '';
    this.petitioner = '';
    this.respondent = '';
    this.rows.length = 0;
    this.cited_cases.length = 0;
    this.results_count = 0;
    this.chartData = [
      { data: [], label: '', stack: 'a' },
      { data: [], label: '', stack: 'a' },
      { data: [], label: '', stack: 'a' },
      { data: [], label: '', stack: 'a' },
      { data: [], label: '', stack: 'a' },
    ];
    this.pvb_Bench = [];
    this.pvb_Counsel = [];
    this.pvb_data = [];
    this.rvb_Bench = [];
    this.rvb_Counsel = [];
    this.rvb_data = [];
    this.chartLabels = [1990, 2000, 2010, 2020];
    this.doughnutChartData = [[350, 450, 100]];
    this.doughnutChartLabels = ['allowed', 'dismissed', 'tied / unclear'];
    this.selectedJudgements = this.judgement_options;
    this.selectedCourts = this.court_options;
  }

  scrollToTop() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  sendNextPage() {
    this.page = this.page + 1;

    this.search();
    this.view_search = true;
    this.scrollToTop();
  }

  sendPreviousPage() {
    this.page = this.page - 1;

    this.search();
    this.view_search = true;
    this.scrollToTop();
  }

  createArray(count: number) {
    this.arrayOne = new Array<number>(count);
  }

  curr_date: any = new Date();

  date_floor: any;
  date_ceil: any;

  year_range_msg: string = '';
  year_range_selected: boolean = false;

  // getSliderValue1(event: any) {
  //   this.date_floor.year = event.target.value;
  //   if (this.date_floor.year > this.date_ceil.year) {
  //     this.year_range_msg = 'Select valid range';
  //     this.date_floor.year = 1900;
  //     this.date_ceil.year = new Date().getFullYear();
  //   } else {
  //     this.year_range_msg =
  //       String(this.date_floor.year) + ' to ' + String(this.date_ceil.year);
  //   }
  //   this.year_range_selected = true;
  // }

  // getSliderValue2(event: any) {
  //   this.date_ceil.year = event.target.value;
  //   if (this.date_floor.year > this.date_ceil.year) {
  //     this.year_range_msg = 'Select valid range';
  //     this.date_floor.year = 1900;
  //     this.date_ceil.year = new Date().getFullYear();
  //   } else {
  //     this.year_range_msg =
  //       String(this.date_floor.year) + ' to ' + String(this.date_ceil.year);
  //   }
  //   this.year_range_selected = true;
  // }

  add_tag: string = '';
  no_of_tags = 0;

  // addTag() {
  //   var object = {
  //     value: this.add_tag,
  //     type: this.tagType.subtitle,
  //   };
  //   this.view_tags = true;
  //   GoogleAnalyticsService.eventEmitter(
  //     'add_tag',
  //     this.tagType.subtitle,
  //     'click',
  //     this.add_tag,
  //     this.results_count
  //   );

  //   if (this.tags_list.indexOf(object) == -1) {
  //     this.tags_list.push(object);
  //     this.no_of_tags = this.no_of_tags + 1;
  //     this.IdTags();
  //   }
  //   // setTimeout(() => {
  //   //   this.IdTags();
  //   // }, 500);
  //   setTimeout(() => {
  //     var elem = document.getElementsByClassName('tags-list-item');
  //     // console.log(elem);
  //     var idx = elem.length - 1;
  //     switch (this.tagType.id) {
  //       case 'judgeName': {
  //         elem[idx].className = 'tags-list-item tag-judgeName';
  //         var elem_h3 = elem[idx].getElementsByTagName('h3');
  //         if (this.bench == '')
  //           this.bench = elem_h3[0]
  //             .textContent!.toLowerCase()
  //             .replace(/\s/g, '');
  //         else
  //           this.bench = this.bench
  //             .concat('|')
  //             .concat(elem_h3[0].textContent!)
  //             .toLowerCase()
  //             .replace(/\s/g, '');
  //         break;
  //       }
  //       case 'petitionerName': {
  //         elem[idx].className = 'tags-list-item tag-petitionerName';
  //         var elem_h3 = elem[idx].getElementsByTagName('h3');
  //         if (this.petitioner == '')
  //           this.petitioner = elem_h3[0]
  //             .textContent!.toLowerCase()
  //             .replace(/\s/g, '');
  //         else
  //           this.petitioner = this.petitioner
  //             .concat('|')
  //             .concat(elem_h3[0].textContent!)
  //             .toLowerCase()
  //             .replace(/\s/g, '');
  //         break;
  //       }
  //       case 'petitionerCounsel': {
  //         elem[idx].className = 'tags-list-item tag-petitionerCounsel';
  //         break;
  //       }
  //       case 'respondentName': {
  //         elem[idx].className = 'tags-list-item tag-respondentName';
  //         var elem_h3 = elem[idx].getElementsByTagName('h3');
  //         if (this.respondent == '')
  //           this.respondent = elem_h3[0]
  //             .textContent!.toLowerCase()
  //             .replace(/\s/g, '');
  //         else
  //           this.respondent = this.respondent
  //             .concat('|')
  //             .concat(elem_h3[0].textContent!)
  //             .toLowerCase()
  //             .replace(/\s/g, '');
  //         break;
  //       }
  //       case 'respondentCounsel': {
  //         elem[idx].className = 'tags-list-item tag-respondentCounsel';
  //         break;
  //       }
  //     }
  //     console.log('bench: ', this.bench);
  //     console.log('petitioner: ', this.petitioner);
  //     console.log('respondent: ', this.respondent);
  //   }, 500);
  // }

  // IdTags() {
  //   var elem = document.getElementsByClassName('tags-list-item');
  //   for (var i = 0; i < elem.length; i++) {
  //     var child_img = elem[i].getElementsByTagName('img');
  //     child_img[0].setAttribute('id', 'remtag' + String(i));
  //   }
  // }

  // removeTag(event: any) {
  //   var id = event.target.attributes.id.value;
  //   var idx = Number(id.charAt(id.length - 1));
  //   this.tags_list.splice(idx, 1);
  //   if (this.tags_list.length == 0) this.view_tags = false;
  //   else this.IdTags();
  //   this.no_of_tags = this.no_of_tags - 1;
  // }

  select_in() {
    this.selectedCountry = this.country_options[0];
    this.courts = this.court_list;

    this.court_options = this.court_items;

    this.courtdata = this.court_id_names;
    // this.ngOnInit();
    this.selectedCourts = this.court_options;
    this.courtlevel = this.courtdata[0];
    this.court = this.courtdata[0].name;
    this.courtForm = this.fb.group({
      city: [this.selectedCourts],
    });
    console.log(this.selectedCourts);
  }

  select_sg() {
    // console.log("singapore selected");
    this.selectedCountry = this.country_options[1];
    this.courts = ['Supreme Court Singapore'];

    this.court_options = [
      {
        item_id: 1,
        item_text: 'Supreme Court Singapore',
        item_name: 'Supreme Court Singapore',
      },
    ];

    this.courtdata = [
      { id: 'Supreme Court Singapore', name: 'Supreme Court Singapore' },
    ];

    // this.ngOnInit();
    this.selectedCourts = this.court_options;
    this.courtlevel = this.courtdata[0];
    this.court = this.courtdata[0].name;
    this.courtForm = this.fb.group({
      city: [this.selectedCourts],
    });
    console.log(this.selectedCourts);
  }

  service_down = false;
  service_unavailable() {
    this.service_down = true;
  }

  queryChange(val:string){
    // console.log(this.query);
    // console.log(val);
      this.caseService.getAutocomplete(val).subscribe((data:any)=>{
      // console.log(data.result);
      this.autocomplete_suggestions = data.result;
    });
  }
}
