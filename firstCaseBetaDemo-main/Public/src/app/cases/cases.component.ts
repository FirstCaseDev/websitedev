import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import Case from '../models/case';
import { CaseService } from './case.service';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label, ThemeService } from 'ng2-charts';
import * as Highcharts from 'highcharts';
import HC_heatmap from 'highcharts/modules/heatmap';
import { Title } from '@angular/platform-browser';
import { GoogleAnalyticsService } from '../google-analytics.service';
import { COMMA, ENTER, UP_ARROW, DOWN_ARROW } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { SwiperOptions } from 'swiper';
import { stringify } from '@angular/compiler/src/util';

declare let Chart: any;
HC_heatmap(Highcharts);

@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: [
    './cases.component.css',
    '../../assets/css/bootstrap/bootstrap.css',
  ],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class CasesComponent implements OnInit {
  public barChartOptions: ChartOptions = {
    defaultColor: '#b6d7a8ff',
    responsive: true,
    scales: {
      xAxes: [
        {
          ticks: {
            min: 0,
          },
        },
      ],
      yAxes: [{ ticks: { mirror: true } }],
    },
  };
  public barChartLabels: Label[] = [
    '2006',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012',
  ];
  public barChartType: ChartType = 'horizontalBar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartDataSets[] = [
    {
      data: [65, 59, 80, 81, 56, 55, 40],
      label: 'Cases for your query',
      backgroundColor: 'rgba(182, 215, 168, 0.3)',
      hoverBackgroundColor: 'rgba(182, 215, 168, 0.74)',
      order: -1,
    },
  ];
  constructor(
    private caseService: CaseService,
    private fb: FormBuilder,
    private componentTitle: Title
  ) {
    Chart.elements.Rectangle.prototype.draw = function () {
      var ctx = this._chart.ctx;
      var vm = this._view;
      var left, right, top, bottom, signX, signY, borderSkipped, radius;
      var borderWidth = vm.borderWidth;

      // Set Radius Here
      // If radius is large enough to cause drawing errors a max radius is imposed
      var cornerRadius = 10;

      left = vm.base;
      right = vm.x;
      top = vm.y - vm.height / 2;
      bottom = vm.y + vm.height / 2;
      signX = right > left ? 1 : -1;
      signY = 1;
      borderSkipped = vm.borderSkipped || 'left';

      // Canvas doesn't allow us to stroke inside the width so we can
      // adjust the sizes to fit if we're setting a stroke on the line
      if (borderWidth) {
        // borderWidth shold be less than bar width and bar height.
        var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
        borderWidth = borderWidth > barSize ? barSize : borderWidth;
        var halfStroke = borderWidth / 2;
        // Adjust borderWidth when bar top position is near vm.base(zero).
        var borderLeft =
          left + (borderSkipped !== 'left' ? halfStroke * signX : 0);
        var borderRight =
          right + (borderSkipped !== 'right' ? -halfStroke * signX : 0);
        var borderTop =
          top + (borderSkipped !== 'top' ? halfStroke * signY : 0);
        var borderBottom =
          bottom + (borderSkipped !== 'bottom' ? -halfStroke * signY : 0);
        // not become a vertical line?
        if (borderLeft !== borderRight) {
          top = borderTop;
          bottom = borderBottom;
        }
        // not become a horizontal line?
        if (borderTop !== borderBottom) {
          left = borderLeft;
          right = borderRight;
        }
      }

      ctx.beginPath();
      ctx.fillStyle = vm.backgroundColor;
      ctx.strokeStyle = vm.borderColor;
      ctx.lineWidth = borderWidth;

      // Corner points, from bottom-left to bottom-right clockwise
      // | 1 2 |
      // | 0 3 |
      var corners = [
        [left, bottom],
        [left, top],
        [right, top],
        [right, bottom],
      ];

      // Find first (starting) corner with fallback to 'bottom'
      var borders = ['bottom', 'left', 'top', 'right'];
      var startCorner = borders.indexOf(borderSkipped, 0);
      if (startCorner === -1) {
        startCorner = 0;
      }

      function cornerAt(index: any) {
        return corners[(startCorner + index) % 4];
      }

      // Draw rectangle from 'startCorner'
      var corner = cornerAt(0);
      var width, height, x, y, nextCorner, nextCornerId;
      var x_tl, x_tr, y_tl, y_tr;
      var x_bl, x_br, y_bl, y_br;
      ctx.moveTo(corner[0], corner[1]);

      for (var i = 1; i < 4; i++) {
        corner = cornerAt(i);
        nextCornerId = i + 1;
        if (nextCornerId == 4) {
          nextCornerId = 0;
        }

        nextCorner = cornerAt(nextCornerId);

        width = corners[2][0] - corners[1][0];
        height = corners[0][1] - corners[1][1];
        x = corners[1][0];
        y = corners[1][1];
        radius = cornerRadius;

        // Fix radius being too large
        if (radius > Math.abs(height) / 2) {
          radius = Math.floor(Math.abs(height) / 2);
        }
        if (radius > Math.abs(width) / 2) {
          radius = Math.floor(Math.abs(width) / 2);
        }
        ctx.moveTo(x, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(
          x + width,
          y + height,
          x + width - radius,
          y + height
        );
        ctx.lineTo(x, y + height);
      }
      ctx.fill();
      if (borderWidth) {
        ctx.stroke();
      }
    };
  }

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
              break;

            case 'petitionerName':
              last_tag?.classList.add('petitionerName');
              this.petitioner = this.petitioner.concat(value, ',');
              break;

            case 'petitionerCounsel':
              last_tag?.classList.add('petitionerCounsel');
              break;

            case 'respondentName':
              last_tag?.classList.add('respondentName');
              this.respondent = this.respondent.concat(value, ',');
              break;

            case 'respondentCounsel':
              last_tag?.classList.add('respondentCounsel');
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
  related_searches: any = [];
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
  autocomplete_suggestions: any = [];
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
        },
      ],
    };
  }

  rvb_init() {
    this.rvbChartOptions = {
      chart: {
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
                return value.substr(0, 20) + '...';
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
                return value.substr(0, 20) + '...';
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
  court_indexes: any = [];
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
    this.date_floor = {
      year: 1900,
      month: 1,
      day: 1,
    };

    this.date_ceil = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    };

    this.myForm = this.fb.group({
      city: [this.selectedJudgements],
    });
  }

  onItemSelect(item: any) {}
  OnItemDeSelect(item: any) {}
  onSelectAll(items: any) {}
  onDeSelectAll(items: any) {}

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
    this.view_focussed = false;

    this.search();
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
    let element = document.getElementById('analytics_tab');
    element!.className = 'tab active';
    let element2 = document.getElementById('search_tab');
    element2!.className = 'tab';
    let element3 = document.getElementById('citation_tab');
    element3!.className = 'tab';
    this.loading = false;
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
    this.loading = false;
  }

  toggle_filters() {
    this.view_tags = !this.view_tags;
    this.view_tags_mobile = !this.view_tags_mobile;
  }

  reset_filters() {
    this.bench = '';
    this.tags_list = [];
    this.tagType = this.tagCategory[0];
    this.no_of_tags = 0;
    this.sortBy = this.sort_options[0];
    this.petitioner = '';
    this.respondent = '';
    this.petitioner_counsel = '';
    this.respondent_counsel = '';
  }

  reset_on_search_change() {
    this.CitedActNames = [];
    this.CitedProvisions = [];
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
    this.judgement = [];
    this.selectedJudgements.map((item: any) => {
      this.judgement.push(item.item_text);
    });
    this.courts = [];
    for (var i = 0; i < this.selectedCourts.length; i++) {
      this.courts.push(this.selectedCourts[i].item_name);
    }

    this.court_indexes = [];
    for (var i = 0; i < this.courts.length; i++) {
      for (var j = 0; j < this.court_options.length; j++) {
        if (this.courts[i] === this.court_options[j].item_name) {
          this.court_indexes.push(this.court_options[j].item_id);
        }
      }
    }
    this.courts = this.court_indexes;

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
        this.date_ceil.year,
        this.selectedCountry.name
      )
      .subscribe((data: any) => {
        if (data.success) {
          this.rows = data.case_list;
          this.results_time = data.result_time;
          this.results_count = data.result_count;
          this.related_searches = data.related_searches;
          console.log(data.court_analytics);
          this.barChartData[0].data = [];
          this.barChartLabels = [];
          for (var i = 0; i < data.court_analytics.length; i++) {
            this.barChartLabels.push(data.court_analytics[i].key);
            // console.log(this.barChartData);
            this.barChartData[0].data?.push(data.court_analytics[i].doc_count);
          }
          console.log(this.barChartData);
        } else {
          alert(data.msg);
          this.reset();
          this.reset_filters();
        }
        this.loading = false;
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
        this.date_ceil.year,
        this.selectedCountry.name
      )
      .subscribe((data: any) => {
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
        } catch (error) {}
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
        this.date_ceil.year,
        this.selectedCountry.name
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
        } catch (error) {}

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
        this.date_ceil.year,
        this.selectedCountry.name
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
        } catch (error) {}
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
        this.date_ceil.year,
        this.selectedCountry.name
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
        } catch (error) {}
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
        this.date_ceil.year,
        this.selectedCountry.name
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
          this.pvb_data = [];
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
          this.pvb_init();
        } catch (error) {}
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
        this.date_ceil.year,
        this.selectedCountry.name
      )
      .subscribe((data: any) => {
        try {
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
          this.rvb_data = [];
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
          this.rvb_init();
          this.loading = false;
        } catch (error) {}
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
        this.date_ceil.year,
        this.selectedCountry.name
      )
      .subscribe((data: any) => {
        try {
          this.cited_cases = data;
          this.loading = false;
          this.getCitedCaseURLs();
        } catch (error) {}
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
      } catch (error) {
        console.log(error);
      }
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
        this.date_ceil.year,
        this.selectedCountry.name
      )
      .subscribe((data: any) => {
        try {
          this.CitedProvisions = data;
        } catch (error) {}
      });
  }

  getCitedLaws() {
    this.caseService
      .getCitedLaws(
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

  add_tag: string = '';
  no_of_tags = 0;

  select_in() {
    this.selectedCountry = this.country_options[0];
    this.courts = this.court_list;

    this.court_options = this.court_items;

    this.courtdata = this.court_id_names;
    this.selectedCourts = this.court_options;
    this.courtlevel = this.courtdata[0];
    this.court = this.courtdata[0].name;
    this.courtForm = this.fb.group({
      city: [this.selectedCourts],
    });
  }

  select_sg() {
    this.selectedCountry = this.country_options[1];
    this.courts = ['Supreme Court Singapore'];

    this.court_options = [
      {
        item_id: 0,
        item_text: 'Supreme Court Singapore',
        item_name: 'Supreme Court Singapore',
      },
    ];

    this.courtdata = [
      { id: 'Supreme Court Singapore', name: 'Supreme Court Singapore' },
    ];

    this.selectedCourts = this.court_options;
    this.courtlevel = this.courtdata[0];
    this.court = this.courtdata[0].name;
    this.courtForm = this.fb.group({
      city: [this.selectedCourts],
    });
  }

  service_down = false;
  service_unavailable() {
    this.service_down = true;
  }

  // ======================== Autocomplete functions ========================

  autoComplete_list: string[] = [];

  queryChange(val: string) {
    if (val.length === 0) {
      this.autocomplete_suggestions = [];
    } else {
      this.caseService.getAutocomplete(val).subscribe((data: any) => {
        this.autocomplete_suggestions = data.result;
        if (val.indexOf('"') != -1) {
          console.log('double quotes present');
          this.autoComplete_list = [];
          for (let i = 0; i < this.autocomplete_suggestions.length; i++) {
            var text = this.autocomplete_suggestions[i].text;
            if (text.indexOf('"') == -1) {
              this.autoComplete_list.push('"' + text);
            } else {
              this.autoComplete_list.push(text);
            }
          }
        } else {
          console.log('NO double quotes');
          this.autoComplete_list = [];
          for (let i = 0; i < this.autocomplete_suggestions.length; i++) {
            var text = this.autocomplete_suggestions[i].text;
            this.autoComplete_list.push(text);
          }
        }
      });
    }
  }

  // autoComplete_list = document.getElementsByClassName('autoComplete_items');

  // getIndex(value: any) {
  //   for (let i = 0; i < this.autoComplete_list.length; i++) {
  //     const element = this.autoComplete_list[i];
  //     if (element.textContent === value) return i;
  //   }
  //   return -1;
  // }

  // setActive(idx: number) {
  //   this.autoComplete_list[idx].classList.add('autoComplete_active');
  // }

  // unsetActive(idx: number) {
  //   this.autoComplete_list[idx].classList.remove('autoComplete_active');
  // }

  key_press(event: any) {
    // var length = this.autoComplete_list.length;
    // var autoComplete_active = document.getElementsByClassName(
    //   'autoComplete_active'
    // )[0];
    // console.log(autoComplete_active);
    // var active_idx = 0 || this.getIndex(autoComplete_active?.textContent);

    // if (event.which == 38) {
    //   if (active_idx != length - 1) {
    //     this.unsetActive(active_idx);
    //     active_idx = active_idx - 1;
    //     this.setActive(active_idx);
    //   }
    // }
    // if (event.which == 40) {
    //   if (active_idx != length - 1) {
    //     this.unsetActive(active_idx);
    //     active_idx = active_idx + 1;
    //     this.setActive(active_idx);
    //   }
    // }
    if (event.which == ENTER) {
      this.first_search();
    }
  }

  view_focussed = true;

  onClick(event: any) {
    var focussed = document.getElementById('search-box');
    if (focussed == document.activeElement) {
      this.view_focussed = true;
    } else {
      this.view_focussed = false;
    }
  }

  autoComplete(event: any) {
    this.query = event.path[0].outerText;
    this.autocomplete_suggestions = [];
  }

  tag_click(event: any) {
    console.log(event.target.innerHTML);
    this.query = event.target.innerHTML;
    this.search();
  }
}
