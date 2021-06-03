import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SpacyService {
  readonly SPACY_APP_URL;

  constructor(private http: HttpClient) {
    this.SPACY_APP_URL =
      'http://localhost:8080/http://localhost:5200/spacytest';
  }

  get(uri: string) {
    return this.http.get(`${this.SPACY_APP_URL}/${uri}`);
  }
}
