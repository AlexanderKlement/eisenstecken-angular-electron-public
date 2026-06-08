import { ComponentFixture, TestBed } from "@angular/core/testing";
import OfferElementTypesEditComponent from "./offer-element-types-edit.component";

describe("OfferElementTypesEditComponent", () => {
  let component: OfferElementTypesEditComponent;
  let fixture: ComponentFixture<OfferElementTypesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferElementTypesEditComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferElementTypesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
