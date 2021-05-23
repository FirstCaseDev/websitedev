import { Injectable } from '@angular/core';
import { WebService } from '../web.service';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private webService: WebService) {}

  getCases() {
    return this.webService.get('cases');
  }
  getLists() {
    return this.webService.get('lists');
  }

  getTotalCount() {
    return this.webService.get(`total_count`);
  }
  
  getCourtCount() {
    return this.webService.get('court_count')
  }
}
