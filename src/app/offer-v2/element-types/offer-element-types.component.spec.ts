import { ComponentFixture, TestBed } from "@angular/core/testing";
import OfferElementTypesComponent from "./offer-element-types.component";

describe("OfferElementTypesComponent", () => {
  let component: OfferElementTypesComponent;
  let fixture: ComponentFixture<OfferElementTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferElementTypesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferElementTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
