import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCalendarWeekComponent } from './event-calendar-week.component';

describe('EventCalendarWeekComponent', () => {
  let component: EventCalendarWeekComponent;
  let fixture: ComponentFixture<EventCalendarWeekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventCalendarWeekComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCalendarWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
