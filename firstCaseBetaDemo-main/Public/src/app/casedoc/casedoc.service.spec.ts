import { TestBed } from '@angular/core/testing';

import { CasedocService } from './casedoc.service';

describe('CasedocService', () => {
  let service: CasedocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CasedocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
