import { ComponentFixture, TestBed } from "@angular/core/testing";
import OfferCalculationInputComponent from "./offer-calculation-input.component";

describe("OfferCalculationInputComponent", () => {
  let component: OfferCalculationInputComponent;
  let fixture: ComponentFixture<OfferCalculationInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferCalculationInputComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferCalculationInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
