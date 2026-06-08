import { ComponentFixture, TestBed } from "@angular/core/testing";
import OfferUnitsComponent from "./offer-units.component";

describe("OfferUnitsComponent", () => {
  let component: OfferUnitsComponent;
  let fixture: ComponentFixture<OfferUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferUnitsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
