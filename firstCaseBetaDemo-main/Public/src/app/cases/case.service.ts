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
    totalquery: string,
    courts: Array<Number>,
    judgement: Array<string>,
    bench: string,
    petitioner: string,
    respondent: string,
    page: number,
    limit: number,
    curr_sort: string,
    y_floor: Number,
    y_ceil: Number,
    country: String
  ) {
    return this.webService.get(
      `cases/query=${totalquery}?&courts=${courts}&judgement=${judgement}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}&page=${page}&limit=${limit}&sortBy=${curr_sort}&y_floor=${y_floor}&y_ceil=${y_ceil}&country=${country}`
    );
  }

  getCitedCases(
    query: string,
    court: Array<Number>,
    judgement: Array<string>,
    bench: string,
    petitioner: string,
    respondent: string,
    y_floor: Number,
    y_ceil: Number,
    country: String
  ) {
    return this.webService.get(
      `cases/cited_cases=${query}?courts=${court}&judgement=${judgement}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}&y_floor=${y_floor}&y_ceil=${y_ceil}&country=${country}`
    );
  }

  getCitedActs(
    query: string,
    court: Array<Number>,
    judgement: Array<string>,
    bench: string,
    petitioner: string,
    respondent: string,
    y_floor: Number,
    y_ceil: Number,
    country: String
  ) {
    return this.webService.get(
      `cases/cited_provisions=${query}?courts=${court}&judgement=${judgement}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}&y_floor=${y_floor}&y_ceil=${y_ceil}&country=${country}`
    );
  }

  getPieCharts(
    query: string,
    court: Array<Number>,
    judgement: Array<string>,
    bench: string,
    petitioner: string,
    respondent: string,
    y_floor: Number,
    y_ceil: Number,
    country: String
  ) {
    return this.webService.get(
      `cases/piecharts=${query}?courts=${court}&judgement=${judgement}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}&y_floor=${y_floor}&y_ceil=${y_ceil}&country=${country}`
    );
  }

  getLineCharts(
    query: string,
    court: Array<Number>,
    judgement: Array<string>,
    bench: string,
    petitioner: string,
    respondent: string,
    y_floor: Number,
    y_ceil: Number,
    country: String
  ) {
    return this.webService.get(
      `cases/charts=${query}?courts=${court}&judgement=${judgement}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}&y_floor=${y_floor}&y_ceil=${y_ceil}&country=${country}`
    );
  }

  getPetitionerChart(
    query: string,
    court: Array<Number>,
    judgement: Array<string>,
    bench: string,
    petitioner: string,
    respondent: string,
    y_floor: Number,
    y_ceil: Number,
    country: String
  ) {
    return this.webService.get(
      `cases/ptncharts=${query}?courts=${court}&judgement=${judgement}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}&y_floor=${y_floor}&y_ceil=${y_ceil}&country=${country}`
    );
  }

  getRespondentChart(
    query: string,
    court: Array<Number>,
    judgement: Array<string>,
    bench: string,
    petitioner: string,
    respondent: string,
    y_floor: Number,
    y_ceil: Number,
    country: String
  ) {
    return this.webService.get(
      `cases/respcharts=${query}?courts=${court}&judgement=${judgement}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}&y_floor=${y_floor}&y_ceil=${y_ceil}&country=${country}`
    );
  }

  getPtn_v_BenchChart(
    query: string,
    court: Array<Number>,
    judgement: Array<string>,
    bench: string,
    petitioner: string,
    respondent: string,
    y_floor: Number,
    y_ceil: Number,
    country: String
  ) {
    return this.webService.get(
      `cases/pvbcharts=${query}?courts=${court}&judgement=${judgement}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}&y_floor=${y_floor}&y_ceil=${y_ceil}&country=${country}`
    );
  }

  getRsp_v_BenchChart(
    query: string,
    court: Array<Number>,
    judgement: Array<string>,
    bench: string,
    petitioner: string,
    respondent: string,
    y_floor: Number,
    y_ceil: Number,
    country: String
  ) {
    return this.webService.get(
      `cases/rvbcharts=${query}?courts=${court}&judgement=${judgement}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}&y_floor=${y_floor}&y_ceil=${y_ceil}&country=${country}`
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
    y_ceil: Number,
  ) {
    return this.webService.get(
      `cases/cited_laws=${query}?court=${court}&judgement=${judgement}&bench=${bench}&ptn=${petitioner}&rsp=${respondent}&y_floor=${y_floor}&y_ceil=${y_ceil}`
    );
  }

  getLists() {
    return this.webService.get('lists');
  }

  getCaseURL(title: string, index: number) {
    return this.webService.get(`cases/case_table_item=${title}?index=${index}`);
  }
  getAutocomplete(text: string, ) {
    return this.webService.get(`cases/autocomplete=${text}`);
  }
}
