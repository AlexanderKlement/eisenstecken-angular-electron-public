import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoursStepperDriveDialogComponent } from './hours-stepper-drive-dialog.component';

describe('HoursStepperDriveDialogComponent', () => {
  let component: HoursStepperDriveDialogComponent;
  let fixture: ComponentFixture<HoursStepperDriveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoursStepperDriveDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoursStepperDriveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
