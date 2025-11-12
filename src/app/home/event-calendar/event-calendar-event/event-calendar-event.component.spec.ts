import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCalendarEventComponent } from './event-calendar-event.component';

describe('EventCalendarEventComponent', () => {
  let component: EventCalendarEventComponent;
  let fixture: ComponentFixture<EventCalendarEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EventCalendarEventComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCalendarEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
