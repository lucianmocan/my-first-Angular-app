import { TestBed } from '@angular/core/testing';

import { FootballWidgetService } from './football-widget.service';

describe('FootballWidgetService', () => {
  let service: FootballWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FootballWidgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
