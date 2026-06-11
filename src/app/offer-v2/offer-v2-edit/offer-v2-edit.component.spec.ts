import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferV2EditComponent } from './offer-v2-edit.component';

describe('OfferV2EditComponent', () => {
  let component: OfferV2EditComponent;
  let fixture: ComponentFixture<OfferV2EditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferV2EditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferV2EditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
