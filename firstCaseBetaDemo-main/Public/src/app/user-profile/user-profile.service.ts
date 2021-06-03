import { Injectable } from '@angular/core';
import { DmsappService } from '../dmsapp.service';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  constructor(private dmsAppService: DmsappService) {}

  getCurrentUser(username: string) {
    return this.dmsAppService.get(`/users/${username}`);
  }
}
