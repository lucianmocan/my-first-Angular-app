import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootballWidgetComponent } from './football-widget.component';

describe('FootballWidgetComponent', () => {
  let component: FootballWidgetComponent;
  let fixture: ComponentFixture<FootballWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FootballWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FootballWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
