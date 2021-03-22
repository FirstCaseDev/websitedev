import { Injectable } from '@angular/core';
declare let gtag: Function;

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  constructor() {}
  static eventEmitter(
    eventName: string,
    eventCategory: string,
    eventAction: string,
    eventLabel: string = '',
    eventValue: number = 0
  ) {
    gtag('event', eventName, {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction,
      eventValue: eventValue,
    });
    console.log(eventName, eventCategory, eventAction, eventLabel, eventValue);
  }
}
