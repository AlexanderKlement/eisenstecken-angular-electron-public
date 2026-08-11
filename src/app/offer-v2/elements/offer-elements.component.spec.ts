import { ComponentFixture, TestBed } from "@angular/core/testing";
import OfferElementsComponent from "./offer-elements.component";

describe("OfferElementsComponent", () => {
  let component: OfferElementsComponent;
  let fixture: ComponentFixture<OfferElementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferElementsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
