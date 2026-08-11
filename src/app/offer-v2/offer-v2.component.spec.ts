import { ComponentFixture, TestBed } from "@angular/core/testing";

import OfferV2Component from "./offer-v2.component";

describe("OfferV2Component", () => {
  let component: OfferV2Component;
  let fixture: ComponentFixture<OfferV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferV2Component]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
