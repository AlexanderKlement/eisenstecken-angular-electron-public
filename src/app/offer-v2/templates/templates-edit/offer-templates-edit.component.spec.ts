import { ComponentFixture, TestBed } from "@angular/core/testing";
import OfferTemplatesEditComponent from "./offer-templates-edit.component";

describe("OfferTemplatesEditComponent", () => {
  let component: OfferTemplatesEditComponent;
  let fixture: ComponentFixture<OfferTemplatesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferTemplatesEditComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferTemplatesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
