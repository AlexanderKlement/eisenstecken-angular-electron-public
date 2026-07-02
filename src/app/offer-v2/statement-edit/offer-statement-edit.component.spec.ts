import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferStatementEditComponent } from './offer-statement-edit.component';

describe('OfferStatementEditComponent', () => {
  let component: OfferStatementEditComponent;
  let fixture: ComponentFixture<OfferStatementEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferStatementEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferStatementEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
