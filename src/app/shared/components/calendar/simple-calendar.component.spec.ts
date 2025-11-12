import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleCalendarComponent } from './simple-calendar.component';

describe('CalendarComponent', () => {
  let component: SimpleCalendarComponent;
  let fixture: ComponentFixture<SimpleCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SimpleCalendarComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
