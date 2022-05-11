import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoursStepperJobDialogComponent } from './hours-stepper-job-dialog.component';

describe('HoursStepperJobDialogComponent', () => {
  let component: HoursStepperJobDialogComponent;
  let fixture: ComponentFixture<HoursStepperJobDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoursStepperJobDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoursStepperJobDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
