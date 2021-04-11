import { Injectable } from '@angular/core';
import { WebService } from '../web.service';

@Injectable({
  providedIn: 'root'
})
export class CasedocService {

  constructor(private webService: WebService) { }

  getCaseDoc(_id: String) {
    return this.webService.get(`cases/_id=${_id}`)
  }
  
}
