import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCalendarComponent } from './event-calendar.component';

describe('CalendarComponent', () => {
  let component: EventCalendarComponent;
  let fixture: ComponentFixture<EventCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EventCalendarComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
