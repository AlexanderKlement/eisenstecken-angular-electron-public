import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCalendarDayComponent } from './event-calendar-day.component';

describe('EventCalendarDayComponent', () => {
  let component: EventCalendarDayComponent;
  let fixture: ComponentFixture<EventCalendarDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EventCalendarDayComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCalendarDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
