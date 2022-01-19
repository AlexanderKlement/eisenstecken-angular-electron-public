import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPageSettingsComponent } from './info-page-settings.component';

describe('InfoPageSettingsComponent', () => {
  let component: InfoPageSettingsComponent;
  let fixture: ComponentFixture<InfoPageSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPageSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPageSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
