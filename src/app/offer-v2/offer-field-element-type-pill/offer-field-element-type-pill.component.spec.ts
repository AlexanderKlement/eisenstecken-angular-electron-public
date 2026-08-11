import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OfferFieldElementTypePillComponent } from "./offer-field-element-type-pill.component";

describe("OfferFieldElementTypePillComponent", () => {
  let component: OfferFieldElementTypePillComponent;
  let fixture: ComponentFixture<OfferFieldElementTypePillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferFieldElementTypePillComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OfferFieldElementTypePillComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
