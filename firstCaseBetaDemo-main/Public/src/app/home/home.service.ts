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
 
  getIndSCCount() {
    return this.webService.get('ind_supreme_court_count')
  }

  getIndHCCount() {
      return this.webService.get('high_court_count')
    }
  
  getIndTribunalCount() {
    return this.webService.get('ind_tribunal_count')
  }

  getSgSCCount() {
    return this.webService.get('singapore_court_count')
  }

  getViews() {
    return this.webService.get('ga_views')
  }

}
