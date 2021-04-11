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

  getSearchedCases(
    query: string,
    courts: Array<string>,
    judgement: Array<string>,
    bench: string,
    petitioner: string,
    respondent: string,
    page: number,
    limit: number,
    curr_sort: string,
    y_floor: Number,
    y_ceil: Number
  ) {
    // console.log("courts",courts);
    return this.webService.get(
      `cases/query=${query}?&courts=${courts}&judgement=${judgement}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}&page=${page}&limit=${limit}&sortBy=${curr_sort}&y_floor=${y_floor}&y_ceil=${y_ceil}`
    );
  }

  getCitedCases(
    query: string,
    court: Array<string>,
    judgement: Array<string>,
    bench: string,
    petitioner: string,
    respondent: string,
    y_floor: Number,
    y_ceil: Number
  ) {
    return this.webService.get(
      `cases/cited_cases=${query}?courts=${court}&judgement=${judgement}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}&y_floor=${y_floor}&y_ceil=${y_ceil}`
    );
  }

  getLineCharts(
    query: string,
    court: string,
    judgement: Array<string>,
    bench: string,
    petitioner: string,
    respondent: string,
    y_floor: Number,
    y_ceil: Number
  ) {
    return this.webService.get(
      `cases/charts=${query}?court=${court}&judgement=${judgement}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}&y_floor=${y_floor}&y_ceil=${y_ceil}`
    );
  }

  getPieCharts(
    query: string,
    court: string,
    judgement: Array<string>,
    bench: string,
    petitioner: string,
    respondent: string,
    y_floor: Number,
    y_ceil: Number
  ) {
    return this.webService.get(
      `cases/piecharts=${query}?court=${court}&judgement=${judgement}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}&y_floor=${y_floor}&y_ceil=${y_ceil}`
    );
  }

  getPetitionerChart(
    query: string,
    court: string,
    bench: string,
    petitioner: string,
    respondent: string,
    y_floor: Number,
    y_ceil: Number
  ) {
    return this.webService.get(
      `cases/ptncharts=${query}?court=${court}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}&y_floor=${y_floor}&y_ceil=${y_ceil}`
    );
  }

  getRespondentChart(
    query: string,
    court: string,
    bench: string,
    petitioner: string,
    respondent: string,
    y_floor: Number,
    y_ceil: Number
  ) {
    return this.webService.get(
      `cases/respcharts=${query}?court=${court}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}&y_floor=${y_floor}&y_ceil=${y_ceil}`
    );
  }

  getPtn_v_BenchChart(
    query: string,
    court: string,
    bench: string,
    petitioner: string,
    respondent: string,
    y_floor: Number,
    y_ceil: Number
  ) {
    return this.webService.get(
      `cases/pvbcharts=${query}?court=${court}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}&y_floor=${y_floor}&y_ceil=${y_ceil}`
    );
  }

  getRsp_v_BenchChart(
    query: string,
    court: string,
    bench: string,
    petitioner: string,
    respondent: string,
    y_floor: Number,
    y_ceil: Number
  ) {
    return this.webService.get(
      `cases/rvbcharts=${query}?court=${court}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}&y_floor=${y_floor}&y_ceil=${y_ceil}`
    );
  }



  getCitedLaws(
    query: string,
    court: string,
    judgement: Array<string>,
    bench: string,
    petitioner: string,
    respondent: string,
    y_floor: Number,
    y_ceil: Number
  ) {
    return this.webService.get(
      `cases/cited_laws=${query}?court=${court}&judgement=${judgement}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}&y_floor=${y_floor}&y_ceil=${y_ceil}`
    );
  }

  getCitedActs(
    query: string,
    court: string,
    judgement: Array<string>,
    bench: string,
    petitioner: string,
    respondent: string,
    y_floor: Number,
    y_ceil: Number
  ) {
    return this.webService.get(
      `cases/cited_acts=${query}?court=${court}&judgement=${judgement}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}&y_floor=${y_floor}&y_ceil=${y_ceil}`
    );
  }

  getLists() {
    return this.webService.get('lists');
  }
}
