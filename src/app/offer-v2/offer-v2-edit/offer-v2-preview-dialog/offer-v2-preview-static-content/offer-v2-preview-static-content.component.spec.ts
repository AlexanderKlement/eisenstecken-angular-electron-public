import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OfferV2PreviewStaticContentComponent } from "./offer-v2-preview-static-content.component";

describe("OfferV2PreviewFooterComponent", () => {
  let component: OfferV2PreviewStaticContentComponent;
  let fixture: ComponentFixture<OfferV2PreviewStaticContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferV2PreviewStaticContentComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OfferV2PreviewStaticContentComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
