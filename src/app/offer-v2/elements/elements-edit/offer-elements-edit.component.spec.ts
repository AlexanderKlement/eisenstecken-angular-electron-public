import { ComponentFixture, TestBed } from "@angular/core/testing";
import OfferElementsEditComponent from "./offer-elements-edit.component";

describe("OfferElementsEditComponent", () => {
  let component: OfferElementsEditComponent;
  let fixture: ComponentFixture<OfferElementsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferElementsEditComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferElementsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
