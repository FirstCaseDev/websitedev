import { Injectable } from '@angular/core';
import { WebService } from '../web.service';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  constructor(private webService: WebService) {}

  getCurrentUser(username: string) {
    return this.webService.get(`/users/${username}`);
  }
}
