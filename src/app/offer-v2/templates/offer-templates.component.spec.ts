import { ComponentFixture, TestBed } from "@angular/core/testing";
import OfferTemplatesComponent from "./offer-templates.component";

describe("OfferTemplatesComponent", () => {
  let component: OfferTemplatesComponent;
  let fixture: ComponentFixture<OfferTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferTemplatesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
