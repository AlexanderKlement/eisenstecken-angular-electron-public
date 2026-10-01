import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramSettingsComponent } from './program-settings.component';

describe('ProgramSettingsComponent', () => {
  let component: ProgramSettingsComponent;
  let fixture: ComponentFixture<ProgramSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramSettingsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
