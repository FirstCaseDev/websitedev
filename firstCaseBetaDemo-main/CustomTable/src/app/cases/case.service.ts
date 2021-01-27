import { Injectable } from '@angular/core';

import { WebService } from '../web.service';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CaseService {
  constructor(private webService: WebService) {}

  getCases() {
    return this.webService.get('cases');
  }
  getSpecificCase(object_id: string) {
    return this.webService.get(`cases/_id=${object_id}`);
  }
  getSearchedCases(query: string , court:string, judgement:Array<string>, bench: string, petitioner: string, respondent: string, page: number, limit: number) {
    return this.webService.get(
      `cases/query=${query}?&court=${court}&judgement=${judgement}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}&page=${page}&limit=${limit}`  
    );
  }
  getLineCharts(query:string, court:string, judgement:Array<string>, bench: string, petitioner: string, respondent: string){
    return this.webService.get(
      `cases/charts=${query}?court=${court}&judgement=${judgement}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}`
    );
  }
  getPieCharts(query:string, court:string, judgement:Array<string>, bench: string, petitioner: string, respondent: string){
    return this.webService.get(
      `cases/piecharts=${query}?court=${court}&judgement=${judgement}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}`
    );
  }
  getPetitionerChart(query:string, court:string, bench: string, petitioner: string, respondent: string){
    return this.webService.get(
      `cases/ptncharts=${query}?court=${court}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}`
    );
  }
  getRespondentChart(query:string, court:string, bench: string, petitioner: string, respondent: string){
    return this.webService.get(
      `cases/respcharts=${query}?court=${court}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}`
    );
  }
  getPtn_v_BenchChart(query:string, court:string, bench: string, petitioner: string, respondent: string){
    return this.webService.get(
      `cases/pvbcharts=${query}?court=${court}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}`
    );
  }
  getRsp_v_BenchChart(query:string, court:string, bench: string, petitioner: string, respondent: string){
    return this.webService.get(
      `cases/rvbcharts=${query}?court=${court}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}`
    );
  }
  getCitedCases(query:string, court:string, judgement:Array<string>, bench: string, petitioner: string, respondent: string){
    return this.webService.get(
      `cases/cited_cases=${query}?court=${court}&judgement=${judgement}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}`
    );  
  }
  getCitedLaws(query:string, court:string, judgement:Array<string>, bench: string, petitioner: string, respondent: string){
    return this.webService.get(
      `cases/cited_laws=${query}?court=${court}&judgement=${judgement}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}`
    );  
  }
  getLists() {
    return this.webService.get('lists');
  }
}

export class DataService {
  constructor(private http: HttpClient) { }
  getUsers() {
    return this.http.get('https://jsonplaceholder.typicode.com/users')
  } 
}

