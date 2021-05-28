import { Injectable } from '@angular/core';
import { WebService } from '../web.service';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private webService: WebService) {}

  sendMessage(FormData: any) {
    var payload = {
      contactName: FormData.contactFormName,
      contactEmail: FormData.contactFormEmail,
      contactSubject: FormData.contactFormSubject,
      contactMessage: FormData.contactFormMessage,
    };
    return this.webService.post('/sendEmail', payload);
  }
}
