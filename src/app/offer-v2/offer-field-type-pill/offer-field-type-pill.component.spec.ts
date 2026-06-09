import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferFieldTypePillComponent } from './offer-field-type-pill.component';

describe('OfferFieldTypePillComponent', () => {
  let component: OfferFieldTypePillComponent;
  let fixture: ComponentFixture<OfferFieldTypePillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferFieldTypePillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferFieldTypePillComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
