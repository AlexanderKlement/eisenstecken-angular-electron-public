import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCalendarDialogComponent } from './event-calendar-dialog.component';

describe('EventCalendarDialogComponent', () => {
  let component: EventCalendarDialogComponent;
  let fixture: ComponentFixture<EventCalendarDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EventCalendarDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCalendarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
