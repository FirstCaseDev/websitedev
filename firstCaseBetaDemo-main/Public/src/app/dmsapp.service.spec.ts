import { TestBed } from '@angular/core/testing';

import { DmsappService } from './dmsapp.service';

describe('DmsappService', () => {
  let service: DmsappService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DmsappService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
