import { Component, Input, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Case from '../models/case';
import { CaseService } from './case.service';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { DataService } from './case.service';
import { Observable } from 'rxjs';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular'
import HC_heatmap from 'highcharts/modules/heatmap';
HC_heatmap(Highcharts);



@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.css'],
})
export class CasesComponent implements OnInit {
  Highcharts = Highcharts;
  pvbChartOptions: Highcharts.Options = {};
  rvbChartOptions: Highcharts.Options = {};
  pvb_Bench: any = [ "Sun", "Mon", "Tue", "Wed","Thu", "Fri", "Sat",];
  rvb_Bench: any = [];
  pvb_Counsel: any = ["Sun", "Mon", "Tue", "Wed","Thu", "Fri", "Sat",];
  rvb_Counsel: any = [];
  pvb_data: any = [];
  rvb_data: any = [];

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
      }
      },
      colorAxis: {
        maxColor: "#FFA1B5",
        minColor: "#FFFFFF",
      },
      xAxis: {
        title: {
          text: "Bench",
        },
        categories: this.pvb_Bench,
      },
      yAxis: {
        title: {
          text: "Petitoner Counsel",
        },
        categories: this.pvb_Counsel,
      },
      legend: {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        y: 25,
        symbolHeight: 200
      },
      tooltip: {
        formatter: function () {
          return '<b>' + this.series.yAxis.categories[this.point.y!] + '</b> represented <br><b>' +
            this.point.value + '</b> appellants in front of <br><b>' + this.series.xAxis.categories[this.point.x] + '</b>';
        },
        enabled: true
      },
      credits: {
        enabled: false
      },
      series: [{
        name: "Petitioner Counsel against Benches",
        type: "heatmap",
        borderColor: "#FFFFFF",
        borderWidth: 4,
        data: this.pvb_data,
      //   dataLabels: {
      //     enabled: true,
      //     color: '#000000'
      // }
      }],
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
      }
      },
      colorAxis: {
        maxColor: "#86C7F3",
        minColor: "#FFFFFF",
      },
      xAxis: {
        title: {
          text: "Bench",
        },
        categories: this.rvb_Bench,
      },
      yAxis: {
        title: {
          text: "Respondent Counsel",
        },
        categories: this.rvb_Counsel,
      },
      legend: {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        y: 25,
        symbolHeight: 200
      },
      tooltip: {
        formatter: function () {
          return '<b>' + this.series.yAxis.categories[this.point.y!] + '</b> represented <br><b>' +
            this.point.value + '</b> respondents in front of <br><b>' + this.series.xAxis.categories[this.point.x] + '</b>';
        },
        enabled: true
      },
      credits: {
        enabled: false
      },
      series: [{
        name: "Respondent Counsel against Benches",
        type: "heatmap",
        borderColor: "#FFFFFF",
        borderWidth: 4,
        data: this.rvb_data,
      //   dataLabels: {
      //     enabled: true,
      //     color: '#000000'
      // }
      }],
    };
  }

  public doughnutChartOptions: ChartOptions = {
    title: {
      text: 'Judgement distribution',
      display: true,
    },
    responsive: true,
  }
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
        },
      ],
      yAxes: [
        {
          ticks: {
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
        },
      ],
      yAxes: [
        {
          ticks: {
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

  myForm: any;
  disabled = false;
  ShowFilter = false;
  limitSelection = false;
  searched: boolean = false;
  view_search: boolean = false;
  judgement_options: any = [];
  selectedJudgements: any = [];
  dropdownSettings: any = {};
  rows: Case[] = [];
  cited_cases: any = [];
  query: string = '';
  results_count: number = 0;
  arrayOne: Array<number> = [];
  page: number = 1;
  limit: number = 5;
  judge: string = '';
  court: string = '';
  year: number = 2020;
  judgement: Array<string> = [
    'allowed',
    'dismissed',
    'tied / unclear',
    'partly allowed',
    'partly dismissed',
  ];
  bench: string = '';
  petitioner: string = '';
  respondent: string = '';
  petitioner_counsel: string = '';
  respondent_counsel: string = '';
  courtlevel: any;
  defaultcourt: any;
  loading: boolean = false;

  courtdata: any = [
    { id: 'Supreme Court of India', name: 'Supreme Court of India' },
    { id: 'California Court of Appeal', name: 'California Court of Appeal' },
    { id: 'New York Court of Appeals', name: 'New York Court of Appeals' },
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
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Number of cases',
          },
          // stacked: true
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

  constructor(private caseService: CaseService, private fb: FormBuilder) {}

  ngOnInit() {
    this.pvb_init();
    this.rvb_init();
    this.courtlevel = this.courtdata[0];
    this.court = this.courtdata[0].name;
    this.judgement_options = [
      { item_id: 1, item_text: 'allowed' },
      { item_id: 2, item_text: 'dismissed' },
      { item_id: 3, item_text: 'tied / unclear' },
      { item_id: 4, item_text: 'partly allowed' },
      { item_id: 5, item_text: 'partly dismissed' },
    ];
    this.selectedJudgements = this.judgement_options;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: this.ShowFilter,
    };
    this.myForm = this.fb.group({
      city: [this.selectedJudgements],
    });
  }

  onItemSelect(item: any) {
    // console.log('onItemSelect', this.selectedJudgements);
  }

  onSelectAll(items: any) {
    // console.log('onSelectAll', this.selectedJudgements);
  }

  toogleShowFilter() {
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
  }

  search_by_object_id() {
    this.caseService.getSpecificCase(this.query).subscribe((data: any) => {
      this.rows = data.case_list;
    });
    this.rows = [];
  }

  first_search() {
    this.page = 1;
    this.search();
  }

  show_analytics() {
    this.view_search = false;
    let element = document.getElementById('analytics_tab');
    element!.className = 'tab active';
    let element2 = document.getElementById('search_tab');
    element2!.className = 'tab';
    // console.log('view_search ' + this.view_search);
  }

  show_search() {
    this.view_search = true;
    let element = document.getElementById('search_tab');
    element!.className = 'tab active';
    let element2 = document.getElementById('analytics_tab');
    element2!.className = 'tab';
    // console.log('view_search ' + this.view_search);
  }

  search() {
    this.view_search = false;
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

    this.caseService
      .getSearchedCases(
        this.query,
        this.court,
        this.judgement,
        this.bench,
        this.petitioner,
        this.respondent,
        this.page,
        this.limit
      )
      .subscribe((data: any) => {
        // console.log(data.case_list);

        this.rows = data.case_list;
        this.results_count = data.result_count;
      });

    this.caseService
      .getLineCharts(
        this.query,
        this.court,
        this.judgement,
        this.bench,
        this.petitioner,
        this.respondent
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
        } catch (error) {
          console.log(error);
        }
      });

    this.caseService
      .getPieCharts(
        this.query,
        this.court,
        this.judgement,
        this.bench,
        this.petitioner,
        this.respondent
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
          console.log(error);
        }

        this.doughnutChartData = arr;
      });

    this.caseService
      .getPetitionerChart(
        this.query,
        this.court,
        this.bench,
        this.petitioner,
        this.respondent
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
                  this.petitionerChartData[k].data![j] = this.petitionerChartData[k].data![j - 1];
                  this.petitionerChartData[k].data![j - 1] = temp;
                }
                var temp2 = this.petitionerChartLabels[j];
                this.petitionerChartLabels[j] = this.petitionerChartLabels[j-1];
                this.petitionerChartLabels[j - 1] = temp2;
                var temp3;
                temp3 = sums[j];
                sums[j] = sums[j-1];
                sums[j-1] = temp3;
              }
            }
          }
          for (var i = 0; i < this.petitionerChartData.length; i++) {
            this.petitionerChartData[i].data = this.petitionerChartData[i]?.data?.slice(0, this.petitionerChartLimit);
          }
          this.petitionerChartLabels = this.petitionerChartLabels.slice(0,this.petitionerChartLimit);
          // console.log(this.petitionerChartData); 
        // console.log(this.petitionerChartLabels);
        } catch (error) {
          console.log(error);
        }
      });

    this.caseService
      .getRespondentChart(
        this.query,
        this.court,
        this.bench,
        this.petitioner,
        this.respondent
      )
      .subscribe((data: any) => {
        console.log(data);
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
          console.log(this.respondentChartLabels);
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
                  this.respondentChartData[k].data![j] = this.respondentChartData[k].data![j - 1];
                  this.respondentChartData[k].data![j - 1] = temp;
                }
                var temp2 = this.respondentChartLabels[j];
                this.respondentChartLabels[j] = this.respondentChartLabels[j-1];
                this.respondentChartLabels[j - 1] = temp2;
                var temp3;
                temp3 = sums[j];
                sums[j] = sums[j-1];
                sums[j-1] = temp3;
              }
            }
          }
          for (var i = 0; i < this.respondentChartData.length; i++) {
            this.respondentChartData[i].data = this.respondentChartData[i]?.data?.slice(0, this.respondentChartLimit);
          }
          this.respondentChartLabels = this.respondentChartLabels.slice(0,this.respondentChartLimit);
          console.log(this.respondentChartLabels);
        } catch (error) {
          console.log(error);
        }

      });

    this.caseService
      .getPtn_v_BenchChart(
        this.query,
        this.court,
        this.bench,
        this.petitioner,
        this.respondent
      )
      .subscribe((data: any) => {
        try {
          this.pvb_Bench=[];
          this.pvb_Counsel=[];
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
              for(var k = 0;k < data.length; k++){
                if(data[k].x === this.pvb_Bench[i]&&data[k].y === this.pvb_Counsel[j])
                {temp = data[k].color; console.log(temp); break;}
              }
              this.pvb_data.push({x: i, y: j, value: temp, id:'p' + i +':' + j})
            }
          }
          // console.log(this.pvb_data);
          this.pvb_init();
          
        } catch (error) {
          console.log(error);
        }
      })

    this.caseService
      .getRsp_v_BenchChart(
        this.query,
        this.court,
        this.bench,
        this.petitioner,
        this.respondent
      )
      .subscribe((data: any) => {
        try {
          // console.log(data);
          this.rvb_Bench=[];
          this.rvb_Counsel=[];
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
              for(var k = 0;k < data.length; k++){
                if(data[k].x === this.rvb_Bench[i]&&data[k].y === this.rvb_Counsel[j])
                {temp = data[k].color; console.log(temp); break;}
              }
              this.rvb_data.push({x: i, y: j, value: temp, id:'p' + i +':' + j})
            }
          }
          // console.log(this.rvb_data);
          this.rvb_init();
          this.loading = false;
          this.searched = true;
        } catch (error) {
          console.log(error);
        }
      })

    this.caseService
      .getCitedCases(
        this.query,
        this.court,
        this.judgement,
        this.bench,
        this.petitioner,
        this.respondent
      )
      .subscribe((data: any) => {
        try {
          this.cited_cases = data;
          console.log(this.cited_cases);
        } catch (error) {
          console.log(error);
        }
      });

    this.createArray(this.results_count);
  }

  reset() {
    this.searched = false;
    this.view_search = false;
    this.query = '';
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
    this.pvb_Bench=[];
    this.pvb_Counsel=[];
    this.pvb_data=[];
    this.rvb_Bench=[];
    this.rvb_Counsel=[];
    this.rvb_data=[];
    this.chartLabels = [1990, 2000, 2010, 2020];
    this.doughnutChartData = [[350, 450, 100]];
    this.doughnutChartLabels = ['allowed', 'dismissed', 'tied / unclear'];
    this.selectedJudgements = this.judgement_options;
  }

  sendNextPage() {
    this.page = this.page + 1;
    
    this.search();
    this.view_search = true;
  }

  sendPreviousPage() {
    this.page = this.page - 1;
     
    this.search();
    this.view_search = true; 
  }

  createArray(count: number) {
    this.arrayOne = new Array<number>(count);
  }

  
}
