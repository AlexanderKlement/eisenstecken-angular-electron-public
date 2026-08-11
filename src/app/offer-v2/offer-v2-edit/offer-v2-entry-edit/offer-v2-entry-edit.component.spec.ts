import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferV2EntryEditComponent } from './offer-v2-entry-edit.component';

describe('OfferV2EntryEditComponent', () => {
  let component: OfferV2EntryEditComponent;
  let fixture: ComponentFixture<OfferV2EntryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferV2EntryEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferV2EntryEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
