import { ComponentFixture, TestBed } from "@angular/core/testing";
import OfferFieldsComponent from "./offer-fields.component";

describe("OfferFieldsComponent", () => {
  let component: OfferFieldsComponent;
  let fixture: ComponentFixture<OfferFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferFieldsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
