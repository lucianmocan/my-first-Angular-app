import { TestBed } from '@angular/core/testing';

import { UtilizatorService } from './utilizator.service';

describe('UtilizatorService', () => {
  let service: UtilizatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilizatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
