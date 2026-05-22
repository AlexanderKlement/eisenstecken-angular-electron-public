import { ComponentFixture, TestBed } from "@angular/core/testing";
import OfferFieldsEditComponent from "./offer-fields-edit.component";

describe("OfferFieldsEditComponent", () => {
  let component: OfferFieldsEditComponent;
  let fixture: ComponentFixture<OfferFieldsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferFieldsEditComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferFieldsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
