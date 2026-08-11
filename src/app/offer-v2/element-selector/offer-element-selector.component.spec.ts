import { ComponentFixture, TestBed } from "@angular/core/testing";
import OfferElementSelectorComponent from "./offer-element-selector.component";

describe("OfferElementSelectorComponent", () => {
  let component: OfferElementSelectorComponent;
  let fixture: ComponentFixture<OfferElementSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferElementSelectorComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferElementSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
