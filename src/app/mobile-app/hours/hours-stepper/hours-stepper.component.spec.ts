import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoursStepperComponent } from './hours-stepper.component';

describe('HoursStepperComponent', () => {
  let component: HoursStepperComponent;
  let fixture: ComponentFixture<HoursStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoursStepperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoursStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
