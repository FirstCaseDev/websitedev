import { Component, Input, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Case from '../models/case';
import { CaseService } from './case.service';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts'; 
import { DataService } from './case.service';
import { Observable } from 'rxjs';
// import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
  
@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.css'],
})
export class CasesComponent implements OnInit {
  public petitionerChartOptions: ChartOptions = {
    title: {
      text: 'Petitioner Counsel Stats',
      display: true
    },
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{scaleLabel: {
      display: true,
      labelString: 'Number of cases'
   }}], yAxes: [{ ticks: {
      callback: function(value: any) {
        if (value.length > 20) {
          return value.substr(0, 20) + '...'; //truncate
        } else {
          return value
        }
      },
    }}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public petitionerChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public petitionerChartType: ChartType = 'horizontalBar';
  public petitionerChartLegend = true;
  public petitionerChartLimit = 20;
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
      display: true
    },
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'Number of cases'
     }}], yAxes: [{ticks: {
      callback: function(value:any) {
        if (value.length > 20) {
          return value.substr(0, 20) + '...'; //truncate
        } else {
          return value
        }

      },
    }
  }] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public respondentChartLabels: Label[] = ['2005', '2007', '2008', '2009', '2010', '2011', '2012'];
  public respondentChartType: ChartType = 'horizontalBar';
  public respondentChartLegend = true;
  public respondentChartLimit = 20;
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
  judgement_options: any = [];
  selectedJudgements: any = [];
  dropdownSettings: any = {};
  rows: Case[] = [];
  query: string = '';
  results_count: number = 0;
  arrayOne: Array<number> = [];
  page: number = 1;
  limit: number = 5;
  judge: string = '';
  court: string = '';
  year: number = 2020;
  judgement: Array<string> = ["allowed", "dismissed", "tied / unclear", "partly allowed", "partly dismissed"];
  bench: string = '';
  petitioner: string = '';
  respondent: string = '';
  petitioner_counsel: string = '';
  respondent_counsel: string = '';
  courtlevel: any;
  defaultcourt: any;
  loading: boolean = false;
  courtdata: any = [
    { id: "Supreme Court of India", name: "Supreme Court of India" },
    { id: "California Court of Appeal", name: "California Court of Appeal" },
    { id: "New York Court of Appeals", name: "New York Court of Appeals" }
  ];
  chartOptions: ChartOptions = {
    title: {
      text: 'Judgement trend over years',
      display: true
    },
    responsive: true,
    scales: { xAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'Year'
     }}], yAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'Number of cases'
     }
     }] }
  };
  chartData: any = [
    { data: [], label: '', stack: 'a' },
    { data: [], label: '', stack: 'a' },
    { data: [], label: '', stack: 'a' },
    { data: [], label: '', stack: 'a' },
    { data: [], label: '', stack: 'a' }
  ];
  chartLabels: any = [1990, 2000, 2010, 2020];

  public doughnutChartData = [
    [350, 450, 100]
  ];
  public doughnutChartLabels = ['allowed', 'dismissed', 'tied / unclear'];
  public doughnutChartType: ChartType = 'doughnut';
  Datalabels: any = [];
  petitionerDatalabels: any = [];
  respondentDatalabels: any = [];
  

  constructor(private caseService: CaseService, private fb: FormBuilder) { }


  ngOnInit() {
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
      allowSearchFilter: this.ShowFilter
    };
    this.myForm = this.fb.group({
      city: [this.selectedJudgements]
    });
    
  }

  onItemSelect(item: any) {
    console.log('onItemSelect', this.selectedJudgements);
  }
  onSelectAll(items: any) {
    console.log('onSelectAll', this.selectedJudgements);
  }

  toogleShowFilter() {
    this.ShowFilter = !this.ShowFilter;
    this.dropdownSettings = Object.assign({}, this.dropdownSettings, { allowSearchFilter: this.ShowFilter });
  }

  handleLimitSelection() {
    if (this.limitSelection) {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: 2 });
    } else {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: null });
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

  search() {
    this.searched = true;
    if (this.query.length == 0) {
      this.query = [this.bench, this.petitioner, this.respondent].join(" ");
      if (this.query.length == 2) { this.query = ''; return; }
    }
    this.loading = true;
    this.judgement = [];
    this.selectedJudgements.map((item :any) => {
      this.judgement.push(item.item_text);
    })

    this.caseService
      .getSearchedCases(this.query, this.court, this.judgement, this.bench, this.petitioner, this.respondent, this.page, this.limit)
      .subscribe((data: any) => {
        console.log(data.case_list);
        
        this.rows = data.case_list;
        this.results_count = data.result_count;
        
      });

    this.caseService
      .getLineCharts(this.query, this.court, this.judgement, this.bench, this.petitioner, this.respondent)
      .subscribe((data: any) => {
        this.chartLabels.length = 0;
        this.Datalabels.length = 0;
        try {
          data.map((item :any) => {
            if (!this.chartLabels.includes(item.x)) { this.chartLabels.push(item.x); }
            if (!this.Datalabels.includes(item.color)) { this.Datalabels.push(item.color); }
          })
          this.chartData = [
            { data: [], label: '', stack: 'a' },
            { data: [], label: '', stack: 'a' },
            { data: [], label: '', stack: 'a' },
            { data: [], label: '', stack: 'a' },
            { data: [], label: '', stack: 'a' }
          ];
          for (var i = 0; i < this.Datalabels.length; i++) {
            var arr = [];
            for (var j = 0; j < this.chartLabels.length; j++) {
              var found = false;
              for (var k = 0; k < data.length; k++) {
                if ((data[k].color === this.Datalabels[i]) && (data[k].x === this.chartLabels[j])) { arr.push(data[k].y); found = true; }
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
      .getPieCharts(this.query, this.court, this.judgement, this.bench, this.petitioner, this.respondent)
      .subscribe((data: any) => {
        var arr: any = [];
        try {
          this.doughnutChartData.length = 0;
          this.doughnutChartLabels.length = 0;
          data.map((item: any) => {
            if (!this.doughnutChartLabels.includes(item.label)) { this.doughnutChartLabels.push(item.label); }
            arr.push(item.value);
          })
        } catch (error) {
          console.log(error);
        }
        
        this.doughnutChartData = arr;
        
      });

    this.caseService
      .getPetitionerChart(this.query, this.court, this.bench, this.petitioner, this.respondent)
      .subscribe((data: any) => {
        this.petitionerChartLabels.length = 0;
        this.petitionerDatalabels.length = 0;
        try {
          data.map((item: any)=>{
            if(item.group.length<=3) data.pop(item);
          })
          data.map((item: any) => {
            if (!this.petitionerChartLabels.includes(item.group)) { this.petitionerChartLabels.push(item.group); }
            if (!this.petitionerDatalabels.includes(item.dynamicColumns)) { this.petitionerDatalabels.push(item.dynamicColumns); }
          })
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
                if ((data[k].dynamicColumns === this.petitionerDatalabels[i]) && (data[k].group === this.petitionerChartLabels[j])) { arr.push(data[k].value); found = true; }
              }
              if (found === false) arr.push(0);
            }
            this.petitionerChartData[i].data = arr;
            this.petitionerChartData[i].label = this.petitionerDatalabels[i];
            this.petitionerChartData[i].stack = 'a';
          }
          
          var sums = [];
          for(var i=0;i<this.petitionerChartLabels.length;i++){
            var sum:any =0;
            for(var j=0;j<this.petitionerDatalabels.length;j++){
              sum = sum + this.petitionerChartData[j].data![i];
            }
            sums[i]=sum;
          }
          console.log(this.petitionerChartData);
          console.log(sums);
          var n = this.petitionerChartLabels.length;
          for(var i=n;i>=0;i--)
          {
            for(var j=n;j>n-i;j--)
            {
              if(sums[j]>sums[j-1]){
                for(var k=0;k<this.petitionerDatalabels.length;k++){
                  var temp = this.petitionerChartData[k].data![j];
                  this.petitionerChartData[k].data![j] = this.petitionerChartData[k].data![j-1];
                  this.petitionerChartData[k].data![j-1] = temp;   
                  // [this.petitionerChartData[k].data[j],this.petitionerChartData[k].data[j-1]] = [this.petitionerChartData[k].data[j-1],this.petitionerChartData[k].data[j]];
                } 
                var temp2 = this.petitionerChartLabels[j];
                this.petitionerChartLabels[j] = this.petitionerChartLabels[j-1];
                this.petitionerChartLabels[j-1] = temp2;
                // [this.petitionerChartLabels[j],this.petitionerChartLabels[j-1]]=[this.petitionerChartLabels[j-1],this.petitionerChartLabels[j]];
              }
            }
          }
          for(var i=0;i<this.petitionerChartLabels.length;i++){
            var sum:any=0;
            for(var j=0;j<this.petitionerDatalabels.length;j++){
              sum = sum + this.petitionerChartData[j]!.data![i];
            }
            sums[i]=sum;
          }
          console.log(sums);
          for(var i =0; i<this.petitionerChartData.length; i++)
          {
            this.petitionerChartData[i].data = this.petitionerChartData[i]?.data?.slice(0,this.petitionerChartLimit);
          }
          this.petitionerChartLabels = this.petitionerChartLabels.slice(0,this.petitionerChartLimit);
          console.log(this.petitionerChartData);
        } catch (error) {
          console.log(error);
        }
      });  

    this.caseService
    .getRespondentChart(this.query, this.court, this.bench, this.petitioner, this.respondent)
    .subscribe((data: any) => {
      console.log(data);
      this.respondentChartLabels.length = 0;
      this.respondentDatalabels.length = 0;
      try {
        data.map((item: any)=>{
          if(item.group.length<=3) data.pop(item);
        })
        data.map((item: any) => {
          if (!this.respondentChartLabels.includes(item.group)) { this.respondentChartLabels.push(item.group); }
          if (!this.respondentDatalabels.includes(item.dynamicColumns)) { this.respondentDatalabels.push(item.dynamicColumns); }
        })
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
              if ((data[k].dynamicColumns === this.respondentDatalabels[i]) && (data[k].group === this.respondentChartLabels[j])) { arr.push(data[k].value); found = true; }
            }
            if (found === false) arr.push(0);
          }
          this.respondentChartData[i].data = arr;
          this.respondentChartData[i].label = this.respondentDatalabels[i];
          this.respondentChartData[i].stack = 'a';
        }
        for(var i =0; i<this.respondentChartData.length; i++)
          {
            this.respondentChartData[i].data = this.respondentChartData[i]?.data?.slice(0,this.respondentChartLimit);
          }
          this.respondentChartLabels = this.respondentChartLabels.slice(0,this.respondentChartLimit);
        console.log(this.respondentChartData);
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    });    
    
    this.createArray(this.results_count);
  }

  reset() {
    this.searched = false;
    this.query = '';
    this.bench = '';
    this.petitioner = '';
    this.respondent = '';
    this.rows.length = 0;
    this.results_count =0;
    this.chartData = [
      { data: [], label: '', stack: 'a' },
      { data: [], label: '', stack: 'a' },
      { data: [], label: '', stack: 'a' },
      { data: [], label: '', stack: 'a' },
      { data: [], label: '', stack: 'a' }
    ];
    this.chartLabels = [1990, 2000, 2010, 2020];
    this.doughnutChartData = [
      [350, 450, 100]
    ];
    this.doughnutChartLabels = ['allowed', 'dismissed', 'tied / unclear'];
    this.selectedJudgements = this.judgement_options;
  }

  sendNextPage() {
    this.page = this.page + 1;
    this.search();
  }

  sendPreviousPage() {
    this.page = this.page - 1;
    this.search();
  }

  createArray(count: number) {
    this.arrayOne = new Array<number>(count);
  }

}


